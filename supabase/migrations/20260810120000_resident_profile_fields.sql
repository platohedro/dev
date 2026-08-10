-- Datos opcionales para las páginas individuales del directorio de residencias.
alter table public.residents add column if not exists image_url text;

notify pgrst, 'reload schema';
