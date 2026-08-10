-- ============================================================
-- Portfolio video management (admin CRUD) + Hero video setting
-- ============================================================

-- Portfolio videos (replaces the hardcoded array in PortfolioPage.tsx)
create table portfolio_videos (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text,
  file_path   text not null,   -- object path inside the "portfolio-videos" bucket
  poster_path text,            -- optional thumbnail image path (same bucket), nullable
  bg          text,            -- tailwind gradient classes used as placeholder background
  sort_order  int not null default 0,
  created_at  timestamptz default now()
);

alter table portfolio_videos enable row level security;

create policy "Public can read portfolio_videos" on portfolio_videos
  for select to anon using (true);

create policy "Authenticated full access to portfolio_videos" on portfolio_videos
  for all to authenticated using (true) with check (true);

-- Hero video setting (single row, replaces the hardcoded HERO_VIDEO_URL constant)
create table hero_video (
  id          int primary key default 1,
  file_path   text not null,
  poster_path text,
  updated_at  timestamptz default now(),
  constraint hero_video_single_row check (id = 1)
);

alter table hero_video enable row level security;

create policy "Public can read hero_video" on hero_video
  for select to anon using (true);

create policy "Authenticated full access to hero_video" on hero_video
  for all to authenticated using (true) with check (true);

-- ============================================================
-- Allow poster image uploads (jpeg) into the existing bucket
-- ============================================================

update storage.buckets
set allowed_mime_types = array['video/mp4', 'video/quicktime', 'video/webm', 'image/jpeg']
where id = 'portfolio-videos';

-- ============================================================
-- Seed data — mirrors what is currently hardcoded in the app,
-- so nothing changes visually once the frontend switches to
-- reading from these tables.
-- ============================================================

insert into portfolio_videos (title, category, file_path, bg, sort_order) values
  ('Car Race',     'Commercial', 'car-race.mp4',     'from-yellow-950 to-amber-900', 1),
  ('Kerala AI',    'Reels',      'kerala-ai.mp4',    'from-sky-950 to-blue-900',     2),
  ('Neuro',        'Studio',     'neuro.mp4',        'from-violet-950 to-purple-900',3),
  ('Valentine',    'Reels',      'valentine.mp4',    'from-rose-950 to-pink-900',    4),
  ('Denim Jacket', 'Commercial', 'denim-jacket.mp4', 'from-slate-950 to-slate-800',  5),
  ('Harry Potter', 'Reels',      'harry-potter.mp4', 'from-stone-950 to-amber-950',  6),
  ('Comfort',      'Commercial', 'comfort.mp4',      'from-green-950 to-emerald-900',7),
  ('Kerala Shake', 'Reels',      'kerala-shake.mp4', 'from-orange-950 to-red-900',   8),
  ('Upsc',         'Commercial', 'upsc.mp4',         'from-blue-950 to-indigo-900',  9);

insert into hero_video (id, file_path) values (1, 'hero-video.mp4')
on conflict (id) do nothing;