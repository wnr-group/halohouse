import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { videoPublicUrl } from "../../lib/videoUpload";

// Fallback to today's known file if the hero_video row is ever missing,
// so the homepage never breaks.
const FALLBACK_HERO_VIDEO_URL =
  "https://tnfdwldpetfwwogkfuic.supabase.co/storage/v1/object/public/portfolio-videos/hero-video.mp4";

export function HeroVideo() {
  const [videoUrl, setVideoUrl] = useState(FALLBACK_HERO_VIDEO_URL);
  const [posterUrl, setPosterUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchHeroVideo = async () => {
      const { data, error } = await supabase
        .from("hero_video")
        .select("file_path, poster_path")
        .eq("id", 1)
        .single();

      if (error || !data) return;

      setVideoUrl(videoPublicUrl(data.file_path));
      if (data.poster_path) {
        setPosterUrl(videoPublicUrl(data.poster_path));
      }
    };

    fetchHeroVideo();
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <video
        key={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={posterUrl}
        className="w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}