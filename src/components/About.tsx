import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#F5E6D3]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[500px] bg-gradient-to-br from-[#0A1628]/10 to-[#FDB913]/20 rounded-lg"
          >
            {/* Stock studio/team image placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#0A1628]/30 text-sm tracking-widest uppercase">
                Studio Team Image
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#0A1628] mb-8 tracking-tight">
              About Us
            </h2>
            <p className="text-2xl md:text-3xl font-light text-[#0A1628] leading-relaxed">
              Premium podcast visuals. Zero setup. Cool looks. Endless episodes.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
