import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Import the model so Vite can handle it properly
import cameraModelUrl from "../assets/models/canon_at-1_retro_camera.glb?url";

gsap.registerPlugin(ScrollTrigger);

export function CameraScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mobileTlRef = useRef<gsap.core.Timeline | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

type DeviceMode = "mobile-portrait" | "tablet-landscape" | "desktop";
const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");



useLayoutEffect(() => {
  const detectDevice = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (w < 768 && h > w) {
      setDeviceMode("mobile-portrait");
    } else if (w < 1024) {
      setDeviceMode("tablet-landscape");
    } else {
      setDeviceMode("desktop");
    }
  };

  detectDevice(); // on page load
  window.addEventListener("resize", detectDevice);

  return () => window.removeEventListener("resize", detectDevice);
}, []);

  useLayoutEffect(() => {
  const enableCameraAnimation = deviceMode !== "mobile-portrait";

  const enableMobileBrandAnimation = deviceMode === "mobile-portrait";


const isMobilePortrait = deviceMode === "mobile-portrait";




    if (!containerRef.current || !canvasRef.current) return;

     mobileTlRef.current?.kill();
     mobileTlRef.current = null;



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
   
    camera.position.set(0, 5, 80); // Offset camera slightly up to center the model view


    if (!containerRef.current || !canvasRef.current) return;

// ⛔ prevent duplicate WebGL contexts
canvasRef.current.innerHTML = "";

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
      cameraModelUrl,
      (gltf) => {
        model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

     model.position.set(0, 0, 0);
modelGroup.rotation.set(0.1, -0.3, 0);

if (isMobilePortrait) {
  // STATIC PRODUCT SHOT (MOBILE FIX)
  camera.fov = 30;
  camera.updateProjectionMatrix();

  
  model.scale.set(175, 175, 175);
  // center the model
  modelGroup.position.set(0, 0, 0);

  // center camera vertically
  camera.position.set(0, 4.5, 95);
} else {
  // TABLET + DESKTOP (your original behavior)
  model.scale.set(250, 250, 250);
  modelGroup.position.set(-20, -5, 0);
  camera.position.set(0, 5, 80);
}

        modelGroup.add(model);
        setIsLoaded(true);

        gsap.set(renderer.domElement, { opacity: 1 });

      



        let tl: gsap.core.Timeline | null = null;

        // --- GSAP TIMELINE ---
        if (enableCameraAnimation) {
         tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=500%",
            scrub: 1.5,
            pin: !isMobilePortrait,
            pinSpacing: true,
            anticipatePin: 1,
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

        // 3D CAMERA ANIMATION - Keep camera centered and on the left side
        if(!isMobilePortrait){
        tl.to(model.scale, { x: 220, y: 220, z: 220, duration: 2, ease: "power2.inOut" }, "stage1")
          .to(modelGroup.rotation, { y: Math.PI * 0.5, duration: 2, ease: "power2.inOut" }, "stage1")
          .to(modelGroup.position, { x: -20, y: -5, z: 0, duration: 2, ease: "power2.inOut" }, "stage1");

        tl.to(modelGroup.rotation, { x: 0.3, y: Math.PI * 1.2, duration: 3, ease: "power1.inOut" }, "stage2")
          .to(modelGroup.position, { x: -18, y: -5, z: 0, duration: 3, ease: "power1.inOut" }, "stage2");

        tl.to(model.scale, { x: 350, y: 350, z: 350, duration: 2.5, ease: "power3.inOut" }, "stage3")
          .to(modelGroup.position, { x: 0, y: -5, z: 30, duration: 2.5, ease: "power3.inOut" }, "stage3")
          .to(modelGroup.rotation, { x: 0, y: 0, z: 0, duration: 2.5, ease: "power3.inOut" }, "stage3");

        tl.to(modelGroup.position, { z: -100, duration: 1, ease: "power3.in" }, "stage4")
          .to(renderer.domElement, { opacity: 0, duration: 1 }, "stage4");
        }
        
      }


     


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


    if (deviceMode === "mobile-portrait") {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      gsap.set(
        [".mobile-brand-1", ".mobile-brand-2", ".mobile-brand-3"],
        { opacity: 0, y: 40 }
      );

      gsap.set(".mobile-brand-1", { opacity: 1, y: 0 });

      mobileTlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: ".mobile-brand-section",
          start: "top top",
          end: "+=300%",
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      })
        .to(".mobile-brand-1", { opacity: 0, y: -40 })
        .to(".mobile-brand-2", { opacity: 1, y: 0 })
        .to(".mobile-brand-2", { opacity: 0, y: -40 })
        .to(".mobile-brand-3", { opacity: 1, y: 0 });

      ScrollTrigger.refresh(true);
      window.scrollTo(0, 0);
    });
  });
}

    return () => {
      
      cancelAnimationFrame(reqId);

       
    ScrollTrigger.getAll().forEach(st => st.kill());
    mobileTlRef.current?.kill();
mobileTlRef.current = null;

    
      renderer.dispose();
       canvasRef.current?.replaceChildren();
    };

    
  }, []);

  return (
    <>
      
      <div
  ref={containerRef}
  className="relative w-full overflow-hidden"
  style={{
    height: deviceMode === "mobile-portrait" ? "100vh" : "100vh",
    backgroundColor: "#F5E6D3",
  }}
>
  <div
    ref={canvasRef}
    className="absolute inset-0 z-20"
    style={{ width: "100%", height: "100%" }}
  />
       
   {deviceMode !== "mobile-portrait" && (
  <div className="absolute inset-0 z-10 pointer-events-none flex items-center">


          <div ref={innerRef} className="relative max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 w-full h-full flex items-center">
            <div id="brand-panel" className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 w-[500px] text-right opacity-0">
              <div className="relative min-h-[500px] flex flex-col justify-center">
                {/* Brand 1 */}
                <div id="brand-1" className="absolute inset-0 flex flex-col items-end justify-center text-right">
                  <img src="/src/assets/brand/brand-1.png" alt="" className="w-96 h-auto mb-8 rounded-2xl shadow-xl" />
                  <div className="space-y-4">
                    <h2 className="text-[3.25rem] font-light tracking-tight leading-tight text-[#0A1628]">Crafted for Creators</h2>
                    <p className="mt-2 text-xl text-[#0A1628]/65 max-w-md ml-auto">A studio-grade camera experience.</p>
                  </div>
                </div>
                {/* Brand 2 */}
                <div id="brand-2" className="absolute inset-0 flex flex-col items-end justify-center text-right opacity-0">
                  <img src="/src/assets/brand/brand-2.png" alt="" className="w-96 h-auto mb-8 rounded-2xl shadow-xl" />
                  <div className="space-y-4">
                    <h2 className="text-[3.25rem] font-light tracking-tight leading-tight text-[#0A1628]">Precision Engineering</h2>
                    <p className="mt-2 text-xl text-[#0A1628]/65 max-w-md ml-auto">Designed to capture every detail.</p>
                  </div>
                </div>
                {/* Brand 3 */}
                <div id="brand-3" className="absolute inset-0 flex flex-col items-end justify-center text-right opacity-0">
                  <img src="/src/assets/brand/brand-3.png" alt="" className="w-96 h-auto mb-8 rounded-2xl shadow-xl" />
                  <div className="space-y-4">
                    <h2 className="text-[3.25rem] font-light tracking-tight leading-tight text-[#0A1628]">Built to Inspire</h2>
                    <p className="mt-2 text-xl text-[#0A1628]/65 max-w-md ml-auto">Where creativity meets performance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
   )}   

        {!isLoaded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0A1628] text-white">
            Loading Camera Experience
          </div>
        )}
      </div>

{deviceMode === "mobile-portrait" && (
  <section className="mobile-brand-section relative w-full h-screen bg-[#F5E6D3] overflow-hidden">

    <div className="relative h-screen max-w-[600px] mx-auto px-4 flex items-center justify-center">

      {/* Brand 1 */}
      <div className="mobile-brand-1 absolute inset-0 flex flex-col items-center justify-center text-center opacity-0">
        <img
          src="/src/assets/brand/brand-1.png"
          className="w-full max-w-xs mb-6 rounded-xl shadow-lg"
          alt=""
        />
        <h2 className="text-3xl font-light text-[#0A1628]">
          Crafted for Creators
        </h2>
        <p className="mt-3 text-lg text-[#0A1628]/65">
          A studio-grade camera experience.
        </p>
      </div>

      {/* Brand 2 */}
      <div className="mobile-brand-2 absolute inset-0 flex flex-col items-center justify-center text-center opacity-0">
        <img
          src="/src/assets/brand/brand-2.png"
          className="w-full max-w-xs mb-6 rounded-xl shadow-lg"
          alt=""
        />
        <h2 className="text-3xl font-light text-[#0A1628]">
          Precision Engineering
        </h2>
        <p className="mt-3 text-lg text-[#0A1628]/65">
          Designed to capture every detail.
        </p>
      </div>

      {/* Brand 3 */}
      <div className="mobile-brand-3 absolute inset-0 flex flex-col items-center justify-center text-center opacity-0">
        <img
          src="/src/assets/brand/brand-3.png"
          className="w-full max-w-xs mb-6 rounded-xl shadow-lg"
          alt=""
        />
        <h2 className="text-3xl font-light text-[#0A1628]">
          Built to Inspire
        </h2>
        <p className="mt-3 text-lg text-[#0A1628]/65">
          Where creativity meets performance.
        </p>
      </div>

    </div>
  </section>
)}

     
    </>
  );
}