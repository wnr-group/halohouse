import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export function FAQ() {
  const faqs = [
    {
      question: 'What are your pricing options?',
      answer: 'Placeholder answer: We offer flexible pricing starting from ₹399 for simple setups to ₹2299 for day passes. Each package includes specific services and equipment.'
    },
    {
      question: 'How do I book a session?',
      answer: 'Placeholder answer: You can book through our appointment form, call us directly, or WhatsApp. We recommend booking at least 48 hours in advance.'
    },
    {
      question: 'What is the typical delivery time?',
      answer: 'Placeholder answer: Raw footage is delivered same-day. Edited content typically takes 48-72 hours depending on the complexity and package selected.'
    },
    {
      question: 'Can I choose different backdrops during my session?',
      answer: 'Placeholder answer: Yes, all our backdrops are available during your session. Day pass holders have unlimited backdrop changes.'
    },
    {
      question: 'Do you provide equipment or should I bring my own?',
      answer: 'Placeholder answer: We provide all professional equipment including cameras, lighting, and microphones. You just need to bring your content ideas.'
    },
    {
      question: 'Is editing included in the pricing?',
      answer: 'Placeholder answer: Basic packages include raw footage. Professional editing is available as an add-on for ₹999 or included in premium packages.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#0A1628]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#F5E6D3] mb-6 tracking-tight">
            FAQ
          </h2>
          <p className="text-lg md:text-xl text-[#F5E6D3]/60 font-light leading-relaxed">
            Common questions about our services
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="border border-[#FDB913]/20 bg-[#1A2638]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-[#FDB913]/5 transition-colors"
                >
                  <span className="text-lg md:text-xl font-light text-[#F5E6D3] pr-8">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus className="w-6 h-6 text-[#FDB913] flex-shrink-0" strokeWidth={1} />
                  ) : (
                    <Plus className="w-6 h-6 text-[#FDB913] flex-shrink-0" strokeWidth={1} />
                  )}
                </button>
                
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 md:px-8 pb-6"
                  >
                    <p className="text-[#F5E6D3]/70 font-light leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
