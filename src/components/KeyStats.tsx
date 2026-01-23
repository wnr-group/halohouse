import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Users, Video, Briefcase } from 'lucide-react';

export function KeyStats() {
  const stats = [
    {
      icon: Users,
      value: '20+',
      label: 'Clients'
    },
    {   
      icon: Video,
      value: '500+',
      label: 'Videos'
    },
    {
      icon: Briefcase,
      value: '5+',
      label: 'Industries'
    }
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-20 px-8 md:px-16 lg:px-24 bg-transparent border-y border-[#0A1628]/10">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                className="text-center"
              >
                <Icon className="w-12 h-12 text-[#0A1628] mx-auto mb-4" strokeWidth={1} />
                <div className="text-5xl md:text-6xl font-light text-[#0A1628] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm tracking-widest uppercase text-[#0A1628]/60">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
