import { useEffect, useState } from "react";

type Checkpoint = {
  id: string;
  title?: string;
  subtitle?: string;
  asset?: string;
};

type Props = {
  checkpoints: Checkpoint[];
};

const BrandCheckpoint = ({ checkpoints }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-checkpoint");
          if (entry.isIntersecting && id) {
            setActiveId(id);
          }
        });
      },
      { threshold: 0.6 }
    );

    checkpoints.forEach((cp) => {
      const el = document.querySelector(`[data-checkpoint="${cp.id}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [checkpoints]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 top-0 h-full w-1/3 flex items-center justify-center z-40"
    >
      {checkpoints.map((cp) => (
        <div
          key={cp.id}
          className={`absolute transition-all duration-700 ease-out
            ${activeId === cp.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          {cp.asset ? (
            <img
              src={cp.asset}
              alt=""
              className="w-[220px] max-w-full drop-shadow-md"
            />
          ) : (
            <div className="text-white text-center">
              <h2 className="text-3xl font-semibold tracking-wide">
                {cp.title}
              </h2>
              {cp.subtitle && (
                <p className="mt-2 text-sm opacity-80">
                  {cp.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BrandCheckpoint;
