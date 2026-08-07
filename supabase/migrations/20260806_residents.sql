-- Directorio y mapa de residentes. Ejecuta este archivo en Supabase SQL Editor.
create table if not exists public.residents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nationality text not null,
  country text not null,
  country_lat numeric(9,6) not null check (country_lat between -90 and 90),
  country_lng numeric(9,6) not null check (country_lng between -180 and 180),
  residency_year integer not null check (residency_year between 2000 and 2100),
  project text,
  profile_url text,
  is_published boolean not null default false,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seguro para proyectos donde la tabla se hubiera creado antes de este campo.
alter table public.residents add column if not exists profile_url text;

alter table public.residents enable row level security;

create or replace function public.is_residency_admin() returns boolean
language sql stable security definer set search_path=public as $$
  select public.has_role(array['super_admin'::public.app_role, 'events_admin'::public.app_role])
$$;

drop policy if exists "published residents are public" on public.residents;
drop policy if exists "residency admins manage residents" on public.residents;
create policy "published residents are public" on public.residents
  for select to anon, authenticated using (is_published or public.is_residency_admin());
create policy "residency admins manage residents" on public.residents
  for all to authenticated using (public.is_residency_admin()) with check (public.is_residency_admin());

notify pgrst, 'reload schema';
