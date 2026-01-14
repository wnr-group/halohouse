import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function Process() {
  const steps = [
    {
      number: '01',
      title: 'Plan',
      description: 'Book your session and discuss your vision'
    },
    {
      number: '02',
      title: 'Set',
      description: 'Choose backdrop and customize your setup'
    },
    {
      number: '03',
      title: 'Shoot',
      description: 'Record with professional guidance'
    },
    {
      number: '04',
      title: 'Deliver',
      description: 'Receive polished content ready to publish'
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
            Our Process
          </h2>
          <p className="text-lg md:text-xl text-[#F5E6D3]/60 max-w-3xl font-light leading-relaxed">
            From concept to content in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {steps.map((step, index) => {
            const stepRef = useRef(null);
            const stepInView = useInView(stepRef, { once: true, margin: "-100px" });
            
            return (
              <motion.div 
                key={index} 
                ref={stepRef}
                initial={{ opacity: 0, x: -50 }}
                animate={stepInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                className="group"
              >
                <div className="mb-8">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={stepInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2,
                      ease: "easeOut"
                    }}
                    className="text-6xl md:text-7xl font-light text-[#FDB913]/30 mb-6 tracking-tight"
                  >
                    {step.number}
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={stepInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2 + 0.2,
                      ease: "easeOut"
                    }}
                    className="text-3xl md:text-4xl font-light mb-4 tracking-tight"
                  >
                    {step.title}
                  </motion.h3>
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={stepInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2 + 0.4,
                    ease: "easeOut"
                  }}
                  className="text-[#F5E6D3]/60 font-light leading-relaxed"
                >
                  {step.description}
                </motion.p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}