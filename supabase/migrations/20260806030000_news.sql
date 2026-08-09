create table if not exists public.news (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  title text not null, summary text, content text, cover_image_url text,
  is_published boolean not null default false, published_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.news enable row level security;
drop policy if exists "published news are public" on public.news;
drop policy if exists "news admins can insert" on public.news;
drop policy if exists "news admins can update" on public.news;
create policy "published news are public" on public.news for select to anon, authenticated using (is_published or public.is_news_admin());
create policy "news admins can insert" on public.news for insert to authenticated with check (public.is_news_admin());
create policy "news admins can update" on public.news for update to authenticated using (public.is_news_admin()) with check (public.is_news_admin());
notify pgrst, 'reload schema';
