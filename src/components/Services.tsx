import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Building2, Smartphone, TrendingUp, Package, User, Film } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: Building2,
      title: 'Studio Space',
      description: 'Professional podcast recording environment'
    },
    {
      icon: Smartphone,
      title: 'Reels',
      description: 'Short-form content for social media'
    },
    {
      icon: TrendingUp,
      title: 'Commercials',
      description: 'Brand advertising and promotional videos'
    },
    {
      icon: Package,
      title: 'Product Shoots',
      description: 'High-quality product photography and video'
    },
    {
      icon: User,
      title: 'Model Shoots',
      description: 'Professional modeling and portrait sessions'
    },
    {
      icon: Film,
      title: 'Editing',
      description: 'Post-production and content refinement'
    }
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
            Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const cardRef = useRef(null);
            const cardInView = useInView(cardRef, { once: true, margin: "-100px" });
            
            return (
              <motion.div
                key={index}
                ref={cardRef}
                initial={{ opacity: 0, y: 40 }}
                animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="group bg-[#111E33]/50 border border-[#FDB913]/20 p-8 hover:border-[#FDB913] transition-all duration-300"
              >
                {/* Stock Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-[#FDB913]/10 to-[#FDB913]/5 mb-6 flex items-center justify-center">
                  <Icon className="w-16 h-16 text-[#FDB913]" strokeWidth={1} />
                </div>

                <h3 className="text-2xl font-light text-[#F5E6D3] mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-[#F5E6D3]/70 font-light leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
