create index if not exists events_published_starts_at_idx
  on public.events (starts_at)
  where is_published = true;

create index if not exists products_published_created_at_idx
  on public.products (created_at desc)
  where is_published = true;

create index if not exists residents_published_year_idx
  on public.residents (residency_year desc)
  where is_published = true;

notify pgrst, 'reload schema';
