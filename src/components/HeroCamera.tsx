import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroCameraProps {
  cameraSrc?: string;
}

export function HeroCamera({
  cameraSrc = '/assets/camera.png', // placeholder path; replace with Sony/Nikon PNG
}: HeroCameraProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!stageRef.current || !cameraRef.current) return;

    let tl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      const heroEl = (stageRef.current?.closest('section') as HTMLElement | null) ?? stageRef.current;

      gsap.set(cameraRef.current!, {
        scale: 1,
        transformOrigin: 'center center',
        filter: 'drop-shadow(0px 10px 26px rgba(0,0,0,0.30))'
      });

      tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: '+=150%',
          scrub: 3,
          pin: stageRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(cameraRef.current!, {
        scale: 1.65,
        filter: 'drop-shadow(0px 30px 90px rgba(0,0,0,0.62))',
        duration: 0.75,
      });

      tl.to(cameraRef.current!, {
        scale: 1.65,
        filter: 'drop-shadow(0px 34px 105px rgba(0,0,0,0.66))',
        duration: 0.05,
      });

      // Zoom out only at the end (~80% -> 100%)
      tl.to(cameraRef.current!, {
        scale: 1,
        filter: 'drop-shadow(0px 12px 30px rgba(0,0,0,0.32))',
        duration: 0.2,
      });
    }, stageRef);

    return () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={stageRef} className="w-full h-screen flex items-center justify-center">
      <img
        ref={cameraRef}
        src={cameraSrc}
        alt="Camera"
        className="max-w-[340px] sm:max-w-[460px] md:max-w-[560px] lg:max-w-[680px] pointer-events-none"
        style={{
          willChange: 'transform, filter',
        }}
      />
    </div>
  );
}

export default HeroCamera;
