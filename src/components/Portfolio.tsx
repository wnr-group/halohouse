import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Portfolio() {
  const portfolioItems = [
    { id: 1, title: 'Podcast Session' },
    { id: 2, title: 'Interview Setup' },
    { id: 3, title: 'Content Creation' },
    { id: 4, title: 'Studio Recording' },
    { id: 5, title: 'Video Production' },
    { id: 6, title: 'Live Session' },
    { id: 7, title: 'Professional Shoot' },
    { id: 8, title: 'Creative Content' },
    { id: 9, title: 'Brand Session' },
    { id: 10, title: 'Documentary Style' }
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24">
      <div className="max-w-[1600px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#F5E6D3] mb-6 tracking-tight">
            Portfolio
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {portfolioItems.map((item, index) => {
            const itemRef = useRef(null);
            const itemInView = useInView(itemRef, { once: true, margin: "-100px" });
            
            return (
              <motion.div
                key={item.id}
                ref={itemRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={itemInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="group relative aspect-[9/16] bg-[#1A2638] rounded-lg overflow-hidden cursor-pointer"
              >
                {/* Video Thumbnail Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDB913]/20 to-[#0A1628]/80"></div>
                
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#FDB913] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-[#0A1628] fill-current ml-1" />
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A1628] to-transparent">
                  <p className="text-xs tracking-wider uppercase text-[#F5E6D3]/80">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
