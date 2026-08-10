-- ============================================================
-- Scope adjustments: remove Studio Capabilities admin-editing,
-- replace single extra-link pair with a repeatable link list.
-- ============================================================

-- Studio Capabilities is reverting to hardcoded/static content.
drop table if exists homepage_capabilities;

-- Replace the single extra_link_label/url pair with a proper
-- repeatable child table.
alter table site_settings
  drop column if exists extra_link_label,
  drop column if exists extra_link_url;

create table site_extra_links (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  url         text not null,
  sort_order  int not null default 0,
  created_at  timestamptz default now()
);

alter table site_extra_links enable row level security;
create policy "Public can read site_extra_links" on site_extra_links for select to anon using (true);
create policy "Authenticated full access to site_extra_links" on site_extra_links for all to authenticated using (true) with check (true);
grant select, insert, update, delete on public.site_extra_links to authenticated;
grant select on public.site_extra_links to anon;