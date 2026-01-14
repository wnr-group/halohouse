import { ArrowRight, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const subTextOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628]">
      {/* Background image with overlay - fixed parallax */}
      <div className="absolute inset-0 z-0 sticky top-0">
        <img
          src="https://images.unsplash.com/photo-1709846485906-30b28e7ed651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwc3R1ZGlvJTIwbWljcm9waG9uZXxlbnwxfHx8fDE3Njc3ODY3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Podcast Studio"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        style={{ scale }}
        className="absolute top-0 left-0 right-0 z-20 px-8 py-8 md:px-16 lg:px-24"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="text-xl tracking-widest text-[#F5E6D3] uppercase font-light">
            Halohouse
          </div>
          <button className="text-[#F5E6D3] text-sm tracking-wider uppercase hover:text-[#FDB913] transition-colors">
            Contact
          </button>
        </div>
      </motion.nav>

      {/* Hero content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 text-center pt-20">
        <motion.h1 
          style={{ y, scale }}
          className="text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-light text-[#F5E6D3] mb-12 tracking-tight leading-[0.9]"
        >
          Step into your<br />spotlight
        </motion.h1>
        
        <motion.p 
          style={{ opacity: subTextOpacity }}
          className="text-lg md:text-xl lg:text-2xl text-[#F5E6D3]/70 mb-16 max-w-4xl mx-auto font-light leading-relaxed tracking-wide"
        >
          A home-studio built for creators who want premium-looking podcasts without the hassle.<br className="hidden md:block" />
          Walk in with ideas, walk out with content.
        </motion.p>

        <motion.div 
          style={{ opacity }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <button className="group px-10 py-5 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all flex items-center gap-3 font-medium">
            Book Your Session
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-10 py-5 border border-[#F5E6D3]/30 text-[#F5E6D3] text-sm tracking-widest uppercase hover:bg-[#F5E6D3]/10 transition-all flex items-center gap-3 font-medium">
            View Gallery
            <Play className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-[1px] h-20 bg-[#FDB913]/30">
          <div className="w-[1px] h-10 bg-[#FDB913] animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  );
}