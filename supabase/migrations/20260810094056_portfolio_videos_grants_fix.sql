-- Fix: RLS policies alone are not enough — Postgres also requires
-- explicit table-level GRANTs before those policies are ever evaluated.
-- These were missed in 20260810000001_portfolio_videos_admin.sql.

grant select, insert, update, delete on public.portfolio_videos to authenticated;
grant select on public.portfolio_videos to anon;

grant select, insert, update, delete on public.hero_video to authenticated;
grant select on public.hero_video to anon;