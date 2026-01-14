import { motion } from 'motion/react';
import { Quote, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export function FeedbackPage() {
  const testimonials = [
    {
      name: 'Client Name',
      role: 'Content Creator',
      text: 'Placeholder testimonial text. The studio experience was exceptional and the results exceeded our expectations. The team was professional and the equipment top-notch.'
    },
    {
      name: 'Client Name',
      role: 'Podcast Host',
      text: 'Placeholder testimonial text. Professional setup and great team support made our recording session smooth and efficient. Highly recommend for podcast creators.'
    },
    {
      name: 'Client Name',
      role: 'Business Owner',
      text: 'Placeholder testimonial text. High-quality production and quick turnaround. Perfect for our brand content needs. Will definitely book again.'
    },
    {
      name: 'Client Name',
      role: 'Entrepreneur',
      text: 'Placeholder testimonial text. Amazing backdrops and excellent equipment. The variety of options made it easy to match our brand aesthetic perfectly.'
    }
  ];

  const faqs = [
    {
      question: 'What are your pricing options?',
      answer: 'Placeholder answer: We offer flexible pricing starting from ₹399 for simple setups to ₹2299 for day passes. Each package includes specific services and equipment tailored to your needs.'
    },
    {
      question: 'How do I book a session?',
      answer: 'Placeholder answer: You can book through our appointment form above, call us directly at +91 7010017080, or reach out via WhatsApp. We recommend booking at least 48 hours in advance for best availability.'
    },
    {
      question: 'What is the typical delivery time?',
      answer: 'Placeholder answer: Raw footage is delivered same-day or within 24 hours. Edited content typically takes 48-72 hours depending on the complexity and package selected. Rush delivery options are available.'
    },
    {
      question: 'Can I choose different backdrops during my session?',
      answer: 'Placeholder answer: Yes, all our backdrops (Ember, Sage, Noir, and Elen) are available during your session. Day pass holders have unlimited backdrop changes. Single session passes include one backdrop.'
    },
    {
      question: 'Do you provide equipment or should I bring my own?',
      answer: 'Placeholder answer: We provide all professional equipment including 4K cameras, studio lighting, broadcast microphones, and monitoring systems. You just need to bring your content ideas and any personal props.'
    },
    {
      question: 'Is editing included in the pricing?',
      answer: 'Placeholder answer: Basic packages include raw footage delivery. Professional editing is available as an add-on for ₹999, which includes color grading, audio enhancement, and basic graphics.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Customer Feedback Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-[#0A1628]">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-[#F5E6D3] mb-6 tracking-tight">
              Customer Feedback
            </h1>
            <p className="text-xl md:text-2xl text-[#F5E6D3]/70 font-light leading-relaxed max-w-3xl">
              What our clients say about their studio experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
                className="bg-[#1A2638] border border-[#FDB913]/20 p-10 md:p-12"
              >
                <Quote className="w-12 h-12 text-[#FDB913]/40 mb-8" strokeWidth={1} />
                
                <p className="text-lg md:text-xl text-[#F5E6D3]/80 font-light leading-relaxed mb-8 italic">
                  "{testimonial.text}"
                </p>

                <div>
                  <p className="text-[#F5E6D3] font-light text-xl">{testimonial.name}</p>
                  <p className="text-sm tracking-widest uppercase text-[#FDB913]/60 mt-2">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-[#F5E6D3]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#0A1628] mb-6 tracking-tight">
              FAQ
            </h2>
            <p className="text-xl md:text-2xl text-[#0A1628]/70 font-light leading-relaxed">
              Common questions about our services and booking process
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  className="border border-[#0A1628]/10 bg-white"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-8 md:px-10 py-6 md:py-8 flex items-center justify-between text-left hover:bg-[#FDB913]/5 transition-colors"
                  >
                    <span className="text-xl md:text-2xl font-light text-[#0A1628] pr-8">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <Minus className="w-6 h-6 text-[#FDB913] flex-shrink-0" strokeWidth={1.5} />
                    ) : (
                      <Plus className="w-6 h-6 text-[#FDB913] flex-shrink-0" strokeWidth={1.5} />
                    )}
                  </button>
                  
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-8 md:px-10 pb-6 md:pb-8"
                    >
                      <p className="text-lg text-[#0A1628]/70 font-light leading-relaxed">
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
    </div>
  );
}
