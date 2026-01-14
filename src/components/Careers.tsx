import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export function Careers() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#F5E6D3]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#0A1628] mb-8 tracking-tight">
              Careers
            </h2>
            <p className="text-xl md:text-2xl text-[#0A1628]/70 font-light leading-relaxed mb-8">
              Join our creative team and help shape the future of content creation. We're always looking for talented individuals who share our passion for premium podcast production.
            </p>
            <p className="text-lg text-[#0A1628]/60 font-light leading-relaxed mb-10">
              Placeholder text: We offer exciting opportunities in video production, audio engineering, content creation, and studio management. Be part of a dynamic environment where creativity meets professionalism.
            </p>
            
            <button className="px-10 py-5 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all font-medium inline-flex items-center gap-3">
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative h-[500px] bg-gradient-to-br from-[#0A1628]/10 to-[#FDB913]/20 rounded-lg"
          >
            {/* Stock team/career image placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#0A1628]/30 text-sm tracking-widest uppercase">
                Team Working Image
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
