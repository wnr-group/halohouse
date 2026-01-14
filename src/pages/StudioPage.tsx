import { motion } from 'motion/react';
import { Camera, Lightbulb, Mic2, Users, Film, Calendar } from 'lucide-react';
import { Backdrops } from '../components/Backdrops';

export function StudioPage() {
  const capabilities = [
    {
      icon: Camera,
      title: 'Pro Cameras',
      description: 'Crisp, multi-angle coverage'
    },
    {
      icon: Lightbulb,
      title: 'Cinematic Lighting',
      description: 'Key, fill, and accent lighting'
    },
    {
      icon: Mic2,
      title: 'Broadcast Mics',
      description: 'Clean, controlled sound'
    },
    {
      icon: Users,
      title: 'Assistive Team',
      description: 'On-set help and guidance'
    },
    {
      icon: Film,
      title: 'Post-Production',
      description: 'Editing and social clips'
    },
    {
      icon: Calendar,
      title: 'Flexible Booking',
      description: 'Hourly or bundled sessions'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A1628] pt-32 pb-20">
      {/* Studio Capabilities Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-[#0A1628]">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-20"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-[#F5E6D3] mb-6 tracking-tight">
              Studio Capabilities
            </h1>
            <p className="text-xl md:text-2xl text-[#F5E6D3]/70 font-light leading-relaxed max-w-4xl">
              Professional equipment and expert support for every aspect of your production
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  className="group"
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2, ease: "easeOut" }}
                    className="mb-6"
                  >
                    <Icon className="w-12 h-12 text-[#FDB913]/60 group-hover:text-[#FDB913] transition-colors" strokeWidth={1} />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-light text-[#F5E6D3] mb-3 tracking-tight">
                    {capability.title}
                  </h3>
                  <p className="text-[#F5E6D3]/60 font-light leading-relaxed text-lg">
                    {capability.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Backdrops Section */}
      <Backdrops />
    </div>
  );
}
