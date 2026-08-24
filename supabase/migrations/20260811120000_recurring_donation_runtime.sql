alter table public.donation_subscriptions
  add column if not exists cancel_token_hash text unique;

alter table public.donation_subscriptions
  add column if not exists wompi_payment_source_type text not null default 'CARD';

create index if not exists donation_subscriptions_cancel_token_idx
  on public.donation_subscriptions(cancel_token_hash);

notify pgrst, 'reload schema';
