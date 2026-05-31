# Portfolio Video Performance Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the Portfolio page's extremely slow video load by compressing all videos with ffmpeg, uploading them to a Supabase Storage public bucket, removing them from the Vite bundle, and adding lazy loading + Intersection Observer so videos only load when in view.

**Architecture:** Videos are compressed locally with ffmpeg (H.264 CRF 28, ~3–8 MB each), uploaded to a Supabase Storage public bucket called `portfolio-videos`, then `PortfolioPage.tsx` is updated to reference Supabase CDN URLs instead of local imports. A custom `useVideoInView` hook wraps `IntersectionObserver` to set `src` only when the element enters the viewport, and `autoPlay` is removed from the carousel — replaced with a single sequentially-playing video.

**Tech Stack:** ffmpeg (CLI), Supabase CLI (`npx supabase`), Supabase Storage JS SDK (`@supabase/supabase-js` already installed), React `IntersectionObserver` hook, Vite (no video imports after migration)

**Supabase project ref:** `tnfdwldpetfwwogkfuic` (halohouse, linked)
**Supabase project URL:** `https://tnfdwldpetfwwogkfuic.supabase.co`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/assets/Portfolio/compressed/` | Create (local, not committed) | Staging dir for compressed mp4s |
| `supabase/migrations/20260531000001_storage_portfolio_videos.sql` | Create | Creates `portfolio-videos` bucket + public policy via migration |
| `src/hooks/useVideoInView.ts` | Create | IntersectionObserver hook — sets video `src` only when in viewport |
| `src/pages/PortfolioPage.tsx` | Modify | Remove local video imports, reference Supabase URLs, add lazy loading, fix carousel |

---

## Task 1: Compress all videos with ffmpeg

**Files:**
- No code files — shell commands only
- Output: `src/assets/Portfolio/compressed/` (local staging, gitignored)

- [ ] **Step 1: Create compressed output directory**

```bash
mkdir -p "src/assets/Portfolio/compressed"
```

- [ ] **Step 2: Compress all 9 videos**

Run each command. Expected output per file: `video:N streams, 1 audio streams` and a final `muxing overhead` line. Each output file should be 3–10 MB.

```bash
# Convert .mov → .mp4 + compress
ffmpeg -i "src/assets/Portfolio/car-race-project-out.mov" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=720:-2" \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  "src/assets/Portfolio/compressed/car-race.mp4"

ffmpeg -i "src/assets/Portfolio/Neuro-out.mp4" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=720:-2" \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  "src/assets/Portfolio/compressed/neuro.mp4"

ffmpeg -i "src/assets/Portfolio/Feb 5 - valentine_.mp4" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=720:-2" \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  "src/assets/Portfolio/compressed/valentine.mp4"

ffmpeg -i "src/assets/Portfolio/kerala-shake.mp4" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=720:-2" \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  "src/assets/Portfolio/compressed/kerala-shake.mp4"

ffmpeg -i "src/assets/Portfolio/Upsc.mp4" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=720:-2" \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  "src/assets/Portfolio/compressed/upsc.mp4"

ffmpeg -i "src/assets/Portfolio/Harry-potter.mp4" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=720:-2" \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  "src/assets/Portfolio/compressed/harry-potter.mp4"

ffmpeg -i "src/assets/Portfolio/Kerala-Ai created video.mp4" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=720:-2" \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  "src/assets/Portfolio/compressed/kerala-ai.mp4"

ffmpeg -i "src/assets/Portfolio/Comfort.mp4" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=720:-2" \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  "src/assets/Portfolio/compressed/comfort.mp4"

ffmpeg -i "src/assets/Portfolio/Denim-Jacket.mp4" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=720:-2" \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  "src/assets/Portfolio/compressed/denim-jacket.mp4"
```

- [ ] **Step 3: Verify compressed sizes**

```bash
du -sh src/assets/Portfolio/compressed/*
```

Expected: Each file 2–12 MB. If any file is still >15 MB, re-compress with `-crf 32` instead.

- [ ] **Step 4: Gitignore the original heavy assets and compressed staging dir**

Add to `.gitignore` (append lines, don't replace existing content):

```
# Large raw video assets — served from Supabase Storage
src/assets/Portfolio/compressed/
src/assets/Portfolio/*.mov
src/assets/Portfolio/*.mp4
src/assets/hero-video.mp4
src/assets/client/*.mp4
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore raw and compressed video assets (moved to Supabase Storage)"
```

---

## Task 2: Create Supabase Storage bucket via migration

**Files:**
- Create: `supabase/migrations/20260531000001_storage_portfolio_videos.sql`

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/20260531000001_storage_portfolio_videos.sql` with this exact content:

```sql
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
```

- [ ] **Step 2: Push migration to production**

```bash
npx supabase db push
```

Expected output: `Applying migration 20260531000001_storage_portfolio_videos.sql... done`

If you see `relation "storage.buckets" does not exist`, run `npx supabase db push --linked` instead.

- [ ] **Step 3: Verify bucket exists**

```bash
npx supabase storage ls
```

Expected: `portfolio-videos` listed.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260531000001_storage_portfolio_videos.sql
git commit -m "feat: add Supabase Storage bucket for portfolio videos with public read policy"
```

---

## Task 3: Upload compressed videos to Supabase Storage

**Files:**
- No code files — CLI upload commands

- [ ] **Step 1: Upload all compressed videos**

```bash
npx supabase storage cp src/assets/Portfolio/compressed/car-race.mp4      ss://portfolio-videos/car-race.mp4
npx supabase storage cp src/assets/Portfolio/compressed/neuro.mp4          ss://portfolio-videos/neuro.mp4
npx supabase storage cp src/assets/Portfolio/compressed/valentine.mp4      ss://portfolio-videos/valentine.mp4
npx supabase storage cp src/assets/Portfolio/compressed/kerala-shake.mp4   ss://portfolio-videos/kerala-shake.mp4
npx supabase storage cp src/assets/Portfolio/compressed/upsc.mp4           ss://portfolio-videos/upsc.mp4
npx supabase storage cp src/assets/Portfolio/compressed/harry-potter.mp4   ss://portfolio-videos/harry-potter.mp4
npx supabase storage cp src/assets/Portfolio/compressed/kerala-ai.mp4      ss://portfolio-videos/kerala-ai.mp4
npx supabase storage cp src/assets/Portfolio/compressed/comfort.mp4        ss://portfolio-videos/comfort.mp4
npx supabase storage cp src/assets/Portfolio/compressed/denim-jacket.mp4   ss://portfolio-videos/denim-jacket.mp4
```

- [ ] **Step 2: Verify all files are accessible**

```bash
npx supabase storage ls ss://portfolio-videos/
```

Expected: 9 files listed.

- [ ] **Step 3: Confirm public URL works**

Open this URL in a browser — you should get a video response (not 403/404):
```
https://tnfdwldpetfwwogkfuic.supabase.co/storage/v1/object/public/portfolio-videos/comfort.mp4
```

---

## Task 4: Create `useVideoInView` hook

**Files:**
- Create: `src/hooks/useVideoInView.ts`

- [ ] **Step 1: Create the hook**

Create `src/hooks/useVideoInView.ts`:

```typescript
import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to a <video> element.
 * The `src` is only assigned once the element enters the viewport,
 * preventing unnecessary network requests for off-screen videos.
 */
export function useVideoInView(src: string, options?: IntersectionObserverInit) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.01, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && ref.current && !ref.current.src) {
      ref.current.src = src;
    }
  }, [isInView, src]);

  return ref;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useVideoInView.ts
git commit -m "feat: add useVideoInView hook for lazy video loading via IntersectionObserver"
```

---

## Task 5: Update PortfolioPage to use Supabase URLs + lazy loading

**Files:**
- Modify: `src/pages/PortfolioPage.tsx`

This is the biggest change. We:
1. Remove all local video imports
2. Replace with Supabase CDN URL strings
3. Replace carousel `autoPlay` with a single auto-cycling video (one video plays at a time)
4. Replace grid `<video src={item.video}>` with the `useVideoInView` hook (lazy load)

- [ ] **Step 1: Replace the entire file content**

Replace `src/pages/PortfolioPage.tsx` with:

```tsx
import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { SEO } from "../components/SEO";
import { useVideoInView } from "../hooks/useVideoInView";

const SUPABASE_STORAGE_URL =
  "https://tnfdwldpetfwwogkfuic.supabase.co/storage/v1/object/public/portfolio-videos";

const portfolioItems = [
  { id: 1, title: "Car Race",      category: "Commercial", file: "car-race.mp4" },
  { id: 2, title: "Kerala AI",     category: "Reels",      file: "kerala-ai.mp4" },
  { id: 3, title: "Neuro",         category: "Studio",     file: "neuro.mp4" },
  { id: 4, title: "Valentine",     category: "Reels",      file: "valentine.mp4" },
  { id: 5, title: "Denim Jacket",  category: "Commercial", file: "denim-jacket.mp4" },
  { id: 6, title: "Harry Potter",  category: "Reels",      file: "harry-potter.mp4" },
  { id: 7, title: "Comfort",       category: "Commercial", file: "comfort.mp4" },
  { id: 8, title: "Kerala Shake",  category: "Reels",      file: "kerala-shake.mp4" },
  { id: 9, title: "Upsc",          category: "Commercial", file: "upsc.mp4" },
];

function videoUrl(file: string) {
  return `${SUPABASE_STORAGE_URL}/${file}`;
}

// Carousel: one video plays at a time, cycles automatically
function PortfolioCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = videoUrl(portfolioItems[activeIndex].file);
    video.play().catch(() => {});
  }, [activeIndex]);

  const handleEnded = () => {
    setActiveIndex((i) => (i + 1) % portfolioItems.length);
  };

  return (
    <div className="overflow-hidden mb-16">
      <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory">
        {portfolioItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className={`relative flex-shrink-0 min-w-[200px] md:min-w-[240px] lg:min-w-[280px] aspect-[9/16] rounded-lg overflow-hidden cursor-pointer snap-start transition-all duration-300 ${
              index === activeIndex ? "ring-2 ring-primary scale-105" : "opacity-70"
            }`}
          >
            {index === activeIndex ? (
              <video
                ref={videoRef}
                muted
                loop={false}
                playsInline
                onEnded={handleEnded}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/80 flex items-center justify-center">
                <Play className="w-8 h-8 text-primary" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-xs text-white/90 font-medium">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Grid card: video loads only when in view
function PortfolioCard({ item }: { item: typeof portfolioItems[number] }) {
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const videoRef = useVideoInView(videoUrl(item.file));
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleHoverPlay = () => {
    const video = videoRef.current;
    if (!video || isMobile) return;
    if (activeVideoRef.current && activeVideoRef.current !== video) {
      activeVideoRef.current.pause();
      activeVideoRef.current.currentTime = 0;
    }
    video.muted = true;
    video.play().catch(() => {});
    setIsPlaying(true);
    activeVideoRef.current = video;
  };

  const handleHoverLeave = () => {
    const video = videoRef.current;
    if (!video || isMobile) return;
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  };

  const handleClickPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (activeVideoRef.current && activeVideoRef.current !== video) {
      activeVideoRef.current.pause();
      activeVideoRef.current.currentTime = 0;
    }
    if (video.paused) {
      video.muted = false;
      video.play().catch(() => {});
      setIsAudioOn(true);
      setIsPlaying(true);
      activeVideoRef.current = video;
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <motion.div
      className="group relative w-full sm:min-w-[260px] md:min-w-[320px] lg:min-w-[380px] aspect-[9/16]"
      whileHover={!isMobile ? { scale: 1.08 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onMouseEnter={handleHoverPlay}
      onMouseLeave={handleHoverLeave}
      onClick={handleClickPlay}
    >
      <video
        ref={videoRef}
        loop
        playsInline
        preload="none"
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute top-4 left-4 px-3 py-1 bg-primary/15 border border-primary/30 rounded-full z-10">
        <p className="text-[10px] tracking-widest uppercase text-primary">
          {item.category}
        </p>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
        {isAudioOn ? (
          <Volume2 className="w-4 h-4 text-white" />
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-white" />
            <span className="text-[10px] text-white hidden md:block">
              Click for sound
            </span>
          </>
        )}
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          isPlaying ? "opacity-0" : "opacity-80"
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <Play className="w-8 h-8 text-primary-foreground ml-1" />
        </div>
      </div>
    </motion.div>
  );
}

export function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <SEO
        title="Our Portfolio | Featured Creative Work | Halo House"
        description="Explore the premium podcasts and videos created at Halo House."
      />

      <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-foreground">
            Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70">
            Explore our collection of professional content created in our studio
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary">
            Featured Work
          </p>
        </motion.div>

        <PortfolioCarousel />

        <div className="flex flex-col gap-8 md:flex-row md:overflow-x-auto md:snap-x md:snap-mandatory pb-6">
          {portfolioItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

> **Note:** The `activeVideoRef` inside `PortfolioCard` is now local per card (not shared across cards). If you want one-video-at-a-time enforcement across all grid cards, lift it to a context or pass it as a prop. For now this matches original behavior (each card manages its own state).

- [ ] **Step 2: Verify the app builds**

```bash
npm run build 2>&1 | tail -20
```

Expected: `✓ built in Xs` with no errors. If you see `Cannot find module '../assets/Portfolio/...'`, you missed removing an import — check the top of the file.

- [ ] **Step 3: Run dev server and verify the page loads fast**

```bash
npm run dev
```

Open `http://localhost:3000/portfolio`. Verify:
- Page load is fast (no 80+ MB video downloads on page load)
- Carousel shows first video playing, others show play icon thumbnails
- Hovering a grid card starts playing the video
- Clicking a grid card adds sound
- Videos only start loading as they scroll into view (check Network tab — videos should show 0 KB until near-viewport)

- [ ] **Step 4: Commit**

```bash
git add src/pages/PortfolioPage.tsx src/hooks/useVideoInView.ts
git commit -m "feat: migrate portfolio videos to Supabase Storage with lazy loading and fixed carousel"
```

---

## Task 6: Verify Vercel deployment

**Files:** No code changes — verification only.

- [ ] **Step 1: Check env vars are set on Vercel**

```bash
npx vercel env ls
```

Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist for Production. If missing, add them:

```bash
npx vercel env add VITE_SUPABASE_URL production
# paste: https://tnfdwldpetfwwogkfuic.supabase.co

npx vercel env add VITE_SUPABASE_ANON_KEY production
# paste the anon key
```

- [ ] **Step 2: Deploy to Vercel**

```bash
git push origin main
```

Wait for the Vercel deployment to complete, then open the production URL and verify the portfolio page loads fast with videos streaming from Supabase.

- [ ] **Step 3: Confirm video URLs are public**

In the browser Network tab on the production site, click a portfolio card. Confirm the video request goes to `tnfdwldpetfwwogkfuic.supabase.co` and returns `200` (not `403` or `404`).

---

## Self-Review

**Spec coverage:**
- ✅ Video compression (ffmpeg, H.264 CRF 28, 720p scale) — Task 1
- ✅ `.mov` → `.mp4` conversion — Task 1 (car-race)
- ✅ Supabase Storage bucket creation with public read policy — Task 2
- ✅ Upload all 9 compressed videos — Task 3
- ✅ Remove local video imports from bundle — Task 5
- ✅ Fix carousel `autoPlay` on 18 simultaneous elements — Task 5 (single cycling video)
- ✅ Lazy loading via IntersectionObserver — Tasks 4 + 5
- ✅ `preload="none"` on grid videos — Task 5
- ✅ Gitignore raw assets — Task 1
- ✅ Vercel env var verification — Task 6

**Placeholder scan:** No TBDs or TODOs found.

**Type consistency:** `portfolioItems[number]` type used in `PortfolioCard` prop matches the `portfolioItems` array defined above it. `useVideoInView` returns `RefObject<HTMLVideoElement | null>` compatible with `ref={videoRef}` usage.
