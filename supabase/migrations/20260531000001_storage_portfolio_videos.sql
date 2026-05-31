-- Create public bucket for portfolio videos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-videos',
  'portfolio-videos',
  true,
  52428800,  -- 50 MB limit per file
  array['video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do nothing;

-- Allow anyone to read files (public CDN access)
create policy "Public read access for portfolio videos"
  on storage.objects for select
  to anon
  using ( bucket_id = 'portfolio-videos' );

-- Allow authenticated users (admin) to upload/delete
create policy "Authenticated users can upload portfolio videos"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'portfolio-videos' );

create policy "Authenticated users can delete portfolio videos"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'portfolio-videos' );
