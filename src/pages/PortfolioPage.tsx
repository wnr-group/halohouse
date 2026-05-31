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

// Carousel: one video plays at a time, cycles automatically.
// All video elements stay mounted (ref array) — only active one plays.
// This avoids the detach/reattach bug where videoRef.current is null
// after React unmounts the previously-active <video>.
function PortfolioCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIndex) {
        const targetSrc = videoUrl(portfolioItems[i].file);
        if (v.src !== targetSrc) {
          v.src = targetSrc;
          v.addEventListener('canplay', () => v.play().catch(() => {}), { once: true });
        } else {
          v.play().catch(() => {});
        }
      } else {
        v.pause();
      }
    });
  }, [activeIndex]);

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
            {/* Video always in DOM — only active one plays */}
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              muted
              playsInline
              onEnded={() => {
                if (index === activeIndex) {
                  setActiveIndex((prev) => (prev + 1) % portfolioItems.length);
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            />
            {index !== activeIndex && (
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
function PortfolioCard({
  item,
  activeVideoRef,
}: {
  item: typeof portfolioItems[number];
  activeVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
}) {
  // Evaluated once at mount — avoids a fresh matchMedia call on every render.
  const isMobileRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );
  const isMobile = isMobileRef.current;

  const videoRef = useVideoInView(videoUrl(item.file));
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
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
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
            <PortfolioCard key={item.id} item={item} activeVideoRef={activeVideoRef} />
          ))}
        </div>
      </div>
    </div>
  );
}
