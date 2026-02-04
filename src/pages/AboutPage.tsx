import { motion } from "motion/react";
import { History, Target, Sparkles } from "lucide-react";
import studio from "../assets/studio.avif";


export function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* =========================
          SECTION 1: ABOUT HERO
      ========================== */}
      <section className="pt-32 pb-24">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-light mb-6">
              About Us
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-md">
              HALO House is a visual production house built to help brands step
              into their spotlight.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[320px] md:h-[420px] lg:h-[460px] rounded-md overflow-hidden border border-border"
          >
            <img
              src={studio}
              alt="HALO House Podcast Studio"
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-4 left-4">
              <p className="text-xs tracking-widest uppercase text-white/80">
                HALO House Studio
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================
          SECTION 2: OUR STORY TITLE
      ========================== */}
      <section className="py-24">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-light">
            Our Story
          </h2>
        </div>
      </section>

      {/* =========================
          SECTION 3: STORY CARDS
      ========================== */}
      <section className="pb-32">
       <div className="max-w-[1200px] mx-auto px-8 md:px-16 lg:px-24 
            grid grid-cols-1 md:grid-cols-3 gap-16 items-stretch">

          {/* HISTORY CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-[var(--radius)] overflow-hidden h-full flex flex-col"

          >
            <div
              className="flex items-center gap-3 px-6 py-4"
              style={{ backgroundColor: "#223A5E" }}
            >
              <History className="w-5 h-5 text-[#F5E6D3]/85" />
              <h3 className="text-sm font-medium tracking-widest uppercase text-[#F5E6D3]/85">
                History
              </h3>
            </div>

            <div
              className="flex-1 pt-6 px-6 pb-8"
              style={{ backgroundColor: "#2B4A7A" }}
            >
              <p className="text-base leading-relaxed text-[#F5E6D3]/85">
                HALO House was shaped by 7+ years of hands-on experience in video
                creation, beginning as freelancers and evolving into a full-scale
                production house.
              </p>
            </div>
          </motion.div>

          {/* MISSION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-[var(--radius)] overflow-hidden h-full flex flex-col"

          >
            <div
              className="flex items-center gap-3 px-6 py-4"
              style={{ backgroundColor: "#223A5E" }}
            >
              <Target className="w-5 h-5 text-[#F5E6D3]/85" />
              <h3 className="text-sm font-medium tracking-widest uppercase text-[#F5E6D3]/85">
                Mission
              </h3>
            </div>

            <div
              className="flex-1 pt-6 px-6 pb-8"
              style={{ backgroundColor: "#2B4A7A" }}
            >
              <p className="text-base leading-relaxed text-[#F5E6D3]/85">
                In a world where audiences scroll fast and attention spans are short,
                visuals don’t just support marketing. They drive it.
              </p>
            </div>
          </motion.div>

          {/* VALUES CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-[var(--radius)] overflow-hidden h-full flex flex-col"

          >
            <div
              className="flex items-center gap-3 px-6 py-4"
              style={{ backgroundColor: "#223A5E" }}
            >
              <Sparkles className="w-5 h-5 text-[#F5E6D3]/85" />
              <h3 className="text-sm font-medium tracking-widest uppercase text-[#F5E6D3]/85">
                Values
              </h3>
            </div>

            <div
              className="flex-1 pt-6 px-6 pb-8"
              style={{ backgroundColor: "#2B4A7A" }}
            >
              <ul className="space-y-3 text-base text-[#F5E6D3]/85">
                <li>Every brand has its own spotlight</li>
                <li>Visuals should amplify the brand</li>
                <li>Creativity must always serve marketing</li>
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
