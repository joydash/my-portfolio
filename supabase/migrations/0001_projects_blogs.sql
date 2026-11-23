-- =====================================================================
-- joydash.me — Projects + Tech Blog schema, indexes and Row Level Security
-- Run once in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. ADMIN IDENTITY  >>> CHANGE THE EMAIL BELOW <<<
--    It must be exactly the same address as NEXT_PUBLIC_ADMIN_EMAIL and as the
--    user you create in Supabase → Authentication → Users.
--    RLS checks the *signed JWT*, so nobody can fake this from the browser.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = lower('REPLACE_WITH_ADMIN_EMAIL'), false);
$$;

-- ---------------------------------------------------------------------
-- 1. PROJECTS
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(title) between 1 and 160),
  summary       text not null default '',
  tech_stack    text[] not null default '{}',
  live_url      text,
  github_url    text,
  image_url     text,
  featured      boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists projects_order_idx
  on public.projects (display_order asc, created_at desc);
create index if not exists projects_featured_idx
  on public.projects (featured, display_order asc);
create index if not exists projects_tech_stack_gin
  on public.projects using gin (tech_stack);

-- ---------------------------------------------------------------------
-- 2. BLOGS  (personal posts + auto-synced external articles)
-- ---------------------------------------------------------------------
create table if not exists public.blogs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(title) between 1 and 300),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary       text not null default '',
  content       text,                         -- Markdown; NULL for external posts
  cover_image   text,
  tags          text[] not null default '{}',
  source_type   text not null default 'personal'
                  check (source_type in ('personal', 'auto')),
  source_name   text not null default 'Joy Dash',
  external_url  text unique,                  -- dedupe key for synced posts (NULLs allowed)
  published     boolean not null default true,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),

  -- personal posts need a body; synced posts need a source link
  constraint blogs_personal_has_content
    check (source_type <> 'personal' or content is not null),
  constraint blogs_auto_has_external_url
    check (source_type <> 'auto' or external_url is not null)
);

create index if not exists blogs_public_idx
  on public.blogs (published, published_at desc);
create index if not exists blogs_source_idx
  on public.blogs (source_type, published, published_at desc);
create index if not exists blogs_tags_gin
  on public.blogs using gin (tags);

-- ---------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
--    * Everyone (anon + signed-in) can READ public data.
--    * Only the admin email can INSERT / UPDATE / DELETE.
--    * The RSS sync route uses the service-role key, which bypasses RLS.
-- ---------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.blogs    enable row level security;

drop policy if exists "projects_public_read"  on public.projects;
drop policy if exists "projects_admin_insert" on public.projects;
drop policy if exists "projects_admin_update" on public.projects;
drop policy if exists "projects_admin_delete" on public.projects;

create policy "projects_public_read" on public.projects
  for select to anon, authenticated
  using (true);

create policy "projects_admin_insert" on public.projects
  for insert to authenticated
  with check (public.is_admin());

create policy "projects_admin_update" on public.projects
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "projects_admin_delete" on public.projects
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "blogs_public_read"  on public.blogs;
drop policy if exists "blogs_admin_insert" on public.blogs;
drop policy if exists "blogs_admin_update" on public.blogs;
drop policy if exists "blogs_admin_delete" on public.blogs;

-- Public sees published posts only; the admin also sees hidden ones (to un-hide / delete).
create policy "blogs_public_read" on public.blogs
  for select to anon, authenticated
  using (published = true or public.is_admin());

create policy "blogs_admin_insert" on public.blogs
  for insert to authenticated
  with check (public.is_admin());

create policy "blogs_admin_update" on public.blogs
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "blogs_admin_delete" on public.blogs
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- 4. SEED: your current four projects (only when the table is empty)
-- ---------------------------------------------------------------------
insert into public.projects (title, summary, tech_stack, featured, display_order)
select v.title, v.summary, v.tech_stack, true, v.display_order
from (values
  (
    'LAN Design & Implementation with MikroTik Router & Cisco Switch',
    'Client-style network built as a team project during the data center internship: WAN configured on a MikroTik router with the LAN built on a Cisco switch.',
    array['MikroTik RouterOS','Cisco Switch','WAN/LAN','VLAN'],
    10
  ),
  (
    'Organization Network Design with Cisco Packet Tracer',
    'Multi-location organization network designed in simulation as CCNA practice, building the routing and switching foundation used in NOC work.',
    array['Cisco Packet Tracer','CCNA R&S','Routing','Switching'],
    20
  ),
  (
    'CompTIA A+ Hardware — Network & Server Practical Labs',
    'Hands-on labs from PC assembly and multi-boot OS setup to LAN/WAN, Windows Server roles (AD, DNS, DHCP, GPO), RAID, CCTV and network monitoring.',
    array['Windows Server','Active Directory','RAID','PRTG','Zabbix','Wireshark'],
    30
  ),
  (
    'Corporate Office CCTV Setup & Configuration',
    'CCTV system installed and configured for a corporate office: cameras connected to an NVR with proper network settings and secure remote access, regularly maintained.',
    array['IP cameras','NVR','Network configuration','Secure remote access'],
    40
  )
) as v(title, summary, tech_stack, display_order)
where not exists (select 1 from public.projects);
