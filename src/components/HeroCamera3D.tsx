import { useLayoutEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

function CameraModel() {
    const { scene } = useGLTF("/src/assets/models/canon_at-1_retro_camera.glb");

    useLayoutEffect(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        scene.position.sub(center);
        scene.position.y += 0.2;

        const maxDim = Math.max(size.x, size.y, size.z);
        scene.scale.setScalar(1.8 / maxDim); // Reduced scale for better containment
    }, [scene]);

    scene.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return <primitive object={scene} />;
}

function CameraAnimation() {
    const { camera } = useThree();

    useLayoutEffect(() => {
        camera.position.set(5, 3, 7); // Pulled further back for better initial framing
        camera.rotation.set(0.18, 0.7, 0);
        camera.lookAt(0, 0, 0);

        const tl = gsap.timeline({ delay: 0.2 });

        tl.to(camera.position, {
            x: 1.5,
            y: 0.8,
            z: 7.5, // Increased Z to pull back
            duration: 1.6,
            ease: "power3.out",
        })
            .to(
                camera.rotation,
                {
                    x: -0.1,
                    y: 0.3,
                    duration: 1.6,
                    ease: "power3.out",
                },
                "<"
            )
            .to(camera.position, {
                z: 8.5, // Pull back further on secondary move
                duration: 0.9,
                ease: "power2.out",
            });

        return () => {
            tl.kill();
        };
    }, [camera]);

    return null;
}


export function HeroCamera3D() {
    return (
        <div
            className="w-full relative overflow-hidden z-0"
            style={{ height: '700px' }}
        >
            <Canvas
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                camera={{ fov: 18, near: 0.1, far: 50, }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <directionalLight position={[-5, -3, 2]} intensity={1.5} />

                <Environment preset="studio" />

             

                <Suspense fallback={null}>
                    <CameraModel />
                    <CameraAnimation />
                </Suspense>
            </Canvas>
        </div>
    );
}

useGLTF.preload("/src/assets/models/canon_at-1_retro_camera.glb");
