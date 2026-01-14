import { ArrowRight } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function Pricing() {
  const plans = [
    {
      name: 'Session Pass',
      price: '₹599',
      description: 'Entry access'
    },
    {
      name: 'Edit Add-On',
      price: '₹999',
      description: 'Complete post-production'
    },
    {
      name: 'Day Pass',
      price: '₹2,299',
      description: 'One Day Pass'
    },
    {
      name: 'Simple Setup',
      price: '₹399',
      description: 'No Camera'
    }
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#F5E6D3]">
      <div className="max-w-[1600px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#0A1628] mb-6 tracking-tight">
            Services & Pricing
          </h2>
          <p className="text-lg md:text-xl text-[#0A1628]/60 max-w-3xl font-light leading-relaxed">
            Flexible options to match your needs and budget
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {plans.map((plan, index) => {
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
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
                whileHover={{ y: -8 }}
                className="group border border-[#0A1628]/10 hover:border-[#FDB913] transition-all duration-300 p-8 md:p-10 bg-white"
              >
                <div className="mb-8">
                  <div className="text-sm tracking-widest uppercase text-[#0A1628]/40 mb-6">{plan.description}</div>
                  <h3 className="text-3xl md:text-4xl font-light text-[#0A1628] mb-2 tracking-tight">{plan.name}</h3>
                  <div className="text-5xl md:text-6xl font-light text-[#FDB913] mt-6">{plan.price}</div>
                </div>

                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={cardInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.15 + 0.4,
                    ease: "easeOut"
                  }}
                  className="w-full text-sm tracking-widest uppercase text-[#0A1628] hover:text-[#FDB913] transition-colors font-medium inline-flex items-center justify-between border-t border-[#0A1628]/10 group-hover:border-[#FDB913] pt-6"
                >
                  Choose Plan
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}