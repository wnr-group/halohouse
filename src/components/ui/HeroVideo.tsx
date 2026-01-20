
import heroVideo from "../../assets/hero-video.mp4"

export function HeroVideo() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional overlay (remove if not needed) */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
