import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

export function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#0A1628]">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#F5E6D3] mb-6 tracking-tight">
            Contact Us
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-light text-[#F5E6D3] mb-6">
                Get in Touch
              </h3>
              <p className="text-lg text-[#F5E6D3]/70 font-light leading-relaxed">
                Ready to create amazing content? Reach out to us through any of these channels.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href="tel:+917010017080"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#FDB913] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-[#0A1628]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#F5E6D3]/60">
                    Call Now
                  </p>
                  <p className="text-xl font-light text-[#F5E6D3]">
                    +91 7010017080
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/917010017080"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#FDB913] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-[#0A1628]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#F5E6D3]/60">
                    WhatsApp
                  </p>
                  <p className="text-xl font-light text-[#F5E6D3]">
                    Available
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FDB913] flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#0A1628]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#F5E6D3]/60">
                    Email
                  </p>
                  <p className="text-xl font-light text-[#F5E6D3]">
                    hello@halohouse.studio
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FDB913] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#0A1628]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm tracking-widest uppercase text-[#F5E6D3]/60">
                    Location
                  </p>
                  <p className="text-xl font-light text-[#F5E6D3]">
                    Mumbai, Maharashtra
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="bg-[#1A2638] border border-[#FDB913]/20 p-8 md:p-10"
          >
            <form className="space-y-6">
              <div>
                <label className="block text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-[#F5E6D3]/20 bg-transparent text-[#F5E6D3] focus:border-[#FDB913] focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-[#F5E6D3]/20 bg-transparent text-[#F5E6D3] focus:border-[#FDB913] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-[#F5E6D3]/20 bg-transparent text-[#F5E6D3] focus:border-[#FDB913] focus:outline-none transition-colors"
                  placeholder="+91 00000 00000"
                />
              </div>

              <div>
                <label className="block text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-[#F5E6D3]/20 bg-transparent text-[#F5E6D3] focus:border-[#FDB913] focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-10 py-5 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all font-medium"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
