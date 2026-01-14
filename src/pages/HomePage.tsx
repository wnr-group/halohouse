import { ArrowRight, Play } from "lucide-react";
import { CameraScrollSection } from "../components/CameraScrollSection";
import { BrandSlider } from "../components/BrandSlider";
import { KeyStats } from "../components/KeyStats";

import { HeroCamera3D } from "../components/HeroCamera3D";

function HeroSection() {
  return (
    <section
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[60vh]">
          {/* LEFT COLUMN: Text Content */}
          <div className="text-left z-10 relative">
            <h1
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light mb-8 leading-[0.9]"
              style={{ color: "#0A1628" }}
            >
              Step into your spotlight
            </h1>

            <p
              className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-xl"
              style={{ color: "#0A1628", opacity: 0.9 }}
            >
              A home-studio built for creators who want premium-looking podcasts
              without the hassle. Walk in with ideas, walk out with content.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-start">
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
                  border: "1px solid rgba(10, 22, 40, 0.3)",
                  color: "#0A1628",
                }}
              >
                View Gallery
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Camera */}
          <div className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center">
            <HeroCamera3D />
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
