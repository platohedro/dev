create table if not exists public.event_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 3 and 160),
  summary text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  address text,
  city text not null default 'Medellín',
  category text,
  cover_image_url text,
  registration_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

alter table public.event_admins enable row level security;
alter table public.events enable row level security;

create or replace function public.is_event_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.event_admins where user_id = auth.uid()) $$;

revoke execute on function public.is_event_admin() from public;
grant execute on function public.is_event_admin() to authenticated;

drop policy if exists "event admins can see themselves" on public.event_admins;
drop policy if exists "published events are public" on public.events;
drop policy if exists "event admins can insert" on public.events;
drop policy if exists "event admins can update" on public.events;
drop policy if exists "event admins can delete" on public.events;

create policy "event admins can see themselves" on public.event_admins
  for select to authenticated using (user_id = auth.uid());
create policy "published events are public" on public.events
  for select to anon, authenticated using (is_published or public.is_event_admin());
create policy "event admins can insert" on public.events
  for insert to authenticated with check (public.is_event_admin());
create policy "event admins can update" on public.events
  for update to authenticated using (public.is_event_admin()) with check (public.is_event_admin());
create policy "event admins can delete" on public.events
  for delete to authenticated using (public.is_event_admin());

create or replace function public.set_event_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at before update on public.events
  for each row execute procedure public.set_event_updated_at();
