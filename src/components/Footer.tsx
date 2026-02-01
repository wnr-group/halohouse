import { Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const features = [
    'Professional Equipment',
    'Expert Support',
    'Flexible Pricing',
    'Quick Turnaround'
  ];

  return (
    <footer className="bg-[#223A5E] text-[#F5E6D3]/90">
      {/* Main Footer */}
      <div className="py-16 px-8 md:px-16 lg:px-24 border-t border-white/10">
        <div className="max-w-[1600px] mx-auto">

          {/* Tagline */}
          <div className="text-center mb-16">
            <Link
              to="/"
              className="text-2xl tracking-widest uppercase font-light mb-8 text-[#FDB913] hover:text-[#F5E6D3]/90 transition-colors inline-block"
            >
              Halohouse
            </Link>
            <p className="text-xl md:text-2xl text-[#F5E6D3]/90 font-light leading-relaxed max-w-4xl mx-auto">
              Premium podcast visuals. Zero setup. Cool looks. Endless episodes.
            </p>
          </div>

          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="px-5 py-2 border border-white/10 text-xs tracking-widest uppercase text-[#F5E6D3]/80"
              >
                {feature}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center md:text-left">
            {/* Contact */}
            <div>
              <h4 className="text-xs tracking-widest uppercase text-[#F5E6D3]/60 mb-4">
                Contact
              </h4>
              <div className="space-y-2 font-light text-[#F5E6D3]/80">
                <div>+91 7010017080</div>
                <div>hello@halohouse.studio</div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs tracking-widest uppercase text-[#F5E6D3]/60 mb-4">
                Quick Links
              </h4>
              <div className="space-y-2">
                {[
                  { id: '/about', label: 'About' },
                  { id: '/portfolio', label: 'Portfolio' },
                  { id: '/services', label: 'Services' },
                  { id: '/contact', label: 'Contact' }
                ].map((link, index) => (
                  <div key={index}>
                    <Link
                      to={link.id}
                      className="text-[#F5E6D3]/80 hover:text-[#FDB913] transition-colors font-light"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-xs tracking-widest uppercase text-[#F5E6D3]/60 mb-4">
                Follow
              </h4>
              <div className="space-y-2">
                {['Instagram', 'Twitter', 'YouTube'].map((social, index) => (
                  <div key={index}>
                    <a
                      href="#"
                      className="text-[#F5E6D3]/80 hover:text-[#FDB913] transition-colors font-light"
                    >
                      {social}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-8 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest uppercase text-[#F5E6D3]/60">
          <div>© 2026 Halohouse. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#FDB913] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#FDB913] transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
