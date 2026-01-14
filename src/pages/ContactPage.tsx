import { motion } from 'motion/react';
import { Phone, MessageCircle, Mail, MapPin, ArrowRight } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] pt-32 pb-20">
      {/* Contact Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-[#0A1628]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-[#F5E6D3] mb-6 tracking-tight">
              Contact Us
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="space-y-10"
            >
              <div>
                <h3 className="text-3xl md:text-4xl font-light text-[#F5E6D3] mb-8">
                  Get in Touch
                </h3>
                <p className="text-xl text-[#F5E6D3]/70 font-light leading-relaxed">
                  Ready to create amazing content? Reach out to us through any of these channels and let's bring your vision to life.
                </p>
              </div>

              <div className="space-y-8">
                <a
                  href="tel:+917010017080"
                  className="flex items-center gap-5 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#FDB913] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Phone className="w-7 h-7 text-[#0A1628]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-1">
                      Call Now
                    </p>
                    <p className="text-2xl font-light text-[#F5E6D3] group-hover:text-[#FDB913] transition-colors">
                      +91 7010017080
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/917010017080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#FDB913] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <MessageCircle className="w-7 h-7 text-[#0A1628]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-1">
                      WhatsApp
                    </p>
                    <p className="text-2xl font-light text-[#F5E6D3] group-hover:text-[#FDB913] transition-colors">
                      Available
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#FDB913] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-[#0A1628]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-1">
                      Email
                    </p>
                    <p className="text-2xl font-light text-[#F5E6D3]">
                      hello@halohouse.studio
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#FDB913] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-[#0A1628]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-1">
                      Location
                    </p>
                    <p className="text-2xl font-light text-[#F5E6D3]">
                      Mumbai, Maharashtra
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="bg-[#1A2638] border border-[#FDB913]/20 p-10 md:p-12"
            >
              <form className="space-y-8">
                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-3">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 border border-[#F5E6D3]/20 bg-transparent text-[#F5E6D3] focus:border-[#FDB913] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-4 border border-[#F5E6D3]/20 bg-transparent text-[#F5E6D3] focus:border-[#FDB913] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-3">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-5 py-4 border border-[#F5E6D3]/20 bg-transparent text-[#F5E6D3] focus:border-[#FDB913] focus:outline-none transition-colors"
                    placeholder="+91 00000 00000"
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-widest uppercase text-[#F5E6D3]/60 mb-3">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-5 py-4 border border-[#F5E6D3]/20 bg-transparent text-[#F5E6D3] focus:border-[#FDB913] focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-10 py-6 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all font-medium"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-[#F5E6D3]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#0A1628] mb-8 tracking-tight">
                Careers
              </h2>
              <p className="text-2xl md:text-3xl text-[#0A1628]/80 font-light leading-relaxed mb-8">
                Join our creative team and help shape the future of content creation.
              </p>
              <p className="text-lg md:text-xl text-[#0A1628]/60 font-light leading-relaxed mb-10">
                Placeholder text: We're always looking for talented individuals who share our passion for premium podcast production. We offer exciting opportunities in video production, audio engineering, content creation, and studio management.
              </p>

              <button className="px-10 py-5 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all font-medium inline-flex items-center gap-3">
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative h-[500px] bg-gradient-to-br from-[#0A1628]/10 to-[#FDB913]/20 rounded-lg"
            >
              {/* Stock team/career image placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[#0A1628]/20 text-sm tracking-widest uppercase mb-2">
                    Stock Image Placeholder
                  </p>
                  <p className="text-[#0A1628]/30 text-xs tracking-widest uppercase">
                    Team Working / Careers
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
