import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to a <video> element.
 * The `src` is only assigned once the element enters the viewport,
 * preventing unnecessary network requests for off-screen videos.
 */
export function useVideoInView(src: string, options?: IntersectionObserverInit) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.01, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInView && ref.current) {
      ref.current.src = src;
    }
  }, [isInView, src]);

  return ref;
}
