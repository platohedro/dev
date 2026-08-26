-- Permite que quienes administran noticias eliminen contenido desde el panel.
-- Eventos, productos y residentes ya usan políticas de gestión que incluyen DELETE.
drop policy if exists "news admins can delete" on public.news;
create policy "news admins can delete" on public.news
  for delete to authenticated using (public.is_news_admin());

notify pgrst, 'reload schema';
