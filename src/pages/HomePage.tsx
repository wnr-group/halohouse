import { ArrowRight, Play } from "lucide-react";
import { CameraScrollSection } from "../components/CameraScrollSection";
import { BrandSlider } from "../components/BrandSlider";
import { KeyStats } from "../components/KeyStats";

import { HeroVideo } from "../components/ui/HeroVideo";

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-[88px]"
      style={{ backgroundColor: "#0A1628"  }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full  pb-8 ">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="flex items-center justify-center px-8 md:px-10 lg:px-8 pt-4 pb-20">
          <div className="max-w-xl">
            <h1
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light mb-8 leading-[0.9]"
              style={{ color: "#FFF" }}
            >
              <span className="block">Step Into</span>
              <span className="block whitespace-nowrap">Your Spotlight</span>
            </h1>

            <p
              className="text-xl md:text-2xl lg:text-3xl mb-12"
              style={{ color: "#FFF", opacity: 0.9 }}
            >
              A home-studio built for creators who want premium-looking podcasts
              without the hassle. Walk in with ideas, walk out with content.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button
                className="group px-10 py-5 text-sm tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-3 font-medium"
                style={{ backgroundColor: "#FDB913", color: "#0A1628" }}
              >
                Book Your Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                className="px-10 py-5 text-sm tracking-widest uppercase hover:bg-[#0A1628]/10 transition-all flex items-center justify-center gap-3 font-medium"
                style={{
                  backgroundColor: "#FDB913",
                  border: "1px solid rgba(10, 22, 40, 0.3)",
                  color: "#0A1628",
                }}
              >
                View Gallery
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
         {/* RIGHT SIDE – VISUALLY BALANCED REEL VIDEO */}
<div className="flex items-start justify-center px-5 md:px-10 lg:px-8 pt-4 pb-0">
  <div
    className="
      relative
      mt-10
      w-[320px]
      md:w-[360px]
      lg:w-[400px]
      aspect-[9/16]
      rounded-2xl
      overflow-hidden
      shadow-2xl
      bg-black
    "
  >
    <HeroVideo />
  </div>
</div>


      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      
      {/* SECTION 1: HERO (Cream Background) */}
      <HeroSection />

      {/* SECTION 2: CAMERA SCROLL EFFECT (Pinned, Navy Background) */}
      <CameraScrollSection />

      {/* SECTION 3: BRAND SLIDER (Separate section, no nesting) */}
      <section style={{ backgroundColor: "#081E36", marginTop: 0 }}>
        <BrandSlider />
      </section>

      {/* SECTION 4: KEY STATS (Separate section, no nesting) */}
      <KeyStats />
      
    </>
  );
}
