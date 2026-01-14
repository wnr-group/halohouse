import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Play } from 'lucide-react';

export function FeaturedVideo() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#0A1628]">
      <div className="max-w-[1600px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#F5E6D3] mb-6 tracking-tight">
            Our Video
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative aspect-video bg-gradient-to-br from-[#1A2638] to-[#0A1628] rounded-lg overflow-hidden group cursor-pointer"
        >
          {/* Video Placeholder */}
          <div className="absolute inset-0 bg-[#0A1628]/50"></div>
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#FDB913] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-12 h-12 text-[#0A1628] fill-current ml-2" />
            </div>
          </div>

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0A1628] to-transparent">
            <p className="text-2xl font-light text-[#F5E6D3] tracking-tight">
              Studio in Action
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
