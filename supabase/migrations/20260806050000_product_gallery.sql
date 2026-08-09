alter table public.products add column if not exists exchange_rate numeric(12,2) not null default 4000;
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null, position integer not null default 0, created_at timestamptz not null default now()
);
alter table public.product_images enable row level security;
drop policy if exists "product images public" on public.product_images;
drop policy if exists "store admins manage product images" on public.product_images;
create policy "product images public" on public.product_images for select to anon, authenticated using (exists (select 1 from public.products p where p.id=product_id and (p.is_published or public.is_store_admin())));
create policy "store admins manage product images" on public.product_images for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
notify pgrst, 'reload schema';
