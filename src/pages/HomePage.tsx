import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CameraScrollSection } from "../components/CameraScrollSection";
import { BrandSlider } from "../components/BrandSlider";
import { KeyStats } from "../components/KeyStats";
import { StudioSection } from "../components/StudioSection";
import { Testimonials } from "../components/Testimonials";
import { supabase } from "../lib/supabase";


import { HeroVideo } from "../components/ui/HeroVideo";
import { SEO } from "../components/SEO";

// Picks a smaller heading size once admin-entered text runs long,
// so large font sizes never force horizontal overflow.
function headingSizeClass(text: string) {
  const len = (text || "").length;
  if (len > 24) return "text-4xl sm:text-5xl md:text-6xl lg:text-7xl";
  if (len > 14) return "text-5xl sm:text-6xl md:text-7xl lg:text-8xl";
  return "text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl";
}

function descriptionSizeClass(text: string) {
  const len = (text || "").length;
  if (len > 160) return "text-lg md:text-xl lg:text-2xl";
  return "text-xl md:text-2xl lg:text-3xl";
}

function HeroSection() {
  const [content, setContent] = useState({
    hero_line1: "Step Into",
    hero_line2_prefix: "Your",
    hero_highlight: "Spotlight",
    hero_description:
      "A home-studio built for creators who want premium-looking podcasts without the hassle. Walk in with ideas, walk out with content.",
    hero_button_text: "Book Your Session",
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) setContent((prev) => ({ ...prev, ...data }));
    };

    fetchContent();
  }, []);

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
        <div className="flex items-start md:items-center justify-center px-8 md:px-10 lg:px-8 pt-20 md:pt-4 pb-20">

          <div className="max-w-xl">
            <h1
              className={`${headingSizeClass(
                [content.hero_line1, content.hero_line2_prefix, content.hero_highlight]
                  .join(" ")
              )} font-light mb-8 leading-[0.9]`}
            >


              <span
                className="block italic break-words"
                style={{
                  color: "#F5E6D3",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
                }}
              >
                {content.hero_line1}
              </span>
              <span className="block break-words">
                <span
                  className="italic"
                  style={{
                    color: "#F5E6D3",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
                  }}
                >
                  {content.hero_line2_prefix}{" "}
                </span>
                <span
                  style={{
                    color: "#FDB913",
                    textShadow: "0 0 30px rgba(253, 185, 19, 0.5), 0 0 60px rgba(253, 185, 19, 0.3)"
                  }}
                >
                  {content.hero_highlight}
                </span>
              </span>
              <span className="sr-only">: Premium Podcast Studio</span>
            </h1>

            <p
              className={`${descriptionSizeClass(content.hero_description)} text-[#F5E6D3]/80 break-words line-clamp-4`}
            >
              {content.hero_description}
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
          {content.hero_button_text}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <SEO
        title="Podcast Studio for Creators | Premium Recording | Halo House"
        description="Professional podcast and video recording studio for creators. Walk in with ideas and walk out with premium content."
      />
      <div className="min-h-screen">
        {/* SECTION 1: HERO (Dark Navy Background) */}
        <HeroSection />

        {/* SECTION 2: CAMERA SCROLL EFFECT (Pinned, Navy Background) */}

        <CameraScrollSection />


        {/* SECTION 3: BRAND SLIDER (Separate section, no nesting) */}
        <section className="text-[#0A1628]" style={{ marginTop: 0 }}>
          <BrandSlider />
        </section>

        {/* SECTION 4: STUDIO SECTION (Separate section, no nesting) */}
        <StudioSection />

        {/* SECTION 5: KEY STATS (Separate section, no nesting) */}
        <KeyStats />


        {/* SECTION 6: TESTIMONIALS (Separate section, no nesting) */}
        <Testimonials />
      </div>

    </>
  );
}