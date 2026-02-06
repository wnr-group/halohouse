import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { SEO } from "../components/SEO";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------------- HELPERS ---------------- */

  const stripHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  /* ---------------- INPUT CHANGE ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    //  Live phone validation
    if (name === "phone") {
      const normalized = value.replace(/\D/g, "");

      if (normalized.length > 0 && normalized.length < 10) {
        setPhoneError("Phone number must be 10 digits");
      } else if (normalized.length === 10 && !/^[6-9]/.test(normalized)) {
        setPhoneError("Phone number must start with 6–9");
      } else {
        setPhoneError("");
      }
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const plainMessage = stripHtml(formData.message).trim();
    const normalizedPhone = formData.phone.replace(/\D/g, "");

    // Required fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !normalizedPhone ||
      !plainMessage
    ) {
      setError("All fields are required");
      return;
    }

    // Email validation
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Phone validation (final guard)
    if (normalizedPhone.length !== 10 || !/^[6-9]/.test(normalizedPhone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    // Block submit if live error exists
    if (phoneError) {
      setError(phoneError);
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: normalizedPhone,
        message: formData.message,
      },
    ]);

    if (error) {
      console.error(error);
      setError("Failed to send message. Please try again.");
    } else {
      setSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }

    setLoading(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEO
        title="Contact Us | Get in Touch | Halo House Podcast Studio"
        description="Have questions or want to tour the studio? Contact the Halo House team today for bookings and inquiries."
      />
      <section className="py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h1>Contact Us</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* INFO */}
            <div className="space-y-8">
              <ContactItem
                icon={Phone}
                label="Call Now"
                value="+91 8754706742"
                href="tel:+918754706742"
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
                value="halohousechennai@gmail.com"
              />
              <ContactItem
                icon={MapPin}
                label="Location"
                value="Philomina nagar Thanjavur, Sholingnallur Chennai."
              />
            </div>

            {/* FORM */}
            <div className="border p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Field
                  label="Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <Field
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Field
                  label="Phone *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                {phoneError && (
                  <p className="text-red-600 text-sm">{phoneError}</p>
                )}

                <div>
                  <label className="block text-sm uppercase mb-2">
                    Message *
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={formData.message}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, message: value }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !!phoneError}
                  className="w-full py-4 bg-[#FDB913] text-black font-medium"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>

                {success && <p className="text-green-600">{success}</p>}
                {error && <p className="text-red-600">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function ContactItem({ icon: Icon, label, value, href }: any) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper href={href} target="_blank" className="flex gap-4 items-center">
      <Icon />
      <div>
        <p className="text-sm opacity-60">{label}</p>
        <p>{value}</p>
      </div>
    </Wrapper>
  );
}

function Field({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm uppercase mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="w-full border px-4 py-3"
      />
    </div>
  );
}
