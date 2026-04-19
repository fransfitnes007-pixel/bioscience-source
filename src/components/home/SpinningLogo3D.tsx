import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import heroLogo from "@/assets/resurrected-logo-hero.png";

interface LogoMeshProps {
  src: string;
  /** Maximum plane dimension in three.js units (the larger of width/height) */
  size?: number;
  speed?: number;
}

const LogoMesh = ({ src, size = 3, speed = 0.6 }: LogoMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, src);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed;
    }
  });

  // Fit plane to texture aspect so the whole logo is always visible
  const img = texture.image as HTMLImageElement | undefined;
  const aspect = img && img.width && img.height ? img.width / img.height : 1;
  const width = aspect >= 1 ? size : size * aspect;
  const height = aspect >= 1 ? size / aspect : size;

  return (
    <group ref={meshRef}>
      {/* Front face */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>
      {/* Back face — mirrored so logo reads correctly (not reversed) from behind */}
      <mesh position={[0, 0, -0.001]} rotation={[0, Math.PI, 0]} scale={[-1, 1, 1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

interface SpinningLogo3DProps {
  className?: string;
  src?: string;
  size?: number;
  speed?: number;
  /** Camera distance — increase to ensure the full plane fits in view */
  cameraZ?: number;
}

export const SpinningLogo3D = ({
  className = "",
  src = heroLogo,
  size = 3,
  speed = 0.6,
  cameraZ = 4.2,
}: SpinningLogo3DProps) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <LogoMesh src={src} size={size} speed={speed} />
        </Suspense>
      </Canvas>
    </div>
  );
};
