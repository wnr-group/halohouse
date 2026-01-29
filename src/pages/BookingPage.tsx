import { motion } from "motion/react";
import { Pricing } from "../components/Pricing";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";



export function BookingPage() {

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
});

const [submitted, setSubmitted] = useState(false);




const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { error } = await supabase
    .from("book_sessions")
    .insert(formData);

  if (error) {
    console.error(error);
    alert("Failed to book session");
    return;
  }

  setSubmitted(true);

   setFormData({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
};

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};


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
            {submitted && (
  <div className="text-center py-8">
    <p className="text-green-600 text-xl font-semibold">
      ✅ Booking request submitted
    </p>
    <p className="text-[#0A1628]/70 mt-2">
      We’ll contact you shortly.
    </p>
  </div>
)}
            {!submitted && (
            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Name *" name="name" placeholder="Your full name" onChange={handleChange} />
                <Field label="Email *" name="email" type="email" placeholder="your@email.com" onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Phone *" name="phone" placeholder="+91 00000 00000" onChange={handleChange} />
                <SelectField label="Service *" name="service" onChange={handleChange} />
              </div>
              
              <div>
                <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
                  Message (Optional)
                </label>
               <ReactQuill
    theme="snow"
    value={formData.message}
    onChange={(value) =>
      setFormData((prev) => ({ ...prev, message: value }))
    }
    className="bg-white"
  />
              </div>

              {/* ✅ BUTTON — SAME AS PREVIOUS */}
              <button
                 type="submit"
  disabled={!formData.name || !formData.email || !formData.phone || !formData.service}
  className={`w-full px-10 py-6 text-sm tracking-widest uppercase font-medium transition-all
    ${formData.name && formData.email && formData.phone && formData.service
      ? "bg-[#FDB913] text-[#0A1628] hover:bg-[#FDB913]/90"
      : "bg-gray-300 text-gray-600 cursor-not-allowed"
    }`}
              >
                Schedule Yours
              </button>

            </form>
            )}


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
  name,
  type = "text",
  placeholder = "",
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-5 py-4 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  onChange,
}: {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm tracking-widest uppercase text-[#0A1628]/60 mb-3">
        {label}
      </label>
      <select
        name={name}
        onChange={onChange}
        className="w-full px-5 py-4 border border-[#0A1628]/20 bg-transparent text-[#0A1628] focus:border-[#FDB913] focus:outline-none"
      >
        <option value="">Select a service</option>
        <option>Session Pass - ₹599</option>
        <option>Edit Add-On - ₹999</option>
        <option>Day Pass - ₹2299</option>
        <option>Simple Setup - ₹399</option>
      </select>
    </div>
  );
}


