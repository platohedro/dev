create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  name text not null, description text, image_url text,
  price_cop integer not null check (price_cop > 0), price_usd numeric(12,2) not null check (price_usd > 0),
  stock integer not null default 0 check (stock >= 0), is_published boolean not null default false,
  created_by uuid not null default auth.uid() references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create or replace function public.is_store_admin() returns boolean language sql stable security definer set search_path=public as $$
  select public.has_role(array['super_admin'::public.app_role, 'events_admin'::public.app_role])
$$;
drop policy if exists "published products are public" on public.products;
drop policy if exists "store admins manage products" on public.products;
create policy "published products are public" on public.products for select to anon, authenticated using (is_published or public.is_store_admin());
create policy "store admins manage products" on public.products for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg','image/png','image/webp'];
drop policy if exists "store admins upload product images" on storage.objects;
drop policy if exists "store admins read product images" on storage.objects;
create policy "store admins upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_store_admin());
create policy "store admins read product images" on storage.objects for select to authenticated using (bucket_id = 'product-images' and public.is_store_admin());
notify pgrst, 'reload schema';
