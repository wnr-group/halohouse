import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import TestimonialForm from "./TestimonialForm";

const EditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [testimonialData, setTestimonialData] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
    rating: 5,
    avatar_url: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchTestimonial = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setTestimonialData(data);
      }

      setLoading(false);
    };

    fetchTestimonial();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) {
      alert("Testimonial ID missing");
      return;
    }

    const { error } = await supabase
      .from("testimonials")
      .update({
        name: testimonialData.name,
        role: testimonialData.role,
        company: testimonialData.company,
        message: testimonialData.message,
        rating: testimonialData.rating,
        avatar_url: testimonialData.avatar_url,
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update testimonial");
      return;
    }

    toast.success("Testimonial updated successfully");
    navigate("/admin/testimonials");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5E8D8] p-12">
        <p className="opacity-60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5E8D8] p-12">
      <h1 className="text-4xl font-bold mb-8">Edit Testimonial</h1>

      <TestimonialForm
        testimonialData={testimonialData}
        setTestimonialData={setTestimonialData}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditTestimonial;