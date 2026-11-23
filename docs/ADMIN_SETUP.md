# Projects, Blog & Admin — setup guide

## Architecture

```
Browser ──► Next.js (Vercel)
             ├─ /                 ISR (5 min): top featured projects + latest 3 posts
             ├─ /projects         ISR: all projects, tech-stack filter
             ├─ /blog             ISR: tabs All / My Posts / Tech Feed
             ├─ /blog/[slug]      personal → full Markdown; synced → summary + "Read Full Article"
             ├─ /admin            protected (middleware + server check + RLS)
             └─ /api/sync-blogs   GET (Vercel Cron, Bearer CRON_SECRET) · POST (admin button)
                                   └─ service-role upsert into `blogs` (onConflict external_url)
Supabase: Postgres (projects, blogs) · Auth (email/password) · RLS
```

* **Public reads** use the anon key and are limited by RLS (`blogs`: `published = true` only).
* **Writes** from /admin use the signed-in user's JWT; RLS accepts them only when the JWT email equals the admin email (`is_admin()`).
* **RSS sync** uses the service-role key (server only). It is reachable only with `CRON_SECRET` or an admin session.
* Without Supabase env vars the site still works: projects fall back to `src/data/portfolio.ts`, the blog section is hidden.
* Synced posts store only title, ≤280-char excerpt, link and cover image URL; readers are sent to the publisher. Edit sources in `src/lib/feeds.ts`.

## Environment variables

| Name | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + .env.local | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + .env.local | public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + .env.local | **secret**, server only, bypasses RLS |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Vercel + .env.local | the only email allowed in /admin |
| `CRON_SECRET` | Vercel + .env.local | long random string (`openssl rand -hex 32`) |

## Steps

1. Create a Supabase project.
2. Open `supabase/migrations/0001_projects_blogs.sql`, replace `REPLACE_WITH_ADMIN_EMAIL` with your admin email, then run it in **SQL Editor**.
3. **Authentication → Providers → Email**: turn **off** "Allow new users to sign up". **Authentication → Users → Add user**: create your admin user (email + password, auto-confirm).
4. Add the five env vars in Vercel (all environments) and redeploy.
5. Locally run `npm install` and commit the updated `package-lock.json`.
6. Visit `/admin/login`, sign in, then press **Sync Tech Blogs Now** on the Blogs tab.

## Notes

* The admin email must match in three places: `NEXT_PUBLIC_ADMIN_EMAIL`, the Supabase user, and `is_admin()` in the SQL.
* To change the admin email later: `create or replace function public.is_admin()` again with the new address.
* Feed URLs were not live-tested when written; the sync result panel shows per-feed errors — fix or remove a feed in `src/lib/feeds.ts`.
* Cron runs daily at 03:00 UTC (`vercel.json`). Vercel sends `Authorization: Bearer $CRON_SECRET` automatically when `CRON_SECRET` is set.
* Deleting a synced article lets the next sync re-import it; use the **Published** toggle to hide it permanently.
