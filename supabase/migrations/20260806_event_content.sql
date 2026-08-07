alter table public.events add column if not exists content text;
notify pgrst, 'reload schema';
