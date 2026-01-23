import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

gsap.registerPlugin(ScrollTrigger);

export function CameraScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
   
    if (!containerRef.current || !canvasRef.current) return;

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();
    
    const getContainerSize = () => {
  const rect = containerRef.current!.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
};
   
    const { width, height } = getContainerSize();

const camera = new THREE.PerspectiveCamera(
  35,
  width / height,
  0.1,
  2000
);
   
    camera.position.set(0, 0, 80);

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

/* 🔑 CRITICAL: force canvas to fill container */
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
renderer.domElement.style.display = "block";

canvasRef.current.appendChild(renderer.domElement);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const backLight = new THREE.SpotLight(0xFDB913, 15);
    backLight.position.set(-10, 10, -5);
    scene.add(backLight);

    // Load Model
    const loader = new GLTFLoader();
    let model: THREE.Group | null = null;

    loader.load(
      "/src/assets/models/canon_at-1_retro_camera.glb",
      (gltf) => {
        model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        model.scale.set(200, 200, 200);
        model.position.set(0, -10, 0);

        modelGroup.rotation.set(0.1, -0.3, 0);
        modelGroup.add(model);
        setIsLoaded(true);

        gsap.set(renderer.domElement, { opacity: 1 });

        // --- GSAP TIMELINE ---
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=500%",
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onRefresh: () => {
              const contactX = (window as any).__CONTACT_X__;
              if (!contactX || !innerRef.current) return;

              const rect = innerRef.current.getBoundingClientRect();
              const localX = contactX - rect.left;

              gsap.set("#brand-panel", {
                left: localX,
                xPercent: -50,
              });
            },
          }
        });

        tl.addLabel("stage1", 0);
        tl.addLabel("stage2", 1.5);
        tl.addLabel("stage3", 3.5);
        tl.addLabel("stage4", 6);

        // BRAND STORY ANIMATION
        tl.fromTo("#brand-panel",
          { opacity: 0, y: 20, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
          "stage1+=0.6"
        );

        tl.fromTo("#brand-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "stage1+=0.8");
        tl.to("#brand-1", { opacity: 0, y: -20, duration: 0.8 }, "stage2");
        tl.fromTo("#brand-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "stage2+=0.2");
        tl.to("#brand-2", { opacity: 0, y: -20, duration: 0.8 }, "stage3");
        tl.fromTo("#brand-3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "stage3+=0.2");
        tl.to("#brand-panel", { opacity: 0, duration: 0.6 }, "stage4");

        // 3D CAMERA ANIMATION
        tl.to(model.scale, { x: 150, y: 150, z: 150, duration: 2, ease: "power2.inOut" }, "stage1")
          .to(modelGroup.rotation, { y: Math.PI * 0.5, duration: 2, ease: "power2.inOut" }, "stage1")
          .to(modelGroup.position, { x: -25, duration: 2, ease: "power2.inOut" }, "stage1");

        tl.to(modelGroup.rotation, { x: 0.6, y: Math.PI * 1.2, duration: 3, ease: "power1.inOut" }, "stage2");

        tl.to(model.scale, { x: 300, y: 300, z: 300, duration: 2.5, ease: "power3.inOut" }, "stage3")
          .to(modelGroup.position, { x: 0, y: 0, z: 40, duration: 2.5, ease: "power3.inOut" }, "stage3")
          .to(modelGroup.rotation, { x: 0, y: 0, z: 0, duration: 2.5, ease: "power3.inOut" }, "stage3");

        tl.to(modelGroup.position, { z: -100, duration: 1, ease: "power3.in" }, "stage4")
          .to(renderer.domElement, { opacity: 0, duration: 1 }, "stage4");

        // Initial alignment
        ScrollTrigger.refresh();
      },
      undefined,
      (err) => console.error("Error loading model:", err)
    );

    const handleResize = () => {
  if (!containerRef.current) return;

  const { width, height } = getContainerSize();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  ScrollTrigger.refresh();
};
    window.addEventListener("resize", handleResize);

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === containerRef.current) st.kill();
      });
      renderer.dispose();
      if (canvasRef.current?.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100vh", backgroundColor: "#F5E6D3" }}
      >
        <div ref={canvasRef} className="absolute inset-0 z-20" 
          style={{ width: "100%", height: "100%" }}
        />

        <div className="absolute inset-0 z-10 pointer-events-none hidden md:flex">
          <div ref={innerRef} className="relative max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 w-full">
            <div id="brand-panel" className="absolute top-[120px] w-[420px] text-right opacity-0">
              <div className="relative min-h-[420px]">
                {/* Brand 1 */}
                <div id="brand-1" className="absolute inset-0 flex flex-col items-end text-right">
                  <img src="/src/assets/brand/brand-1.png" alt="" className="w-72 h-auto mb-10" />
                  <div className="space-y-3">
                    <h2 className="text-[2.75rem] font-light tracking-tight leading-tight text-[#0A1628]">Crafted for Creators</h2>
                    <p className="mt-2 text-lg text-[#0A1628]/65 max-w-sm">A studio-grade camera experience.</p>
                  </div>
                </div>
                {/* Brand 2 */}
                <div id="brand-2" className="absolute inset-0 flex flex-col items-end text-right opacity-0">
                  <img src="/src/assets/brand/brand-2.png" alt="" className="w-72 h-auto mb-10" />
                  <div className="space-y-3">
                    <h2 className="text-[2.75rem] font-light tracking-tight leading-tight text-[#0A1628]">Precision Engineering</h2>
                    <p className="mt-2 text-lg text-[#0A1628]/65 max-w-sm">Designed to capture every detail.</p>
                  </div>
                </div>
                {/* Brand 3 */}
                <div id="brand-3" className="absolute inset-0 flex flex-col items-end text-right opacity-0">
                  <img src="/src/assets/brand/brand-3.png" alt="" className="w-72 h-auto mb-10" />
                  <div className="space-y-3">
                    <h2 className="text-[2.75rem] font-light tracking-tight leading-tight text-[#0A1628]">Built to Inspire</h2>
                    <p className="mt-2 text-lg text-[#0A1628]/65 max-w-sm">Where creativity meets performance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isLoaded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0A1628] text-white">
            Loading Camera Experience
          </div>
        )}
      </div>
    </>
  );
}