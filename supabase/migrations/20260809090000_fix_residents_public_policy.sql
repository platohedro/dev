-- La lectura publica no debe depender de funciones reservadas a administradores.
drop policy if exists "published residents are public" on public.residents;

create policy "published residents are public" on public.residents
  for select to anon, authenticated
  using (is_published);

notify pgrst, 'reload schema';
