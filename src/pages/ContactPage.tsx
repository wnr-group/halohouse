import { motion } from "motion/react";
import { Phone, MessageCircle, Mail, MapPin, ArrowRight } from "lucide-react";

export function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background text-foreground">

      {/* CONTACT SECTION */}
      <section className="py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h1>Contact Us</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* CONTACT INFO */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-10"
            >
              <div>
                <h3 className="mb-6">Get in Touch</h3>
                <p className="text-foreground/70 max-w-lg">
                  Ready to create amazing content? Reach out to us through any of these channels and let’s bring your vision to life.
                </p>
              </div>

              <div className="space-y-8">
                <ContactItem
                  icon={Phone}
                  label="Call Now"
                  value="+91 7010017080"
                  href="tel:+917010017080"
                />

                <ContactItem
                  icon={MessageCircle}
                  label="WhatsApp"
                  value="Available"
                  href="https://wa.me/917010017080"
                />

                <ContactItem
                  icon={Mail}
                  label="Email"
                  value="hello@halohouse.studio" href={undefined}                />

                <ContactItem
                  icon={MapPin}
                  label="Location"
                  value="Mumbai, Maharashtra" href={undefined}                />
              </div>
            </motion.div>

            {/* CONTACT FORM (TRANSPARENT) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-transparent border border-border p-10 md:p-12"
            >
              <form className="space-y-8">
                <Field label="Name *" placeholder="Your name" />
                <Field label="Email *" type="email" placeholder="your@email.com" />
                <Field label="Phone *" placeholder="+91 00000 00000" />

                <div>
                  <label className="block text-sm tracking-widest uppercase text-muted-foreground mb-3">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-5 py-4 border border-border bg-transparent text-foreground focus:border-primary focus:outline-none resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {/* BUTTON — unchanged */}
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

      {/* CAREERS SECTION */}
      <section className="py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-8">Careers</h2>

            <p className="text-foreground/80 mb-6">
              Join our creative team and help shape the future of content creation.
            </p>

            <p className="text-foreground/60 mb-10">
              We’re always looking for talented people passionate about storytelling, production, and creativity.
            </p>

            <button className="px-10 py-5 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all font-medium inline-flex items-center gap-3">
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="h-[500px] rounded-lg bg-muted flex items-center justify-center">
            <span className="text-muted-foreground uppercase tracking-widest text-sm">
              Image Placeholder
            </span>
          </div>

        </div>
      </section>
    </div>
  );
}

/* =========================
   Reusable Components
========================= */

function ContactItem({ icon: Icon, label, value, href }) {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-5 group"
    >
      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-primary-foreground" />
      </div>
      <div>
        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-1">
          {label}
        </p>
        <p className="text-xl group-hover:text-primary transition-colors">
          {value}
        </p>
      </div>
    </Wrapper>
  );
}

function Field({ label, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm tracking-widest uppercase text-muted-foreground mb-3">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-5 py-4 border border-border bg-transparent text-foreground focus:border-primary focus:outline-none"
      />
    </div>
  );
}
