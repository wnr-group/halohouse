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
  const VIEW_HEIGHT = window.innerHeight - 88;

  useLayoutEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / VIEW_HEIGHT,
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
    renderer.setSize(window.innerWidth, VIEW_HEIGHT);
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
            start: "top top", // ✅ DO NOT OFFSET HERE
            end: "+=500%",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
           
          }
        });

        tl.addLabel("stage1", 0);
        tl.addLabel("stage2", 1.5);
        tl.addLabel("stage3", 3.5);
        tl.addLabel("stage4", 6);
        

        

        // --- BRAND STORY TIMELINE ---
        tl.fromTo(                // brand panel
          "#brand-panel",
          { opacity: 0, y: 20 , scale:0.96 },
          { opacity: 1, y: 0, scale:1, duration: 1, ease: "power2.out" },
          "stage1+=0.6"
        );

        tl.to(
          "#brand-panel",
          {
            x: -20,
            duration: 4.5,
            ease: "none"
          },
          "stage1+=1.2"
        );
       
       // BRAND 1
        tl.fromTo(
          "#brand-1",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 },
          "stage1+=0.8"
        );

        // BRAND 1 OUT → BRAND 2 IN
        tl.to("#brand-1", { opacity: 0, y: -20, duration: 0.8 }, "stage2");
        tl.fromTo(
          "#brand-2",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 },
          "stage2+=0.2"
        );

        // BRAND 2 OUT → BRAND 3 IN
        tl.to("#brand-2", { opacity: 0, y: -20, duration: 0.8 }, "stage3");
        tl.fromTo(
          "#brand-3",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 },
          "stage3+=0.2"
        );

        // PANEL OUT
        tl.to("#brand-panel", { opacity: 0, duration: 0.6 }, "stage4");

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
      const viewHeight = window.innerHeight - 88;
      camera.aspect = window.innerWidth / viewHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, viewHeight);
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
    <>
         {/* Spacer for fixed navbar */}
      <div style={{ height: "88px" }} />

      {/* Pinned camera section */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{
          height: "100vh",
          backgroundColor: "#F5E6D3",
        }}
      >
        {/* WebGL Canvas */}
        <div ref={canvasRef} className="absolute inset-0 z-20" />

        {/* BRAND STORY OVERLAY — SAME AS PREVIOUS VIDEO */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden md:flex items-end justify-end pr-24 pb-40">
          <div
            id="brand-panel"
            className="relative w-[420px] text-right opacity-0"
          >

          <div className="relative min-h-[420px]">
            <div id="brand-1" className="absolute inset-0 flex flex-col items-end text-right">
              <img
                src="/src/assets/brand/brand-1.png"
                alt="Crafted for Creators"
                className="w-72 h-auto object-contain mb-10"
              />

              <div className="space-y-3">
                <h2 className="text-[2.75rem] font-light tracking-tight leading-tight text-[#0A1628]">
                  Crafted for Creators
                </h2>
                <p className="mt-2 text-lg text-[#0A1628]/65 max-w-sm">
                  A studio-grade camera experience.
                </p>
              </div>
            </div>

            <div id="brand-2" className="absolute inset-0 flex flex-col items-end text-right opacity-0">
              <img
                src="/src/assets/brand/brand-2.png"
                alt="Precision Engineering"
                className="w-72 h-auto object-contain mb-10"
              />

              <div className="space-y-3">
                <h2 className="text-[2.75rem] font-light tracking-tight leading-tight text-[#0A1628]">
                  Precision Engineering
                </h2>
                <p className="mt-2 text-lg text-[#0A1628]/65 max-w-sm">
                  Designed to capture every detail.
                </p>
              </div>
            </div>

            <div id="brand-3" className="absolute inset-0 flex flex-col items-end text-right opacity-0">
              <img
                src="/src/assets/brand/brand-3.png"
                alt="Built to Inspire"
                className="w-72 h-auto object-contain mb-10"
              />

              <div className="space-y-3">
                <h2 className="text-[2.75rem] font-light tracking-tight leading-tight text-[#0A1628]">
                  Built to Inspire
                </h2>
                <p className="mt-2 text-lg text-[#0A1628]/65 max-w-sm">
                  Where creativity meets performance.
                </p>
              </div>
            </div>




          </div>
        </div>

{/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0A1628]">
            Loading Camera Experience
          </div>
        )}

     </div>
     </div>
    </>
  );
}
