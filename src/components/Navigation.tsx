import { motion } from 'motion/react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'studio', label: 'Studio' },
    { id: 'about', label: 'About' },
    { id: 'booking', label: 'Book Session' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/95 backdrop-blur-sm border-b border-[#FDB913]/20"
    >
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 py-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl tracking-widest text-[#F5E6D3] uppercase font-light hover:text-[#FDB913] transition-colors"
        >
          Halohouse
        </button>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-sm tracking-wider uppercase transition-colors relative ${
                currentPage === item.id
                  ? 'text-[#FDB913]'
                  : 'text-[#F5E6D3] hover:text-[#FDB913]'
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FDB913]"
                />
              )}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onNavigate('booking')}
          className="hidden md:block px-6 py-2.5 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all font-medium"
        >
          Book Now
        </button>
      </div>
    </motion.nav>
  );
}
