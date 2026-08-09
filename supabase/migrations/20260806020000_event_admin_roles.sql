-- Compatibilidad entre la tabla inicial event_admins y los roles editoriales.
-- Un superadmin o events_admin puede gestionar eventos; también se respetan
-- las cuentas ya registradas en public.event_admins.
create or replace function public.is_event_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.event_admins where user_id = auth.uid()
  ) or exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role in ('super_admin'::public.app_role, 'events_admin'::public.app_role)
  );
$$;

revoke execute on function public.is_event_admin() from public;
grant execute on function public.is_event_admin() to authenticated;
