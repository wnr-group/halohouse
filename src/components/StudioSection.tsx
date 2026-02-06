import { motion } from 'motion/react';
import { Camera, Lightbulb, Mic2, Users, Film, Calendar } from 'lucide-react';


export function StudioSection() {
  const capabilities = [
    { icon: Camera, title: 'Pro Cameras', description: 'Crisp, multi-angle coverage' },
    { icon: Lightbulb, title: 'Cinematic Lighting', description: 'Key, fill, and accent lighting' },
    { icon: Mic2, title: 'Broadcast Mics', description: 'Clean, controlled sound' },
    { icon: Users, title: 'Assistive Team', description: 'On-set help and guidance' },
    { icon: Film, title: 'Post-Production', description: 'Editing and social clips' },
    { icon: Calendar, title: 'Flexible Booking', description: 'Hourly or bundled sessions' }
  ];

  return (
    <>
      {/* Studio Capabilities */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-transparent">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-20"
          >
            <h2 className="text-[#0A1628]">
              Studio Capabilities
            </h2>
            <p className="mt-6 text-[#0A1628]/70 max-w-4xl">
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
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                >
                  <Icon className="w-12 h-12 text-[#0A1628]/60 mb-6" strokeWidth={1} />
                  <h3 className="text-[#0A1628] mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-[#0A1628]/60">
                    {capability.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Backdrops */}
      
    </>
  );
}
