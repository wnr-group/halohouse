import { motion } from 'motion/react';
import { Building2, Smartphone, TrendingUp, Package, User, Film } from 'lucide-react';

export function ServicesPage() {
  const services = [
    {
      icon: Building2,
      title: 'Studio Space',
      description: 'Professional podcast recording environment with premium backdrops and equipment'
    },
    {
      icon: Smartphone,
      title: 'Reels',
      description: 'Short-form content creation for social media platforms and digital marketing'
    },
    {
      icon: TrendingUp,
      title: 'Commercials',
      description: 'Brand advertising and promotional video production for businesses'
    },
    {
      icon: Package,
      title: 'Product Shoots',
      description: 'High-quality product photography and videography for e-commerce and marketing'
    },
    {
      icon: User,
      title: 'Model Shoots',
      description: 'Professional modeling sessions and portrait photography with expert lighting'
    },
    {
      icon: Film,
      title: 'Editing',
      description: 'Post-production services including color grading, audio mixing, and final delivery'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A1628] pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-[#F5E6D3] mb-6 tracking-tight">
            Our Services
          </h1>
          <p className="text-xl md:text-2xl text-[#F5E6D3]/70 font-light leading-relaxed max-w-3xl">
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
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                className="group bg-[#1A2638] border border-[#FDB913]/20 hover:border-[#FDB913] transition-all duration-300 overflow-hidden"
              >
                {/* Icon Area */}
                <div className="relative h-64 bg-gradient-to-br from-[#0A1628]/50 to-[#FDB913]/10 flex items-center justify-center overflow-hidden">
                  <Icon className="w-20 h-20 text-[#FDB913]/40 group-hover:scale-110 group-hover:text-[#FDB913]/60 transition-all duration-300" strokeWidth={1} />
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-3xl font-light text-[#F5E6D3] mb-4 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-[#F5E6D3]/70 font-light leading-relaxed">
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
