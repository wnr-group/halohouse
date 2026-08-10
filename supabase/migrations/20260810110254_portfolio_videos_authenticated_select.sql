-- Fix: supabase.storage.download() hits the authenticated object endpoint,
-- which enforces RLS on storage.objects. Only an "anon" select policy
-- existed (for public video playback via the public URL) — there was no
-- select policy for "authenticated", so admin-side downloads (used to
-- backfill portfolio video thumbnails) were silently blocked with a 404.

create policy "Authenticated users can read portfolio videos"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'portfolio-videos' );