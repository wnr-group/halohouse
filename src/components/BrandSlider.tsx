import React from 'react';

interface BrandLogo {
  name: string;
  logo?: string; // Optional image URL
}

const brands: BrandLogo[] = [
  { name: 'Brand One' },
  { name: 'Brand Two' },
  { name: 'Brand Three' },
  { name: 'Brand Four' },
  { name: 'Brand Five' },
  { name: 'Brand Six' },
  { name: 'Brand Seven' },
  { name: 'Brand Eight' },
];

export function BrandSlider() {
  // Duplicate brands array for seamless infinite loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section
      className="relative w-full overflow-hidden py-20 bg-transparent"
      style={{
       
        marginTop: 0,
        paddingTop: "5rem",
      }}
    >
      <div className="w-full">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#0A1628] text-center mb-16 tracking-wide">
          Trusted by Leading Brands
        </h2>

        <div className="relative w-full overflow-hidden">
          {/* Gradient overlays for fade effect */}
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F5E6D3] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F5E6D3] to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-16 md:gap-24 lg:gap-32 animate-scroll"
            style={{
              width: 'fit-content',
            }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '200px',
                  height: '120px',
                }}
              >
               <div className="w-full h-full flex items-center justify-center bg-white border border-[#0A1628]/15 rounded-lg p-6 hover:border-[#0A1628]/30 transition-colors">

                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <span className="text-[#0A1628]/60 text-sm font-light tracking-wider uppercase text-center">
                          {brand.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
