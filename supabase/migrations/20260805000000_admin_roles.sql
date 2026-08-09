-- Roles del panel administrativo. Ejecuta esta migración antes de las
-- migraciones de eventos, noticias, tienda y residencias.
do $$ begin
  create type public.app_role as enum ('super_admin', 'events_admin', 'news_admin', 'store_admin', 'residency_admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(required_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = any(required_roles)
  );
$$;

create or replace function public.is_news_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(array['super_admin'::public.app_role, 'news_admin'::public.app_role]);
$$;

revoke execute on function public.has_role(public.app_role[]) from public;
revoke execute on function public.is_news_admin() from public;
grant execute on function public.has_role(public.app_role[]) to authenticated;
grant execute on function public.is_news_admin() to authenticated;

drop policy if exists "users can read their own roles" on public.user_roles;
create policy "users can read their own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

notify pgrst, 'reload schema';
