import { motion } from 'framer-motion'; // Note: Ensure you are using 'framer-motion' or your specific 'motion/react' alias
import { useTheme } from "../theme/ThemeContext";
import { useRef, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const theme = useTheme();
  const contactRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!contactRef.current) return;

    const updateContactX = () => {
      if (contactRef.current) {
        const rect = contactRef.current.getBoundingClientRect();
        (window as any).__CONTACT_X__ = rect.left + rect.width / 2;

        // 🔑 force GSAP to re-align if ScrollTrigger is active
        ScrollTrigger.refresh();
      }
    };

    // Initial calculation
    updateContactX();

    window.addEventListener("resize", updateContactX);
    return () => window.removeEventListener("resize", updateContactX);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'careers', label: 'Careers' },
    { id: 'booking', label: 'Book Session' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 w-full z-50"
      style={{
         backgroundColor: "#223A5E", // lighter blueish shade
         borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#F5E6D3"
      }}
    >
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 py-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl tracking-widest uppercase font-light transition-colors"
          style={{ color: theme.textPrimary }}
          onMouseEnter={(e) => (e.currentTarget.style.color = theme.accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = theme.textPrimary)}
        >
          Halohouse
        </button>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              ref={item.id === "contact" ? contactRef : null}
              onClick={() => onNavigate(item.id)}
              className="text-sm tracking-wider uppercase transition-colors relative"
              style={{
                color: currentPage === item.id ? theme.accent : theme.textSecondary
              }}
            >
              {item.label}
              {currentPage === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: theme.accent }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onNavigate('booking')}
          className="hidden md:block px-6 py-2.5 text-sm tracking-widest uppercase transition-all font-medium"
          style={{
            backgroundColor: theme.accent,
            color: theme.bg
          }}
        >
          Book Now
        </button>
      </div>
    </nav>
  );
}