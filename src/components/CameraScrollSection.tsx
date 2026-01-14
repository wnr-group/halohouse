import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CameraScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    // Immediate return if refs aren't ready
    if (!containerRef.current || !sectionRef.current || !cameraRef.current) return;

    const ctx = gsap.context(() => {
      // Create scroll-driven 3D animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%", // Extended scroll for slow, cinematic feel
          scrub: 1.5,
          pin: true, // Pin the SECTION
          anticipatePin: 1,
          invalidateOnRefresh: true, // Handle resizes better
        },
      });

      // 3D Animation sequence

      // Phase 1: Camera "comes out" - Zoom OUT with 3D rotation
      tl.fromTo(
        cameraRef.current,
        {
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          opacity: 0.9,
        },
        {
          scale: 0.6, // Zoom OUT
          rotateX: 8, // Tilt forward
          rotateY: -15, // Rotate left
          rotateZ: -3,
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut",
        }
      )
        // Phase 2: Cinematic Focus - Zoom IN with opposite rotation
        .to(cameraRef.current, {
          scale: 1.3, // Zoom IN
          rotateX: -6, // Tilt back
          rotateY: 15, // Rotate right
          rotateZ: 3,
          duration: 0.5,
          ease: "power2.inOut",
        })
        // Phase 3: Settle to final position
        .to(cameraRef.current, {
          scale: 1.1,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          duration: 0.3,
          ease: "power1.out",
        });

      // Subtle floating animation
      gsap.to(cameraRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    }, containerRef); // Scope to wrapper

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    // WRAPPER DIV: React controls this.
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: "100vh", backgroundColor: "#0A1628" }}
    >
      <section
        ref={sectionRef}
        id="camera-section"
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          height: "100vh", // Explicit height
          minHeight: "100vh", // Fallback
          backgroundColor: "#0A1628",
        }}
      >
        {/* Spotlight glow effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(253, 185, 19, 0.2) 0%, rgba(253, 185, 19, 0.08) 35%, transparent 65%)",
          }}
        />

        {/* Secondary ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(10, 22, 40, 0.5) 0%, transparent 70%)",
          }}
        />

        {/* 3D Camera Container */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <img
            ref={cameraRef}
            src="/Assets/camera.png"
            alt="Professional Camera"
            className="w-[350px] md:w-[450px] lg:w-[550px] xl:w-[600px] h-auto object-contain"
            style={{
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 0 80px rgba(253, 185, 19, 0.35)) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))",
              willChange: "transform",
            }}
          />
        </div>


      </section>
    </div>
  );
}
