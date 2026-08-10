-- ============================================================
-- Admin-editable site settings, homepage content, and testimonials
-- ============================================================

-- Site-wide contact/social settings (single row)
create table site_settings (
  id                int primary key default 1,
  phone             text,
  whatsapp_number   text,
  email             text,
  address           text,
  instagram_url     text,
  youtube_url       text,
  extra_link_label  text,
  extra_link_url    text,
  updated_at        timestamptz default now(),
  constraint site_settings_single_row check (id = 1)
);

alter table site_settings enable row level security;
create policy "Public can read site_settings" on site_settings for select to anon using (true);
create policy "Authenticated full access to site_settings" on site_settings for all to authenticated using (true) with check (true);
grant select, insert, update, delete on public.site_settings to authenticated;
grant select on public.site_settings to anon;

-- Homepage hero content (single row)
create table homepage_content (
  id                  int primary key default 1,
  hero_line1          text,
  hero_line2_prefix   text,
  hero_highlight      text,
  hero_description    text,
  hero_button_text    text,
  updated_at          timestamptz default now(),
  constraint homepage_content_single_row check (id = 1)
);

alter table homepage_content enable row level security;
create policy "Public can read homepage_content" on homepage_content for select to anon using (true);
create policy "Authenticated full access to homepage_content" on homepage_content for all to authenticated using (true) with check (true);
grant select, insert, update, delete on public.homepage_content to authenticated;
grant select on public.homepage_content to anon;

-- Key Stats section (fixed 3 rows, editable)
create table homepage_stats (
  id          uuid primary key default gen_random_uuid(),
  icon_key    text not null,
  value       text not null,
  label       text not null,
  sort_order  int not null default 0
);

alter table homepage_stats enable row level security;
create policy "Public can read homepage_stats" on homepage_stats for select to anon using (true);
create policy "Authenticated full access to homepage_stats" on homepage_stats for all to authenticated using (true) with check (true);
grant select, insert, update, delete on public.homepage_stats to authenticated;
grant select on public.homepage_stats to anon;

-- Studio Capabilities section (fixed 6 rows, editable)
create table homepage_capabilities (
  id          uuid primary key default gen_random_uuid(),
  icon_key    text not null,
  title       text not null,
  description text,
  sort_order  int not null default 0
);

alter table homepage_capabilities enable row level security;
create policy "Public can read homepage_capabilities" on homepage_capabilities for select to anon using (true);
create policy "Authenticated full access to homepage_capabilities" on homepage_capabilities for all to authenticated using (true) with check (true);
grant select, insert, update, delete on public.homepage_capabilities to authenticated;
grant select on public.homepage_capabilities to anon;

-- Testimonials (full CRUD)
create table testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  company     text,
  message     text not null,
  rating      int not null default 5,
  avatar_url  text,
  sort_order  int not null default 0,
  created_at  timestamptz default now()
);

alter table testimonials enable row level security;
create policy "Public can read testimonials" on testimonials for select to anon using (true);
create policy "Authenticated full access to testimonials" on testimonials for all to authenticated using (true) with check (true);
grant select, insert, update, delete on public.testimonials to authenticated;
grant select on public.testimonials to anon;

-- ============================================================
-- Seed data — mirrors what is currently hardcoded in the app,
-- including the existing YouTube-link-points-to-Instagram quirk,
-- so nothing changes visually until an admin edits it.
-- ============================================================

insert into site_settings (id, phone, whatsapp_number, email, address, instagram_url, youtube_url)
values (
  1,
  '+91 8754706742',
  '+917010017080',
  'halohousechennai@gmail.com',
  'Philomina nagar Thanjavur, Sholingnallur Chennai.',
  'https://www.instagram.com/halohouse._/',
  'https://www.instagram.com/halohouse._/'
)
on conflict (id) do nothing;

insert into homepage_content (id, hero_line1, hero_line2_prefix, hero_highlight, hero_description, hero_button_text)
values (
  1,
  'Step Into',
  'Your',
  'Spotlight',
  'A home-studio built for creators who want premium-looking podcasts without the hassle. Walk in with ideas, walk out with content.',
  'Book Your Session'
)
on conflict (id) do nothing;

insert into homepage_stats (icon_key, value, label, sort_order) values
  ('users',     '20+',  'Clients',     1),
  ('video',     '500+', 'Videos',      2),
  ('briefcase', '5+',   'Industries',  3);

insert into homepage_capabilities (icon_key, title, description, sort_order) values
  ('camera',    'Pro Cameras',          'Crisp, multi-angle coverage',            1),
  ('lightbulb', 'Cinematic Lighting',   'Key, fill, and accent lighting',         2),
  ('mic2',      'Broadcast Mics',       'Clean, controlled sound',                3),
  ('users',     'Assistive Team',       'On-set help and guidance',               4),
  ('film',      'Post-Production',      'Editing and social clips',               5),
  ('calendar',  'Flexible Booking',     'Hourly or bundled sessions',             6);

insert into testimonials (name, role, company, message, rating, avatar_url, sort_order) values
  ('Aatchiyarkalvi', 'Client', 'Education Platform',
   'Thank you to the entire team for the excellent performance of the UPSC video sessions.',
   5, 'https://i.pravatar.cc/100?img=11', 1),
  ('Ganesh', 'Client', 'Jthillai Sales & Distribution',
   'Huge appreciation to the Term One video editors! Your creativity, dedication, and attention to detail truly stand out. The effort put into every frame is simply awesome. Great work and keep shining!',
   5, 'https://i.pravatar.cc/100?img=12', 2),
  ('Ragul', 'Client', 'Clothing Store',
   'Seriously no words to say. Editing super. Very good!',
   5, 'https://i.pravatar.cc/100?img=13', 3);