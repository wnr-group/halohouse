-- HaloHouse Database Restore Script
-- Run this against a new Supabase project to recreate everything

-- ============================================================
-- TABLES
-- ============================================================

create table jobs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  department  text,
  location    text,
  type        text,
  experience  text,
  description text,
  responsibilities text,
  requirements text,
  status      text default 'draft',
  created_at  timestamptz default now()
);

create table job_applications (
  id              uuid primary key default gen_random_uuid(),
  job_id          uuid references jobs(id),
  email           text not null,
  linkedin_url    text,
  resume_url      text,
  experience      text,
  contact_number  text,
  location        text,
  created_at      timestamptz default now()
);

create table contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text,
  created_at  timestamptz default now()
);

create table book_sessions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  service     text,
  message     text,
  created_at  timestamptz default now()
);

-- ============================================================
-- RLS (public insert for forms, authenticated read for admin)
-- ============================================================

alter table jobs enable row level security;
alter table job_applications enable row level security;
alter table contact_messages enable row level security;
alter table book_sessions enable row level security;

-- Public can read published jobs
create policy "Public can read published jobs" on jobs
  for select to anon using (status = 'published');

-- Authenticated can do everything with jobs
create policy "Authenticated full access to jobs" on jobs
  for all to authenticated using (true) with check (true);

-- Public can insert applications, contact messages, book sessions
create policy "Public can insert job_applications" on job_applications
  for insert to anon with check (true);
create policy "Authenticated full access to job_applications" on job_applications
  for all to authenticated using (true) with check (true);

create policy "Public can insert contact_messages" on contact_messages
  for insert to anon with check (true);
create policy "Authenticated full access to contact_messages" on contact_messages
  for all to authenticated using (true) with check (true);

create policy "Public can insert book_sessions" on book_sessions
  for insert to anon with check (true);
create policy "Authenticated full access to book_sessions" on book_sessions
  for all to authenticated using (true) with check (true);

-- ============================================================
-- STORAGE
-- ============================================================
-- After running this SQL, create a public bucket named "resumes" in the dashboard
-- Then upload files from supabase-backup/resumes/applications/
