import { motion } from "motion/react";
import { Pricing } from "../components/Pricing";

export function BookingPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background text-foreground">
      {/* Pricing */}
      <Pricing />

      {/* Appointment Booking */}
      <section className="py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1000px] mx-auto">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="mb-6 text-[#0A1628]">
              Appointment Booking
            </h2>
            <p className="text-[#0A1628]/70">
              Schedule your session and start creating premium content
            </p>
          </motion.div>

          {/* FORM (transparent background) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-transparent border border-[#0A1628]/15 p-10 md:p-14"
          >
            <form className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Name *" placeholder="Your full name" />
                <Field label="Email *" type="email" placeholder="your@email.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Phone *" placeholder="+91 00000 00000" />
                <SelectField label="Service *" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Preferred Date *" type="date" />
                <Field label="Preferred Time *" type="time" />
              </div>

              <div>
                <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
                  Message (Optional)
                </label>
                <textarea
                  rows={5}
                  className="w-full px-5 py-4 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none resize-none"
                />
              </div>

              {/* ✅ BUTTON — SAME AS PREVIOUS */}
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

/* =========================
   Reusable Fields
========================= */

function Field({
  label,
  type = "text",
  placeholder = "",
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-5 py-4 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none"
      />
    </div>
  );
}

function SelectField({ label }: { label: string }) {
  return (
    <div>
      <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
        {label}
      </label>
      <select className="w-full px-5 py-4 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none">
        <option value="">Select a service</option>
        <option>Session Pass - ₹599</option>
        <option>Edit Add-On - ₹999</option>
        <option>Day Pass - ₹2299</option>
        <option>Simple Setup - ₹399</option>
      </select>
    </div>
  );
}
