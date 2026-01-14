import { motion } from 'motion/react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 relative h-[500px] lg:h-[700px] bg-gradient-to-br from-[#1A2638] to-[#FDB913]/20 rounded-lg overflow-hidden border border-[#FDB913]/20"
          >
            {/* Stock studio/team image placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#F5E6D3]/30 text-sm tracking-widest uppercase mb-2">
                  Stock Image Placeholder
                </p>
                <p className="text-[#F5E6D3]/20 text-xs tracking-widest uppercase">
                  Studio Team / Workspace
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-[#F5E6D3] mb-12 tracking-tight leading-[1.1]">
              About Us
            </h1>

            <p className="text-3xl md:text-4xl lg:text-5xl font-light text-[#F5E6D3] leading-[1.3] mb-12">
              Premium podcast visuals. Zero setup. Cool looks. Endless episodes.
            </p>

            <div className="space-y-6 text-lg md:text-xl text-[#F5E6D3]/70 font-light leading-relaxed">
              <p>
                We believe every creator deserves access to professional-grade content creation tools without the complexity of traditional studios.
              </p>
              <p>
                Our mission is to empower podcasters, content creators, and brands with a seamless studio experience that lets them focus on what matters most—their message.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
