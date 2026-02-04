interface Testimonial {
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Aatchiyarkalvi",
    role: "Client",
    company: "Education Platform",
    message:
      "Thank you to the entire team for the excellent performance of the UPSC video sessions.",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=11",
  },
  {
    name: "Ganesh",
    role: "Client",
    company: "Jthillai Sales & Distribution",
    message:
      "Huge appreciation to the Term One video editors! Your creativity, dedication, and attention to detail truly stand out. The effort put into every frame is simply awesome. Great work and keep shining!",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Ragul",
    role: "Client",
    company: "Clothing Store",
    message:
      "Seriously no words to say. Editing super. Very good!",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=13",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center mb-12">
          Trusted by our clients
        </h2>


        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
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
                  src={item.avatar}
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
