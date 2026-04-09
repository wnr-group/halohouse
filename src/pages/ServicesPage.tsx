import { motion } from "motion/react";
import { SEO } from "../components/SEO";
import Createpro from "../assets/Service/Create-pro-content.webp"
import Reels from "../assets/Service/Reels-WebsiteService.webp";
import Editing from "../assets/Service/Editing-WebsiteService.webp";
import Modelshoot from "../assets/Service/ModelShoot-WebsiteService.webp";
import Productshoot from "../assets/Service/ProductShoot-WebsiteService.webp";
import Studiospace from "../assets/Service/StudioSpace-WebsiteService.webp";
import Commercials from "../assets/Service/Commercial-WebsiteService.webp";

export function ServicesPage() {
  const sections = [
    {
      title: "Commercials",
      description: "High-impact brand advertising and promotional video production designed to showcase your business, attract customers, and communicate your message clearly across digital and social platforms.",
      image: Commercials,
      alt: "Commercials-WebsiteService",
      reverse: false
    },
    {
      title: "Reels",
      description: "Short-form video creation optimized for social media and digital marketing to boost reach, engagement, and brand visibility.",
      image: Reels,
      alt: "Reels-WebsiteService",
      reverse: true
    },
    {
      title: "Editing",
      description: "Post-production including color grading, audio cleanup, and final polished output ready for publishing.",
      image: Editing,
      alt: "Editing-WebsiteService",
      reverse: false
    },
    {
      title: "Model Shoots",
      description: "Professional modeling and portrait photography with controlled lighting to capture sharp, high-quality visuals for branding, portfolios, and marketing use.",
      image: Modelshoot,
      alt: "ModelShoot-WebsiteService",
      reverse: true
    },
    {
      title: "Product Shoots",
      description: "Professional product photography and video production that present your products clean, sharp, and attractive — built for e-commerce listings, ads, and marketing.",
      image: Productshoot,
      alt: "ProductShoot-WebsiteService",
      reverse: false
    },
    {
      title: "Studio Space",
      description: "A sound-treated, noise-free podcast studio designed to capture clear, broadcast-level audio with premium backdrops, microphones, and lighting.",
      image: Studiospace,
      alt: "StudioSpace-WebsiteService",
      reverse: true
    }
  ];

  return (
    <div className="bg-[#F6E9D7] text-[#1E2A3A]">
      <SEO
        title="Our Services | Halo House"
        description="Premium podcast, video production, and studio services."
      />

      {/* HERO */}
      <section className="pt-32 pb-24">
        {/* Changed max-width to 7xl for better visual balance */}
        <div className="max-w-7xl mx-auto px-8 md:px-16 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-[#000000] leading-tight">
              Create like a pro<br />
              Sound like a Brand
            </h1>
            <p className="mt-6 text-[#000000] font-normal text-lg max-w-xl">
              Walk in with an idea. Walk out with premium Podcast & Video Content.
            </p>
            <p className="mt-4 md:text-xl text-lg font-bold text-[#000000]">
              Not Just Recording<br />
              Real Studio Experience
            </p>
            <button className="mt-8 px-8 py-3 bg-[#223A5E] text-white rounded-md">
              Book Now
            </button>
          </motion.div>

          <motion.img
            src={Createpro}
            alt="Studio"
            /* Added max-h and object-cover to prevent the image from being too big */
            className="rounded-2xl w-full max-h-[500px] object-cover shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </section>

      {/* OUR SERVICES */}
      <section className="py-24">
        <h2 className="text-center text-5xl text-[#000000] font-black mb-24">
          Our Services
        </h2>

        <div className="space-y-32">
          {sections.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              /* max-w-7xl and items-center keeps text and image aligned side-by-side */
              className="max-w-7xl mx-auto px-8 md:px-16 grid md:grid-cols-2 gap-12 md:gap-24 items-center"
            >
              {/* Image Column - Uses order classes to handle 'reverse' properly */}
              <div className={`${item.reverse ? "md:order-2" : "md:order-1"}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  /* Added max-h and object-cover to make all images uniform */
                  className="rounded-2xl w-full h-auto max-h-[400px] object-cover shadow-md"
                />
              </div>

              {/* Text Column */}
              <div className={`${item.reverse ? "md:order-1" : "md:order-2"}`}>
                <h3 className="text-5xl font-bold mb-6 text-[#223A5E]">
                  {item.title}
                </h3>
                <p className="text-lg font-normal leading-relaxed text-[#223A5E]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}