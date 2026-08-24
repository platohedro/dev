-- Reserve product stock while a Wompi checkout is pending.
-- The order, order items and stock update must succeed or fail together.

alter table public.orders
  add column if not exists stock_reserved boolean not null default false;

create index if not exists orders_stock_reserved_idx
  on public.orders(stock_reserved, status)
  where stock_reserved = true;

create or replace function public.create_wompi_order(
  p_reference text,
  p_kind public.order_kind,
  p_total_cop integer,
  p_customer_email text,
  p_customer_name text,
  p_items jsonb
) returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_product public.products;
  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_total integer := 0;
  v_seen_ids uuid[] := '{}'::uuid[];
begin
  if p_kind = 'donation'::public.order_kind then
    if jsonb_typeof(coalesce(p_items, '[]'::jsonb)) <> 'array'
       or jsonb_array_length(coalesce(p_items, '[]'::jsonb)) <> 0 then
      raise exception 'invalid_items';
    end if;

    insert into public.orders (
      reference, kind, total_cop, customer_email, customer_name
    )
    values (
      p_reference, p_kind, p_total_cop, p_customer_email, p_customer_name
    )
    returning * into v_order;
    return v_order;
  end if;

  if p_kind <> 'product'::public.order_kind
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'invalid_items';
  end if;

  insert into public.orders (
    reference, kind, total_cop, customer_email, customer_name, stock_reserved
  )
  values (
    p_reference, p_kind, p_total_cop, p_customer_email, p_customer_name, true
  )
  returning * into v_order;

  for v_item in select value from jsonb_array_elements(p_items) loop
    begin
      v_product_id := (v_item ->> 'product_id')::uuid;
      v_quantity := (v_item ->> 'quantity')::integer;
    exception
      when invalid_text_representation then
        raise exception 'invalid_items';
    end;

    if v_quantity is null or v_quantity < 1 or v_quantity > 99
       or v_product_id = any(v_seen_ids) then
      raise exception 'invalid_items';
    end if;
    v_seen_ids := array_append(v_seen_ids, v_product_id);

    -- FOR UPDATE serializes simultaneous reservations for the same product.
    select * into v_product
    from public.products
    where id = v_product_id and is_published = true
    for update;
    if not found then raise exception 'product_unavailable'; end if;
    if v_product.stock < v_quantity then raise exception 'insufficient_stock'; end if;

    update public.products
    set stock = stock - v_quantity, updated_at = now()
    where id = v_product_id;

    v_total := v_total + (v_product.price_cop * v_quantity);
    insert into public.order_items (
      order_id, product_id, quantity, unit_price_cop, product_snapshot
    )
    values (
      v_order.id,
      v_product.id,
      v_quantity,
      v_product.price_cop,
      jsonb_build_object(
        'name', v_product.name,
        'slug', v_product.slug,
        'description', v_product.description,
        'image_url', v_product.image_url
      )
    );
  end loop;

  if v_total <> p_total_cop then raise exception 'payment_mismatch'; end if;
  return v_order;
end;
$$;

revoke all on function public.create_wompi_order(text, public.order_kind, integer, text, text, jsonb) from public;

create or replace function public.finalize_wompi_order(
  p_reference text,
  p_transaction_id text,
  p_status text,
  p_payment_method_type text,
  p_amount_in_cents integer,
  p_currency text,
  p_finalized_at timestamptz
) returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item record;
begin
  select * into v_order
  from public.orders
  where reference = p_reference
  for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_order.total_cop * 100 <> p_amount_in_cents or p_currency <> 'COP' then
    raise exception 'payment_mismatch';
  end if;

  -- A terminal order must not be moved backwards by a late webhook.
  if v_order.status in ('approved', 'declined', 'voided', 'error') then
    return v_order;
  end if;

  insert into public.payment_transactions (
    order_id, wompi_transaction_id, reference, status, payment_method_type,
    amount_in_cents, currency, finalized_at
  )
  values (
    v_order.id, p_transaction_id, p_reference, p_status, p_payment_method_type,
    p_amount_in_cents, p_currency, p_finalized_at
  )
  on conflict (wompi_transaction_id) do update set
    status = excluded.status,
    payment_method_type = excluded.payment_method_type,
    finalized_at = excluded.finalized_at,
    updated_at = now();

  if p_status = 'APPROVED' then
    -- Orders created before this migration did not reserve stock. Keep their
    -- approval path safe while new orders use the atomic reservation above.
    if v_order.kind = 'product'::public.order_kind and not v_order.stock_reserved then
      for v_item in
        select product_id, quantity
        from public.order_items
        where order_id = v_order.id
      loop
        update public.products
        set stock = stock - v_item.quantity, updated_at = now()
        where id = v_item.product_id and stock >= v_item.quantity;
        if not found then raise exception 'insufficient_stock'; end if;
      end loop;
    end if;

    update public.orders
    set status = 'approved', stock_reserved = false, updated_at = now(),
        wompi_transaction_id = p_transaction_id
    where id = v_order.id
    returning * into v_order;
    return v_order;
  end if;

  if p_status in ('DECLINED', 'VOIDED', 'ERROR') and v_order.stock_reserved then
    for v_item in
      select product_id, quantity
      from public.order_items
      where order_id = v_order.id
    loop
      update public.products
      set stock = stock + v_item.quantity, updated_at = now()
      where id = v_item.product_id;
    end loop;
  end if;

  update public.orders
  set status = case p_status
      when 'DECLINED' then 'declined'::public.order_status
      when 'VOIDED' then 'voided'::public.order_status
      when 'ERROR' then 'error'::public.order_status
      else status
    end,
    stock_reserved = false,
    updated_at = now(),
    wompi_transaction_id = p_transaction_id
  where id = v_order.id
  returning * into v_order;
  return v_order;
end;
$$;

revoke all on function public.finalize_wompi_order(text, text, text, text, integer, text, timestamptz) from public;

notify pgrst, 'reload schema';
