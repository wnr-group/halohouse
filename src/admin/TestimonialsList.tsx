import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching testimonials:", error);
      setLoading(false);
      return;
    }

    setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (testimonial: any) => {
    if (!confirm(`Delete testimonial from "${testimonial.name}"?`)) return;

    setDeletingId(testimonial.id);

    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", testimonial.id);

    if (error) {
      alert("Failed to delete testimonial");
      setDeletingId(null);
      return;
    }

    setTestimonials((prev) => prev.filter((t) => t.id !== testimonial.id));
    setDeletingId(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Testimonials</h1>
        <Link to="/admin/testimonials/new" className="underline font-medium">
          ➜ Add Testimonial
        </Link>
      </div>

      {loading && <p className="opacity-60">Loading...</p>}

      {!loading && testimonials.length === 0 && (
        <p className="opacity-60">No testimonials found.</p>
      )}

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="border border-black/20 p-4 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={testimonial.avatar_url}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">
                  {testimonial.name}{" "}
                  <span className="font-normal opacity-60 text-sm">
                    · {testimonial.role} · {testimonial.company}
                  </span>
                </p>
                <p className="text-sm opacity-80 mt-1 max-w-xl">
                  {testimonial.message}
                </p>
                <p className="text-xs opacity-60 mt-1">
                  Rating: {testimonial.rating}/5
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                to={`/admin/testimonials/${testimonial.id}/edit`}
                className="text-sm underline font-medium"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(testimonial)}
                disabled={deletingId === testimonial.id}
                className="text-sm underline font-medium text-red-700 disabled:opacity-50"
              >
                {deletingId === testimonial.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsList;