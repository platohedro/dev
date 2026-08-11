create type public.order_kind as enum ('donation', 'product');
create type public.order_status as enum ('pending', 'approved', 'declined', 'voided', 'error');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  kind public.order_kind not null,
  status public.order_status not null default 'pending',
  total_cop integer not null check (total_cop >= 1000),
  customer_email text,
  customer_name text,
  shipping_address jsonb,
  wompi_transaction_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  unit_price_cop integer not null check (unit_price_cop > 0),
  product_snapshot jsonb not null
);

create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  wompi_transaction_id text not null unique,
  reference text not null,
  status text not null,
  payment_method_type text,
  amount_in_cents integer not null,
  currency text not null,
  finalized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_created_at_idx on public.orders(status, created_at desc);
create index payment_transactions_reference_idx on public.payment_transactions(reference);
create index order_items_product_id_idx on public.order_items(product_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_transactions enable row level security;

create or replace function public.is_payment_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(array['super_admin'::public.app_role, 'store_admin'::public.app_role])
$$;
revoke execute on function public.is_payment_admin() from public;
grant execute on function public.is_payment_admin() to authenticated;

create policy "payment admins read orders" on public.orders for select to authenticated using (public.is_payment_admin());
create policy "payment admins read order items" on public.order_items for select to authenticated using (public.is_payment_admin());
create policy "payment admins read transactions" on public.payment_transactions for select to authenticated using (public.is_payment_admin());

create or replace function public.finalize_wompi_order(
  p_reference text,
  p_transaction_id text,
  p_status text,
  p_payment_method_type text,
  p_amount_in_cents integer,
  p_currency text,
  p_finalized_at timestamptz
) returns public.orders
language plpgsql security definer set search_path = public as $$
declare
  v_order public.orders;
  v_item record;
begin
  select * into v_order from public.orders where reference = p_reference for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_order.total_cop * 100 <> p_amount_in_cents or p_currency <> 'COP' then raise exception 'payment_mismatch'; end if;

  insert into public.payment_transactions (order_id, wompi_transaction_id, reference, status, payment_method_type, amount_in_cents, currency, finalized_at)
  values (v_order.id, p_transaction_id, p_reference, p_status, p_payment_method_type, p_amount_in_cents, p_currency, p_finalized_at)
  on conflict (wompi_transaction_id) do update set status = excluded.status, payment_method_type = excluded.payment_method_type, finalized_at = excluded.finalized_at, updated_at = now();

  if v_order.status = 'approved' and p_status <> 'APPROVED' then return v_order; end if;
  if p_status = 'APPROVED' and v_order.status <> 'approved' then
    for v_item in select product_id, quantity from public.order_items where order_id = v_order.id loop
      update public.products set stock = stock - v_item.quantity, updated_at = now()
      where id = v_item.product_id and stock >= v_item.quantity;
      if not found then raise exception 'insufficient_stock'; end if;
    end loop;
  end if;

  update public.orders set status = case p_status when 'APPROVED' then 'approved' when 'DECLINED' then 'declined' when 'VOIDED' then 'voided' when 'ERROR' then 'error' else status end,
    wompi_transaction_id = p_transaction_id, updated_at = now() where id = v_order.id returning * into v_order;
  return v_order;
end;
$$;
revoke all on function public.finalize_wompi_order(text, text, text, text, integer, text, timestamptz) from public;

notify pgrst, 'reload schema';
