import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Client Name',
      role: 'Content Creator',
      text: 'Placeholder testimonial text. The studio experience was exceptional and the results exceeded our expectations.'
    },
    {
      name: 'Client Name',
      role: 'Podcast Host',
      text: 'Placeholder testimonial text. Professional setup and great team support made our recording session smooth and efficient.'
    },
    {
      name: 'Client Name',
      role: 'Business Owner',
      text: 'Placeholder testimonial text. High-quality production and quick turnaround. Highly recommend for anyone creating content.'
    },
    {
      name: 'Client Name',
      role: 'Entrepreneur',
      text: 'Placeholder testimonial text. Amazing backdrops and excellent equipment. Perfect for our brand content needs.'
    }
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#0A1628]">
      <div className="max-w-[1600px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#F5E6D3] mb-6 tracking-tight">
            Customer Feedback
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {testimonials.map((testimonial, index) => {
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
                className="bg-[#1A2638] border border-[#FDB913]/20 p-8 md:p-10"
              >
                <Quote className="w-10 h-10 text-[#FDB913]/40 mb-6" strokeWidth={1} />
                
                <p className="text-lg text-[#F5E6D3]/80 font-light leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>

                <div>
                  <p className="text-[#F5E6D3] font-light text-lg">{testimonial.name}</p>
                  <p className="text-sm tracking-widest uppercase text-[#FDB913]/60 mt-1">
                    {testimonial.role}
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
