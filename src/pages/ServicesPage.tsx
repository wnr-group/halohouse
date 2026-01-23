import { motion } from "motion/react";
import {
  Building2,
  Smartphone,
  TrendingUp,
  Package,
  User,
  Film
} from "lucide-react";

export function ServicesPage() {
  const services = [
    {
      icon: Building2,
      title: "Studio Space",
      description:
        "Professional podcast recording environment with premium backdrops and equipment"
    },
    {
      icon: Smartphone,
      title: "Reels",
      description:
        "Short-form content creation for social media platforms and digital marketing"
    },
    {
      icon: TrendingUp,
      title: "Commercials",
      description:
        "Brand advertising and promotional video production for businesses"
    },
    {
      icon: Package,
      title: "Product Shoots",
      description:
        "High-quality product photography and videography for e-commerce and marketing"
    },
    {
      icon: User,
      title: "Model Shoots",
      description:
        "Professional modeling sessions and portrait photography with expert lighting"
    },
    {
      icon: Film,
      title: "Editing",
      description:
        "Post-production services including color grading, audio mixing, and final delivery"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background text-foreground">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <h1 className="font-light">
            Our Services
          </h1>
          <p className="mt-4 text-foreground/70 max-w-3xl">
            Comprehensive content creation solutions for every need
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="
                  group
                  bg-white
                  border border-border
                  rounded-lg
                  overflow-hidden
                  transition-all
                "
              >
                {/* Icon Area */}
                <div className="h-56 flex items-center justify-center bg-muted">
                  <Icon
                    className="
                      w-16 h-16
                      text-primary/60
                      group-hover:text-primary
                      transition-colors
                    "
                    strokeWidth={1}
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="mb-3">
                    {service.title}
                  </h3>
                  <p className="text-foreground/60">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
