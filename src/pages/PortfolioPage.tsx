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
    <div className="min-h-screen pt-32 pb-20">

      <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-foreground">
            Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70">
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
              className="group relative aspect-[9/16] bg-white rounded-lg border border-border"

            >
              {/* Video Thumbnail Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/90"></div>


              {/* Category Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary/15 border border-primary/30 rounded-full">
                <p className="text-[10px] tracking-widest uppercase text-primary">
                  {item.category}
                </p>
              </div>

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />

                </div>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">

                <p className="text-xs tracking-wider uppercase text-foreground/90">

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
