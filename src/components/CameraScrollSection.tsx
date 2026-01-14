import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import cameraModel from "@/assets/models/canon_at-1_retro_camera.glb";


gsap.registerPlugin(ScrollTrigger);

export function CameraScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // --- SETUP CONTEXT & SCENE ---
    const ctx = gsap.context(() => { }, containerRef);

    // Scene
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("#0A1628"); // Handled by div background for transparency

    // Camera
    const camera = new THREE.PerspectiveCamera(
     45,
     window.innerWidth / window.innerHeight,
     0.1,
     100
    );
    // Start at Stage 1 pos
    camera.position.set(0, 0, 5);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const backLight = new THREE.SpotLight(0xFDB913, 10);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Load Model
    const loader = new GLTFLoader();
    let model: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;

    loader.load(
      cameraModel,
      (gltf) => {
        model = gltf.scene;
        // Center the model in the group
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); // Centering logic
        model.scale.set(5, 5, 5); //  FIX: model is too small
        model.position.set(0, -0.5, 0); // center vertically
        // Initial Scale & Rotation (Stage 1)
        modelGroup.scale.set(0.6, 0.6, 0.6);
        modelGroup.rotation.set(0, 0, 0);

        modelGroup.add(model);
        setIsLoaded(true);

        // --- ANIMATION TIMELINE ---
        // We create this INSIDE load callback so we know model is ready
        ctx.add(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=500%", // Long scroll
              scrub: 1.5,
              pin: true,
              anticipatePin: 1,
            }
          });

          // STAGE 1 -> STAGE 2: Pull Out (Zoom Out + Rotation)
          // Current: Scale 0.6, Z=8
          // Target: Scale 0.45, Y-Rotation
          tl.to(modelGroup.scale, { x: 0.45, y: 0.45, z: 0.45, duration: 2, ease: "power2.inOut" }, "stage1")
            .to(modelGroup.rotation, { y: Math.PI * 0.25, duration: 2, ease: "power2.inOut" }, "stage1")
            .to(camera.position, { z: 10, duration: 2, ease: "power2.inOut" }, "stage1");

          // STAGE 2 -> STAGE 3: Hero Focus (Zoom In + Parallax)
          // Target: Scale 1.2, X+Y Rotation, Camera Close
          tl.to(modelGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 3, ease: "power3.inOut" }, "stage2")
            .to(modelGroup.rotation, { x: 0.2, y: -0.5, duration: 3, ease: "power3.inOut" }, "stage2")
            .to(camera.position, { z: 4, duration: 3, ease: "power3.inOut" }, "stage2");

          // STAGE 4: Exit
          // Rotate away, fade out feel (via scale/pos)
          tl.to(modelGroup.rotation, { y: Math.PI, duration: 2, ease: "power2.in" }, "stage3")
            .to(modelGroup.position, { z: -5, duration: 2, ease: "power2.in" }, "stage3")
            .to(canvasRef.current, { opacity: 0, duration: 1, ease: "none" }, "stage3-=1");
        });

      },
      undefined,
      (err) => console.error("Error loading camera model:", err)
    );

    // Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (mixer) mixer.update(0.016); // If model has animations
      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP
    return () => {
      ctx.revert(); // Kills ScrollTriggers
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);

      // Dispose Three.js
      if (model) {
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.geometry.dispose();
            if (Array.isArray(m.material)) {
              m.material.forEach(mat => mat.dispose());
            } else {
              (m.material as THREE.Material).dispose();
            }
          }
        });
      }
      renderer.dispose();
      if (canvasRef.current && renderer.domElement) {
        // Safe removal check
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
      style={{ height: "100vh", backgroundColor: "#0A1628" }}
    >
      <div ref={canvasRef} className="absolute inset-0 z-10" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white/20 uppercase tracking-widest pointer-events-none">
          Loading 3D Experience...
        </div>
      )}

      {/* Optional Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(253, 185, 19, 0.08) 0%, transparent 60%)"
        }}
      />
    </div>
  );
}
