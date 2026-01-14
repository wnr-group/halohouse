import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
// Import asset using Vite alias or relative path
import cameraImg from "@/assets/camera.png";

gsap.registerPlugin(ScrollTrigger);

export function CameraScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // --- SETUP CONTEXT & SCENE ---
    const ctx = gsap.context(() => { }, containerRef);
    const scene = new THREE.Scene();

    // Camera: Start closer (z=5)
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100 // Far clipping plane
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    // Group for the 3D Object (Rotations applied here)
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    // Initial State
    cameraGroup.scale.set(1, 1, 1);
    cameraGroup.rotation.set(0, 0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const spotLight = new THREE.SpotLight(0xFDB913, 1.5);
    spotLight.position.set(10, 10, 10);
    scene.add(spotLight);

    // --- ANIMATION TIMELINE (Created Immediately) ---
    // This ensures pinning works even if texture takes time to load
    ctx.add(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", // Longer scroll distance for 5 phases
          scrub: 1, // Smooth interaction
          pin: true,
          anticipatePin: 1,
        }
      });

      // STAGE 1: Reveal & Zoom OUT 
      // Camera pulls back from 5 -> 9
      tl.to(camera.position, {
        z: 9,
        ease: "power1.inOut",
        duration: 2
      }, "stage1")
        // Rotate object slightly
        .to(cameraGroup.rotation, {
          x: 0.2,
          y: -0.3,
          ease: "power1.inOut",
          duration: 2
        }, "stage1");

      // STAGE 2: 3D Rotation & Parallax
      // Strong rotation to show it's a 3D plane/object
      tl.to(cameraGroup.rotation, {
        x: -0.3,
        y: 0.8,
        z: 0.1,
        ease: "power1.inOut",
        duration: 3
      }, "stage2")
        .to(camera.position, {
          y: 0.5, // Parallax shift
          ease: "none",
          duration: 3
        }, "stage2");

      // STAGE 3: Zoom IN (Cinematic)
      // Camera pushes in close (z=3.5)
      tl.to(camera.position, {
        z: 3.5,
        y: 0,
        ease: "power2.inOut",
        duration: 2
      }, "stage3")
        .to(cameraGroup.rotation, {
          x: 0,
          y: 0,
          z: 0.05,
          ease: "back.out(0.8)",
          duration: 2
        }, "stage3");

      // STAGE 4: Exit (Scale out slightly)
      tl.to(cameraGroup.scale, {
        x: 1.15,
        y: 1.15,
        duration: 1
      }, "stage4");
    });

    // --- LOAD TEXTURE ASYNC ---
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.MeshBasicMaterial | null = null;
    let mesh: THREE.Mesh | null = null;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      cameraImg,
      (texture) => {
        const imageAspect = texture.image.width / texture.image.height;
        const width = 4;
        const height = width / imageAspect;

        geometry = new THREE.PlaneGeometry(width, height);
        material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        mesh = new THREE.Mesh(geometry, material);

        cameraGroup.add(mesh);
        setIsLoaded(true);
      },
      undefined,
      (err) => console.error("Texture Load Error:", err)
    );

    // --- RESIZE ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- LOOP ---
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // --- CLEANUP ---
    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);

      if (geometry) geometry.dispose();
      if (material) {
        material.map?.dispose();
        material.dispose();
      }
      renderer.dispose();

      if (canvasRef.current && renderer.domElement) {
        if (canvasRef.current.contains(renderer.domElement)) {
          canvasRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        height: "100vh",
        backgroundColor: "#0A1628",
        opacity: 1
      }}
    >
      <div
        ref={canvasRef}
        className="absolute inset-0 z-10"
        style={{ pointerEvents: "none" }}
      />

      {/* Fallback / Loading Indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white/20 text-sm tracking-widest uppercase">
            Loading Experience...
          </div>
        </div>
      )}

      {/* Cinematic Overlays (Glows) */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(253, 185, 19, 0.12) 0%, rgba(10, 22, 40, 0) 70%)",
        }}
      />
    </div>
  );
}
