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
  const meshRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const spinRef = useRef(0);
  const texture = useLoader(TextureLoader, src);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    spinRef.current += delta * speed;
    if (meshRef.current) {
      // Continuous Y rotation drives the "spin"
      meshRef.current.rotation.y = spinRef.current;
    }
    if (innerRef.current) {
      // Counter-rotate when we're on the back half so the front of the logo
      // always faces the camera. At 180° we instantly flip back to 0°.
      const mod = ((spinRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      innerRef.current.rotation.y = mod >= Math.PI ? Math.PI : 0;
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
      {/* Back face — same orientation as front so the readable logo shows from behind too */}
      <mesh position={[0, 0, -0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          side={THREE.BackSide}
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
