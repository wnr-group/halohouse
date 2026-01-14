import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function Appointment() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#F5E6D3]">
      <div className="max-w-[1000px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#0A1628] mb-6 tracking-tight">
            Book Your Session
          </h2>
          <p className="text-lg md:text-xl text-[#0A1628]/60 font-light leading-relaxed">
            Schedule your appointment and start creating premium content
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-white border border-[#0A1628]/10 p-8 md:p-12"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors"
                  placeholder="+91 00000 00000"
                />
              </div>

              <div>
                <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-2">
                  Service
                </label>
                <select className="w-full px-4 py-3 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors">
                  <option>Select a service</option>
                  <option>Session Pass</option>
                  <option>Edit Add-On</option>
                  <option>Day Pass</option>
                  <option>Simple Setup</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-2">
                Message (Optional)
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-10 py-5 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all font-medium"
            >
              Schedule Yours
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
