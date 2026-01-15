import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

gsap.registerPlugin(ScrollTrigger);

export function CameraScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      2000 // Increased far plane for huge scale
    );
    camera.position.set(0, 0, 80); // Moved back to fit huge model

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    canvasRef.current.appendChild(renderer.domElement);

    // Group for the Model
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

    // Use absolute string path for reliability
    loader.load(
      "/src/assets/models/canon_at-1_retro_camera.glb",
      (gltf) => {
        model = gltf.scene;

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // --- MASSIVE SCALE (Matching Hero Monster Scale) ---
        model.scale.set(200, 200, 200);
        model.position.set(0, -10, 0);

        // Initial Rotation
        modelGroup.rotation.set(0.1, -0.3, 0);
        modelGroup.add(model);
        setIsLoaded(true);

        // Force opacity in case of previous animate-out
        gsap.set(renderer.domElement, { opacity: 1 });

        // --- GSAP TIMELINE ---
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=500%",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false // Toggle for debugging
          }
        });

        // STAGE 1: Reveal & Rotate
        tl.to(model.scale, { x: 150, y: 150, z: 150, duration: 2, ease: "power2.inOut" }, "stage1")
          .to(modelGroup.rotation, { y: Math.PI * 0.5, duration: 2, ease: "power2.inOut" }, "stage1")
          .to(modelGroup.position, { x: -25, duration: 2, ease: "power2.inOut" }, "stage1");

        // STAGE 2: Top Scan
        tl.to(modelGroup.rotation, { x: 0.6, y: Math.PI * 1.2, duration: 3, ease: "power1.inOut" }, "stage2");

        // STAGE 3: Extreme Macro
        tl.to(model.scale, { x: 300, y: 300, z: 300, duration: 2.5, ease: "power3.inOut" }, "stage3")
          .to(modelGroup.position, { x: 0, y: 0, z: 40, duration: 2.5, ease: "power3.inOut" }, "stage3")
          .to(modelGroup.rotation, { x: 0, y: 0, z: 0, duration: 2.5, ease: "power3.inOut" }, "stage3");

        // STAGE 4: Fly Out
        tl.to(modelGroup.position, { z: -100, duration: 1, ease: "power3.in" }, "stage4")
          .to(renderer.domElement, { opacity: 0, duration: 1 }, "stage4");
      },
      undefined,
      (err) => console.error("Error loading model:", err)
    );

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === containerRef.current) st.kill();
      });
      renderer.dispose();
      renderer.forceContextLoss();
      if (canvasRef.current && renderer.domElement && canvasRef.current.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", backgroundColor: "#0A1628" }}
    >
      <div ref={canvasRef} className="absolute inset-0 z-20" />

      {/* Heavy Loading State for visibility */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-[#0A1628]">
          <span className="text-white/40 text-2xl tracking-[0.3em] font-light animate-pulse uppercase mb-4">
            Loading Camera Experience
          </span>
          <div className="w-48 h-[1px] bg-white/10 overflow-hidden">
            <div className="w-full h-full bg-[#FDB913] animate-[loading_2s_infinite]" style={{ transformOrigin: "left" }} />
          </div>
        </div>
      )}

      {/* Layout Confirmation Text (Fades out when loaded) */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-20' : 'opacity-100'}`}>
        <h2 className="text-white text-[15vw] font-black uppercase tracking-tighter opacity-10"></h2>
      </div>
    </div>
  );
}
