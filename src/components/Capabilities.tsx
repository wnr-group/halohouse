import { Camera, Lightbulb, Mic2, Users, Film, Calendar } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function Capabilities() {
  const capabilities = [
    {
      icon: Camera,
      title: 'Pro Cameras',
      description: 'Crisp, multi-angle coverage'
    },
    {
      icon: Lightbulb,
      title: 'Cinematic Lighting',
      description: 'Key, fill, and accent lighting'
    },
    {
      icon: Mic2,
      title: 'Broadcast Mics',
      description: 'Clean, controlled sound'
    },
    {
      icon: Users,
      title: 'Assistive Team',
      description: 'On-set help and guidance'
    },
    {
      icon: Film,
      title: 'Post-Production',
      description: 'Editing and social clips'
    },
    {
      icon: Calendar,
      title: 'Flexible Booking',
      description: 'Hourly or bundled sessions'
    }
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#0A1628] text-[#F5E6D3]">
      <div className="max-w-[1600px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight">
            Studio Capabilities
          </h2>
          <p className="text-lg md:text-xl text-[#F5E6D3]/60 max-w-3xl font-light leading-relaxed">
            Professional equipment and expert support for every aspect of your production
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            const itemRef = useRef(null);
            const itemInView = useInView(itemRef, { once: true, margin: "-100px" });
            
            return (
              <motion.div
                key={index}
                ref={itemRef}
                initial={{ opacity: 0, y: 30 }}
                animate={itemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="group"
              >
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={itemInView ? { scale: 1 } : { scale: 0.95 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1 + 0.2,
                    ease: "easeOut"
                  }}
                  className="mb-6"
                >
                  <Icon className="w-10 h-10 text-[#FDB913]/60 group-hover:text-[#FDB913] transition-colors" strokeWidth={1} />
                </motion.div>
                <h3 className="text-2xl font-light mb-3 tracking-tight">
                  {capability.title}
                </h3>
                <p className="text-[#F5E6D3]/60 font-light leading-relaxed">
                  {capability.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}