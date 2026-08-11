-- Recurring donations are represented locally; Wompi only receives each
-- individual charge created by the server with a payment_source_id.

alter type public.donation_frequency add value if not exists 'annual';

do $$
begin
  create type public.donation_subscription_status as enum (
    'active',
    'paused',
    'cancelled',
    'past_due',
    'expired'
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.donation_subscriptions (
  id uuid primary key default gen_random_uuid(),
  donor_email text not null,
  donor_name text,
  amount_cop integer not null check (amount_cop >= 1000),
  frequency public.donation_frequency not null,
  status public.donation_subscription_status not null default 'active',
  wompi_payment_source_id bigint not null,
  last_transaction_id uuid references public.orders(id),
  next_charge_at timestamptz not null,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.donations
  add column if not exists subscription_id uuid
  references public.donation_subscriptions(id);

alter table public.donation_subscriptions enable row level security;

drop policy if exists "payment admins read donation subscriptions" on public.donation_subscriptions;
create policy "payment admins read donation subscriptions"
  on public.donation_subscriptions for select to authenticated
  using (public.is_payment_admin());

create index if not exists donation_subscriptions_due_idx
  on public.donation_subscriptions(status, next_charge_at);

create index if not exists donations_subscription_id_idx
  on public.donations(subscription_id);

notify pgrst, 'reload schema';
