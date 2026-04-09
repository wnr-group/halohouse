import React, { useRef } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { SEO } from "../components/SEO";
import { Volume2, VolumeX } from "lucide-react";

import CarRace from "../assets/Portfolio/car-race-project-out.mov";
import KeralaAi from "../assets/Portfolio/Kerala-Ai created video.mp4";
import NeuroOut from "../assets/Portfolio/Neuro-out.mp4";
import Valentine from "../assets/Portfolio/Feb 5 - valentine_.mp4";
import DenimJacket from "../assets/Portfolio/Denim-Jacket.mp4";
import HarryPotter from "../assets/Portfolio/Harry-potter.mp4";
import Comfort from "../assets/Portfolio/Comfort.mp4";
import KeralaShake from "../assets/Portfolio/kerala-shake.mp4";
import Upsc from "../assets/Portfolio/Upsc.mp4";

export function PortfolioPage() {
  // Detect mobile (no hover devices)
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  // Track currently playing video
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  const portfolioItems = [
    { id: 1, title: "Car Race", category: "Commercial", video: CarRace },
    { id: 2, title: "Kerala AI", category: "Reels", video: KeralaAi },
    { id: 3, title: "Neuro", category: "Studio", video: NeuroOut },
    { id: 4, title: "Valentine", category: "Reels", video: Valentine },
    {
      id: 5,
      title: "Denim Jacket",
      category: "Commercial",
      video: DenimJacket,
    },
    { id: 6, title: "Harry Potter", category: "Reels", video: HarryPotter },
    { id: 7, title: "Comfort", category: "Commercial", video: Comfort },
    { id: 8, title: "Kerala Shake", category: "Reels", video: KeralaShake },
    { id: 9, title: "Upsc", category: "Commercial", video: Upsc },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <SEO
        title="Our Portfolio | Featured Creative Work | Halo House"
        description="Explore the premium podcasts and videos created at Halo House."
      />

      <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Header */}
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

        {/* AUTO HIGHLIGHT CAROUSEL */}
<div className="overflow-hidden mb-16 ">
  <div className="flex gap-6 w-max animate-scroll">
    {[...portfolioItems, ...portfolioItems].map((item, index) => (
      <div
        key={index}
        className="relative flex-shrink-0 min-w-[200px] md:min-w-[240px] lg:min-w-[280px] aspect-[9/16] rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105"

      >
        <video
          src={item.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
</div>
       
        {/* Flex*/}
        <div className="
  flex flex-col gap-8
  md:flex-row
  md:overflow-x-auto
  md:snap-x md:snap-mandatory
  pb-6
">


          {portfolioItems.map((item) => {
            const videoRef = useRef<HTMLVideoElement | null>(null);
            const [isAudioOn, setIsAudioOn] = React.useState(false);
            const [isPlaying, setIsPlaying] = React.useState(false);
            // Hover play (desktop preview)
            const handleHoverPlay = () => {
              if (!videoRef.current || isMobile) return;

              if (
                activeVideoRef.current &&
                activeVideoRef.current !== videoRef.current
              ) {
                activeVideoRef.current.pause();
                activeVideoRef.current.currentTime = 0;
              }

              videoRef.current.muted = true;
              videoRef.current.play();
              setIsPlaying(true);
              activeVideoRef.current = videoRef.current;
            };

            // Hover leave
            const handleHoverLeave = () => {
              if (!videoRef.current || isMobile) return;
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
              setIsPlaying(false);
            };

            // Click / Tap play with sound
            const handleClickPlay = () => {
              if (!videoRef.current) return;

              const video = videoRef.current;

              if (activeVideoRef.current && activeVideoRef.current !== video) {
                activeVideoRef.current.pause();
                activeVideoRef.current.currentTime = 0;
              }

              if (video.paused) {
                video.muted = false;
                video.play();
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
                key={item.id}
                className="group relative w-full sm:min-w-[260px] md:min-w-[320px] lg:min-w-[380px] aspect-[9/16]"

                whileHover={!isMobile ? { scale: 1.08 } : undefined}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onMouseEnter={handleHoverPlay}
                onMouseLeave={handleHoverLeave}
                onClick={handleClickPlay}
              >
                {/* Video */}
                <video
                  ref={videoRef}
                  src={item.video}
                  loop
                  playsInline
                  preload="metadata"
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Category Badge */}
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

                {/* Play Icon */}
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
          })}
        </div>
      </div>
    </div>
  );
}  