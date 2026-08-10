import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  avatar_url: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data) setTestimonials(data);
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center mb-12">
          Trusted by our clients
        </h2>


        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-[var(--radius)] border border-border p-6"

            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color: i < item.rating
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>


              {/* Message */}
              <p className="text-muted-foreground mb-6 italic">
                “{item.message}”
              </p>

              <hr className="mb-4 border-border" />

              {/* User */}
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar_url}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.role} · {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
