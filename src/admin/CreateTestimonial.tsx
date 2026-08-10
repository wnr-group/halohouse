import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import TestimonialForm from "./TestimonialForm";

const CreateTestimonial = () => {
  const navigate = useNavigate();
  const [testimonialData, setTestimonialData] = useState({
    name: "",
    role: "Client",
    company: "",
    message: "",
    rating: 5,
    avatar_url: "",
  });

  const handleSave = async () => {
    if (!testimonialData.name || !testimonialData.message) {
      alert("Name and message are required");
      return;
    }

    const { count } = await supabase
      .from("testimonials")
      .select("*", { count: "exact", head: true });

    const { error } = await supabase.from("testimonials").insert([
      { ...testimonialData, sort_order: (count || 0) + 1 },
    ]);

    if (error) {
      alert("Failed to save testimonial");
      return;
    }

    toast.success("Testimonial added successfully");
    navigate("/admin/testimonials");
  };

  return (
    <div className="min-h-screen bg-[#F5E8D8] p-12">
      <h1 className="text-4xl font-bold mb-8">Add Testimonial</h1>

      <TestimonialForm
        testimonialData={testimonialData}
        setTestimonialData={setTestimonialData}
        onSubmit={handleSave}
        submitLabel="Add Testimonial"
      />
    </div>
  );
};

export default CreateTestimonial;