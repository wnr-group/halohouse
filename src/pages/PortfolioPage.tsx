import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { SEO } from "../components/SEO";
import { useVideoInView } from "../hooks/useVideoInView";
import { supabase } from "../lib/supabase";
import { videoPublicUrl } from "../lib/videoUpload";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  file_path: string;
  poster_path: string | null;
  bg: string;
};

function PortfolioCard({
  item,
  activeVideoRef,
}: {
  item: PortfolioItem;
  activeVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
}) {
  const isMobileRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );
  const isMobile = isMobileRef.current;

  const videoRef = useVideoInView(videoPublicUrl(item.file_path));
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasThumbnail, setHasThumbnail] = useState(!!item.poster_path);
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
    activeVideoRef.current = null;
    setIsPlaying(false);
    setIsAudioOn(false);
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
    <div
      className={`group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer bg-gradient-to-b ${item.bg}`}
      onMouseEnter={handleHoverPlay}
      onMouseLeave={handleHoverLeave}
      onClick={handleClickPlay}
    >
      {/* Poster shows instantly; video fades in once it has loaded */}
      <video
        ref={videoRef}
        loop
        playsInline
        preload="metadata"
        muted
        poster={item.poster_path ? videoPublicUrl(item.poster_path) : undefined}
        onLoadedData={() => setHasThumbnail(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          hasThumbnail ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Persistent gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

      {/* Category badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-[10px] tracking-widest uppercase text-white font-medium">
          {item.category}
        </span>
      </div>

      {/* Audio indicator — only show when src is loading/loaded */}
      {hasThumbnail && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            {isAudioOn ? (
              <Volume2 className="w-3.5 h-3.5 text-white" />
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/70" />
                <span className="text-[9px] text-white/70 hidden md:block">Tap for sound</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Play button */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-200">
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </div>
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <p className="text-sm font-semibold text-white leading-tight">{item.title}</p>
      </div>
    </div>
  );
}

export function PortfolioPage() {
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      const { data, error } = await supabase
        .from("portfolio_videos")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching portfolio videos:", error);
        return;
      }

      setPortfolioItems(data || []);
    };

    fetchPortfolioItems();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <SEO
        title="Our Portfolio | Featured Creative Work | Halo House"
        description="Explore the premium podcasts and videos created at Halo House."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-5">Featured Work</p>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-foreground mb-4">
            Portfolio
          </h1>
          <p className="text-lg text-foreground/60 max-w-md">
            Professional content created at Halo House studio. Hover to preview, click for sound.
          </p>
        </motion.div>

        {/* 3-column responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
            >
              <PortfolioCard item={item} activeVideoRef={activeVideoRef} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
