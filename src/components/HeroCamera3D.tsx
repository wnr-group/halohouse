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

        const maxDim = Math.max(size.x, size.y, size.z);
        scene.scale.setScalar(1 / maxDim);
    }, [scene]);

    scene.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return <primitive object={scene} scale={0.5} />;
}

function CameraAnimation() {
    const { camera } = useThree();

    useLayoutEffect(() => {
        camera.position.set(3.8, 1.9, 6.2);
        camera.rotation.set(0.15, 0.6, 0);
        camera.lookAt(0, 0.8, 0);




        const tl = gsap.timeline({ delay: 0.2 });

        tl.to(camera.position, {
            x: 0.9,
            y: 0.2,
            z: 4.2,
            duration: 1.6,
            ease: "power3.out",
        })
            .to(
                camera.rotation,
                {
                    x: 0,
                    y: 0,
                    duration: 1.6,
                    ease: "power3.out",
                },
                "<"
            )
            .to(camera.position, {
                z: 4.4,
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
        <div className="w-full h-[900px] lg:h-[900px] xl:h-[1200px] relative">
            <Canvas
                camera={{ fov: 55, near: 0.1, far: 200, }}
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
