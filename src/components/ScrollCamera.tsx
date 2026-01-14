import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollCamera() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    /* -------------------- SCENE SETUP -------------------- */
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true;

    /* -------------------- OBJECT (TEMP CAMERA STAND-IN) -------------------- */
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(2, 48, 48),
      new THREE.MeshStandardMaterial({
        color: "#FDB913",
        metalness: 0.7,
        roughness: 0.25,
      })
    );
    scene.add(mesh);

    /* -------------------- LIGHTS -------------------- */
    scene.add(new THREE.AmbientLight("#ffffff", 0.6));

    const dirLight = new THREE.DirectionalLight("#ffffff", 1);
    dirLight.position.set(5, 6, 8);
    scene.add(dirLight);

    /* -------------------- SCROLL ANIMATION -------------------- */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-camera",     // SECTION 2
        start: "top center",
        end: "bottom center",
        scrub: 1.4,                  // smooth, NOT sticky
      },
    });

    tl.to(camera.position, {
      z: 10,                         // ZOOM IN
      ease: "none",
      duration: 1,
    })
      .to(camera.position, {
        z: 10,                       // HOLD
        ease: "none",
        duration: 0.4,
      })
      .to(camera.position, {
        z: 24,                       // ZOOM OUT → brand slider
        ease: "none",
        duration: 1,
      });

    /* -------------------- RENDER LOOP -------------------- */
    let rafId: number;

    const animate = () => {
      mesh.rotation.y += 0.004;
      mesh.rotation.x += 0.002;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    /* -------------------- RESIZE -------------------- */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);

    /* -------------------- CLEANUP (CRITICAL) -------------------- */
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      ScrollTrigger.getAll().forEach(t => t.kill());
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",   // IMPORTANT: not fixed
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
