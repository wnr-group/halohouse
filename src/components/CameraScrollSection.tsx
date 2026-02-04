import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Import the model so Vite can handle it properly
import cameraModelUrl from "../assets/models/canon_at-1_retro_camera.glb?url";

// Import brand images
import brand1 from "../assets/brand/brand-1.png";
import brand2 from "../assets/brand/brand-2.png";
import brand3 from "../assets/brand/brand-3.png";

gsap.registerPlugin(ScrollTrigger);

type DeviceMode = "mobile" | "desktop";

export function CameraScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number>(0);

  const [isLoaded, setIsLoaded] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() =>
    typeof window !== "undefined" && window.innerWidth < 768
      ? "mobile"
      : "desktop",
  );

  // Device detection - only on resize, debounced
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newMode = window.innerWidth < 768 ? "mobile" : "desktop";
        setDeviceMode((prev) => (prev !== newMode ? newMode : prev));
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Main Three.js and animation setup
  useLayoutEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const isMobile = deviceMode === "mobile";

    // Clean up previous
    ScrollTrigger.getAll().forEach((st) => st.kill());
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    canvasRef.current.innerHTML = "";
    cancelAnimationFrame(animationIdRef.current);

    // --- THREE.JS SETUP ---
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 2000);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Model group for transformations
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const backLight = new THREE.SpotLight(0xfdb913, 15);
    backLight.position.set(-10, 10, -5);
    scene.add(backLight);

    // Load Model
    const loader = new GLTFLoader();

    loader.load(
      cameraModelUrl,
      (gltf) => {
        const model = gltf.scene;

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        modelGroup.add(model);
        modelGroup.rotation.set(0.1, -0.3, 0);

        if (isMobile) {
          // MOBILE: Static centered camera
          model.scale.set(200, 200, 200);
          modelGroup.position.set(0, 0, 0);
          camera.position.set(0, 3, 80);
          camera.fov = 32;
          camera.updateProjectionMatrix();
        } else {
          // DESKTOP: Camera on left, animated
          model.scale.set(250, 250, 250);
          modelGroup.position.set(-20, -5, 0);
          camera.position.set(0, 5, 80);

          // Create desktop animation timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "+=400%",
              scrub: 1.5,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
            },
          });

          // Timeline labels

          tl.addLabel("stage1", 0);
          tl.addLabel("stage2", 1.5);
          tl.addLabel("stage3", 3.5);
          tl.addLabel("end", 6);

          // Camera 3D animation
          tl.to(
            model.scale,
            { x: 220, y: 220, z: 220, duration: 2, ease: "power2.inOut" },
            "stage1",
          )
            .to(
              modelGroup.rotation,
              { y: Math.PI * 0.5, duration: 2, ease: "power2.inOut" },
              "stage1",
            )
            .to(
              modelGroup.position,
              { x: -20, y: -5, z: 0, duration: 2, ease: "power2.inOut" },
              "stage1",
            );

          tl.to(
            modelGroup.rotation,
            { x: 0.3, y: Math.PI * 1.2, duration: 3, ease: "power1.inOut" },
            "stage2",
          ).to(
            modelGroup.position,
            { x: -18, y: -5, z: 0, duration: 3, ease: "power1.inOut" },
            "stage2",
          );

          tl.to(
            model.scale,
            { x: 350, y: 350, z: 350, duration: 2.5, ease: "power3.inOut" },
            "stage3",
          )
            .to(
              modelGroup.position,
              { x: 0, y: -5, z: 30, duration: 2.5, ease: "power3.inOut" },
              "stage3",
            )
            .to(
              modelGroup.rotation,
              { x: 0, y: 0, z: 0, duration: 2.5, ease: "power3.inOut" },
              "stage3",
            );

          tl.to(
            modelGroup.position,
            { z: -100, duration: 1, ease: "power3.in" },
            "end",
          ).to(renderer.domElement, { opacity: 0, duration: 1 }, "end");

          // Brand panel animations - run in PARALLEL with camera
          tl.fromTo(
            "#brand-panel",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
            "stage1+=0.5",
          );

          // Brand 1: visible during stage1, fade out before stage2
          tl.fromTo(
            "#brand-1",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 },
            "stage1+=0.6",
          ).to(
            "#brand-1",
            { opacity: 0, y: -20, duration: 0.6 },
            "stage2-=0.3",
          );

          // Brand 2: visible during stage2, fade out before stage3
          tl.fromTo(
            "#brand-2",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 },
            "stage2+=0.2",
          ).to(
            "#brand-2",
            { opacity: 0, y: -20, duration: 0.6 },
            "stage3-=0.3",
          );

          // Brand 3: visible during stage3, fade out at end
          tl.fromTo(
            "#brand-3",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 },
            "stage3+=0.2",
          ).to("#brand-panel", { opacity: 0, duration: 0.8 }, "end");
        }

        setIsLoaded(true);
        gsap.set(renderer.domElement, { opacity: 1 });
        ScrollTrigger.refresh();
      },
      undefined,
      (err) => console.error("Error loading camera model:", err),
    );

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      renderer.dispose();
      canvasRef.current?.replaceChildren();
    };
  }, [deviceMode]);

  // Mobile brand card animations - separate effect
  useEffect(() => {
    if (deviceMode !== "mobile") return;

    const timeout = setTimeout(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".mobile-brand-card");

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timeout);
  }, [deviceMode, isLoaded]);

  return (
    <>
      {/* Camera Section */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{
          height: deviceMode === "mobile" ? "60vh" : "100vh",
          backgroundColor: "#F5E6D3",
        }}
      >
        {/* Three.js Canvas */}
        <div
          ref={canvasRef}
          className="absolute inset-0 z-20"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Desktop Brand Panel */}
        {deviceMode === "desktop" && (
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center">
            <div className="relative max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 w-full h-full flex items-center">
              <div
                id="brand-panel"
                className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 w-[500px] text-right opacity-0"
              >
                <div className="relative min-h-[450px] flex flex-col justify-center">
                  {/* Brand 1 */}
                  <div
                    id="brand-1"
                    className="absolute inset-0 flex flex-col items-end justify-center text-right"
                  >
                    <img
                      src={brand1}
                      alt=""
                      className="w-80 h-auto mb-6 rounded-2xl shadow-xl"
                    />
                    <h2 className="text-5xl font-light tracking-tight text-[#0A1628]">
                      Crafted for Creators
                    </h2>
                    <p className="mt-3 text-xl text-[#0A1628]/60 max-w-md ml-auto">
                      A studio-grade camera experience.
                    </p>
                  </div>

                  {/* Brand 2 */}
                  <div
                    id="brand-2"
                    className="absolute inset-0 flex flex-col items-end justify-center text-right opacity-0"
                  >
                    <img
                      src={brand2}
                      alt=""
                      className="w-80 h-auto mb-6 rounded-2xl shadow-xl"
                    />
                    <h2 className="text-5xl font-light tracking-tight text-[#0A1628]">
                      Precision Engineering
                    </h2>
                    <p className="mt-3 text-xl text-[#0A1628]/60 max-w-md ml-auto">
                      Designed to capture every detail.
                    </p>
                  </div>

                  {/* Brand 3 */}
                  <div
                    id="brand-3"
                    className="absolute inset-0 flex flex-col items-end justify-center text-right opacity-0"
                  >
                    <img
                      src={brand3}
                      alt=""
                      className="w-80 h-auto mb-6 rounded-2xl shadow-xl"
                    />
                    <h2 className="text-5xl font-light tracking-tight text-[#0A1628]">
                      Built to Inspire
                    </h2>
                    <p className="mt-3 text-xl text-[#0A1628]/60 max-w-md ml-auto">
                      Where creativity meets performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0A1628] text-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Loading Camera Experience</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Brand Cards */}
      {deviceMode === "mobile" && (
        <section className="w-full py-12 bg-[#F5E6D3]">
          <div className="max-w-md mx-auto px-6 space-y-12">
            {/* Brand 1 */}
            <div className="mobile-brand-card flex flex-col items-center text-center">
              <img
                src={brand1}
                className="w-full max-w-[280px] mb-5 rounded-xl shadow-lg"
                alt="Crafted for Creators"
              />
              <h2 className="text-2xl font-light text-[#0A1628]">
                Crafted for Creators
              </h2>
              <p className="mt-2 text-base text-[#0A1628]/60">
                A studio-grade camera experience.
              </p>
            </div>

            {/* Brand 2 */}
            <div className="mobile-brand-card flex flex-col items-center text-center">
              <img
                src={brand2}
                className="w-full max-w-[280px] mb-5 rounded-xl shadow-lg"
                alt="Precision Engineering"
              />
              <h2 className="text-2xl font-light text-[#0A1628]">
                Precision Engineering
              </h2>
              <p className="mt-2 text-base text-[#0A1628]/60">
                Designed to capture every detail.
              </p>
            </div>

            {/* Brand 3 */}
            <div className="mobile-brand-card flex flex-col items-center text-center">
              <img
                src={brand3}
                className="w-full max-w-[280px] mb-5 rounded-xl shadow-lg"
                alt="Built to Inspire"
              />
              <h2 className="text-2xl font-light text-[#0A1628]">
                Built to Inspire
              </h2>
              <p className="mt-2 text-base text-[#0A1628]/60">
                Where creativity meets performance.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
