import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CameraScrollSection } from "../components/CameraScrollSection";
import { BrandSlider } from "../components/BrandSlider";
import { KeyStats } from "../components/KeyStats";
import { StudioSection } from "../components/StudioSection";

import { HeroVideo } from "../components/ui/HeroVideo";

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #1a2d4a 50%, #0A1628 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle wave pattern overlay */}
        <div 
          className="absolute top-1/4 right-0 w-1/2 h-1/2 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23FDB913' d='M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: "cover",
          }}
        />
        {/* Gradient orb bottom right */}
        <div 
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #FDB913 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full pb-8 relative z-10">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="flex items-center justify-center px-8 md:px-10 lg:px-8 pt-4 pb-20">
          <div className="max-w-xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light mb-8 leading-[0.9]">
              <span 
                className="block italic"
                style={{ 
                  color: "#F5E6D3",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
                }}
              >
                Step Into
              </span>
              <span className="block whitespace-nowrap">
                <span 
                  className="italic"
                  style={{ 
                    color: "#F5E6D3",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
                  }}
                >
                  Your{" "}
                </span>
                <span 
                  style={{ 
                    color: "#FDB913",
                    textShadow: "0 0 30px rgba(253, 185, 19, 0.5), 0 0 60px rgba(253, 185, 19, 0.3)"
                  }}
                >
                  Spotlight
                </span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-[#F5E6D3]/80">
              A home-studio built for creators who want premium-looking podcasts
              without the hassle. Walk in with ideas, walk out with content.
            </p>
          </div>
        </div>
        
        {/* RIGHT SIDE – VISUALLY BALANCED REEL VIDEO */}
        <div className="flex items-start justify-center px-5 md:px-10 lg:px-8 pt-4 pb-0">
          <div
            className="relative mt-10 w-[320px] md:w-[360px] lg:w-[400px] aspect-[9/16] rounded-3xl overflow-hidden"
            style={{
              boxShadow: "0 0 0 4px #FDB913, 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(253, 185, 19, 0.2)",
            }}
          >
            <HeroVideo />
          </div>
        </div>
      </div>

      {/* CENTERED BUTTON BELOW BOTH SECTIONS */}
      <div className="flex justify-center pb-16 relative z-10">
        <Link
          to="/book-session"
          className="group px-12 py-5 text-sm tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-3 font-medium rounded-md"
          style={{ backgroundColor: "#FDB913", color: "#0A1628" }}
        >
          Book Your Session
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <div className="min-h-screen">
      {/* SECTION 1: HERO (Dark Navy Background) */}
      <HeroSection />

      {/* SECTION 2: CAMERA SCROLL EFFECT (Pinned, Navy Background) */}
  
      <CameraScrollSection />
     
      
      {/* SECTION 3: BRAND SLIDER (Separate section, no nesting) */}
      <section  className="text-[#0A1628]" style={{ marginTop: 0 }}>
        <BrandSlider />
      </section>

      {/* SECTION 4: STUDIO SECTION (Separate section, no nesting) */}
      <StudioSection /> 

      {/* SECTION 4: KEY STATS (Separate section, no nesting) */}
      <KeyStats />
      </div>
      
    </>
  );
}
