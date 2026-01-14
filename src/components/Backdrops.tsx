import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function Backdrops() {
  const backdrops = [
    {
      name: 'Ember',
      description: 'Warm & Energetic',
      color: 'from-orange-600 to-red-600',
      image: 'https://images.unsplash.com/photo-1761427058790-e880666331ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwb3JhbmdlJTIwYmFja2Ryb3B8ZW58MXx8fHwxNzY3NzkzNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      details: 'Perfect for lifestyle and motivational content'
    },
    {
      name: 'Sage',
      description: 'Natural & Calming',
      color: 'from-green-600 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1564352969906-8b7f46ba4b8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWdlJTIwZ3JlZW4lMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2Nzc5NTU5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      details: 'Ideal for wellness and educational podcasts'
    },
    {
      name: 'Noir',
      description: 'Bold & Dramatic',
      color: 'from-slate-800 to-slate-950',
      image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbm9pciUyMGJhY2tkcm9wfGVufDF8fHx8MTc2Nzc5NTU5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      details: 'Great for interviews and serious discussions'
    },
    {
      name: 'Elen',
      description: 'Clean & Modern',
      color: 'from-slate-100 to-slate-300',
      image: 'https://images.unsplash.com/photo-1732191814946-9036f914442a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2Nzc5NTU5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      details: 'Perfect for tech and business content'
    }
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 md:py-40 px-8 md:px-16 lg:px-24 bg-[#F5E6D3]">
      <div className="max-w-[1600px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#0A1628] mb-6 tracking-tight">
            Distinct Backdrops
          </h2>
          <p className="text-lg md:text-xl text-[#0A1628]/60 max-w-3xl font-light leading-relaxed">
            Each backdrop instantly shifts mood and brand feel — no delays, no costly set builds
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {backdrops.map((backdrop, index) => {
            const cardRef = useRef(null);
            const cardInView = useInView(cardRef, { once: true, margin: "-150px" });
            
            return (
              <motion.div
                key={index}
                ref={cardRef}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={cardInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 100, scale: 0.95 }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                {/* Single large image */}
                <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-[#0A1628] mb-8">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    src={backdrop.image}
                    alt={backdrop.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${backdrop.color} opacity-20 group-hover:opacity-10 transition-opacity duration-700`}></div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-light text-[#0A1628] mb-2 tracking-tight">{backdrop.name}</h3>
                    <p className="text-sm tracking-widest uppercase text-[#FDB913] mb-3">{backdrop.description}</p>
                  </div>
                  <p className="text-base text-[#0A1628]/70 font-light leading-relaxed">{backdrop.details}</p>
                  
                  <button className="mt-6 text-sm tracking-widest uppercase text-[#0A1628] hover:text-[#FDB913] transition-colors font-medium inline-flex items-center gap-2 border-b border-[#0A1628] hover:border-[#FDB913] pb-1">
                    Book This Look
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}