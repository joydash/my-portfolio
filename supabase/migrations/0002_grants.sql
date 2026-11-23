-- Fixes "permission denied for table projects" in /admin.
-- Row Level Security decides WHICH rows; these GRANTs decide whether the role may touch the table at all.
-- Both are required. Safe to run more than once.
grant usage on schema public to anon, authenticated;

grant select on public.projects, public.blogs to anon, authenticated;
grant insert, update, delete on public.projects, public.blogs to authenticated;
-- anon gets no write privileges; authenticated writes are still limited to the admin email by RLS (is_admin()).
