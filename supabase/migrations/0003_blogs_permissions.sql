-- Fixes "permission denied for table blogs" in /admin (projects already work).
-- Idempotent: safe to run more than once. Does NOT touch your admin email in is_admin().

-- 1) Re-apply privileges on blogs (in case the earlier grant statement was only partly run)
grant usage on schema public to anon, authenticated;
grant select on public.blogs to anon, authenticated;
grant insert, update, delete on public.blogs to authenticated;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

-- 2) The blogs SELECT policy calls is_admin(); make that call independent of the caller's own privileges
alter function public.is_admin() security definer;
alter function public.is_admin() set search_path = public, auth;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- 3) Diagnostic: every row should be true / true / true (run separately if the error persists)
-- select has_table_privilege('authenticated','public.blogs','select')  as auth_select,
--        has_table_privilege('authenticated','public.blogs','insert')  as auth_insert,
--        has_table_privilege('anon','public.blogs','select')           as anon_select;
