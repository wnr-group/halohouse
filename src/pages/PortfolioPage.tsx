import { motion } from 'motion/react';
import { Play } from 'lucide-react';

export function PortfolioPage() {
  const portfolioItems = [
    { id: 1, title: 'Podcast Session', category: 'Studio' },
    { id: 2, title: 'Interview Setup', category: 'Studio' },
    { id: 3, title: 'Social Media Reel', category: 'Reels' },
    { id: 4, title: 'Brand Commercial', category: 'Commercials' },
    { id: 5, title: 'Product Video', category: 'Shoots' },
    { id: 6, title: 'Live Session', category: 'Studio' },
    { id: 7, title: 'Instagram Reel', category: 'Reels' },
    { id: 8, title: 'Advertisement', category: 'Commercials' },
    { id: 9, title: 'Model Photoshoot', category: 'Shoots' },
    { id: 10, title: 'Documentary Style', category: 'Studio' }
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
            Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-[#F5E6D3]/70 font-light leading-relaxed max-w-3xl">
            Explore our collection of professional content created in our studio
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              className="group relative aspect-[9/16] bg-[#1A2638] rounded-lg overflow-hidden cursor-pointer"
            >
              {/* Video Thumbnail Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FDB913]/20 to-[#0A1628]/80"></div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#FDB913]/20 backdrop-blur-sm border border-[#FDB913]/30 rounded-full">
                <p className="text-[10px] tracking-widest uppercase text-[#FDB913]">
                  {item.category}
                </p>
              </div>

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-[#FDB913] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-[#0A1628] fill-current ml-1" />
                </div>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A1628] to-transparent">
                <p className="text-xs tracking-wider uppercase text-[#F5E6D3]/90 font-light">
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
