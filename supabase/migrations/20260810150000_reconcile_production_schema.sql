-- Reconciliación de cambios que existían en producción y habían sido
-- ejecutados manualmente. Es idempotente para permitir su uso en staging.

do $$
begin
  create type public.donation_frequency as enum ('one_time', 'monthly');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.fulfillment_status as enum (
    'not_applicable',
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  );
exception
  when duplicate_object then null;
end
$$;

alter table public.orders
  add column if not exists fulfillment_status public.fulfillment_status
  not null default 'not_applicable';

alter table public.orders
  add column if not exists shipping_cost_cop integer
  not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_shipping_cost_cop_check'
  ) then
    alter table public.orders
      add constraint orders_shipping_cost_cop_check
      check (shipping_cost_cop >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_kind_total_check'
  ) then
    alter table public.orders
      add constraint orders_kind_total_check
      check (
        (kind = 'donation'::public.order_kind
          and fulfillment_status = 'not_applicable'::public.fulfillment_status)
        or kind = 'product'::public.order_kind
      );
  end if;
end
$$;

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  frequency public.donation_frequency not null,
  impact_tier integer,
  donor_message text,
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;

create or replace function public.is_news_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(
    array[
      'super_admin'::public.app_role,
      'news_admin'::public.app_role
    ]
  );
$$;

revoke execute on function public.is_news_admin() from public;
grant execute on function public.is_news_admin() to authenticated;

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  content text,
  cover_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news enable row level security;

drop policy if exists "published news are public" on public.news;
drop policy if exists "news admins can insert" on public.news;
drop policy if exists "news admins can update" on public.news;

create policy "published news are public"
  on public.news for select to anon, authenticated
  using (is_published or public.is_news_admin());

create policy "news admins can insert"
  on public.news for insert to authenticated
  with check (public.is_news_admin());

create policy "news admins can update"
  on public.news for update to authenticated
  using (public.is_news_admin())
  with check (public.is_news_admin());

drop policy if exists "payment admins read donations" on public.donations;
create policy "payment admins read donations"
  on public.donations for select to authenticated
  using (public.is_payment_admin());

create index if not exists donations_order_id_idx
  on public.donations(order_id);

create index if not exists orders_fulfillment_status_idx
  on public.orders(fulfillment_status);

notify pgrst, 'reload schema';
