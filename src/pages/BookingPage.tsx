import { motion } from 'motion/react';
import { Pricing } from '../components/Pricing';

export function BookingPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] pt-32 pb-20">
      {/* Pricing Section */}
      <Pricing />

      {/* Appointment Booking Form */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-[#F5E6D3]">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#0A1628] mb-6 tracking-tight">
              Appointment Booking
            </h2>
            <p className="text-xl md:text-2xl text-[#0A1628]/70 font-light leading-relaxed">
              Schedule your session and start creating premium content
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-white border border-[#0A1628]/10 p-10 md:p-14"
          >
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-4 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-5 py-4 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors"
                    placeholder="+91 00000 00000"
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
                    Service *
                  </label>
                  <select className="w-full px-5 py-4 border border-[#0A1628]/20 bg-white text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors">
                    <option value="">Select a service</option>
                    <option value="session">Session Pass - ₹599</option>
                    <option value="edit">Edit Add-On - ₹999</option>
                    <option value="day">Day Pass - ₹2299</option>
                    <option value="simple">Simple Setup - ₹399</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-5 py-4 border border-[#0A1628]/20 bg-white text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    className="w-full px-5 py-4 border border-[#0A1628]/20 bg-white text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
                  Message (Optional)
                </label>
                <textarea
                  rows={5}
                  className="w-full px-5 py-4 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project, specific requirements, or any questions..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-10 py-6 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all font-medium"
              >
                Schedule Yours
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
