import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import resurrectedLogo from "@/assets/resurrected-logo-full.png";

const LogoMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, resurrectedLogo);
  texture.anisotropy = 16;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6;
    }
  });

  // Compute aspect from texture to size plane correctly
  const img = texture.image as HTMLImageElement | undefined;
  const aspect = img && img.width && img.height ? img.width / img.height : 1;
  const height = 3.2;
  const width = height * aspect;

  return (
    <group>
      {/* Soft backlight glow */}
      <pointLight position={[0, 0, -2]} intensity={3} color="#ffffff" distance={10} />
      <pointLight position={[3, 2, 3]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={1.2} color="#ffffff" />
      <ambientLight intensity={0.4} />

      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};

export const SpinningLogo3D = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <LogoMesh />
        </Suspense>
      </Canvas>
    </div>
  );
};
