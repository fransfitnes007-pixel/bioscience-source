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
    const mod = ((spinRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    if (meshRef.current) {
      meshRef.current.rotation.y = mod;
    }

    if (innerRef.current) {
      // Mirror only while the plane's back face is visible so the readable
      // front artwork appears continuous through the full rotation.
      innerRef.current.scale.x = mod > Math.PI / 2 && mod < Math.PI * 1.5 ? -1 : 1;
    }
  });

  // Fit plane to texture aspect so the whole logo is always visible
  const img = texture.image as HTMLImageElement | undefined;
  const aspect = img && img.width && img.height ? img.width / img.height : 1;
  const width = aspect >= 1 ? size : size * aspect;
  const height = aspect >= 1 ? size / aspect : size;

  return (
    <group ref={meshRef}>
      <group ref={innerRef}>
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            map={texture}
            transparent
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>
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
  const shouldUseStaticLogo = typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

  if (shouldUseStaticLogo) {
    return <img src={src} alt="" aria-hidden="true" className={`${className} object-contain`} loading="eager" />;
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        style={{ background: "transparent", display: "block", width: "100%", height: "100%" }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <Suspense fallback={null}>
          <LogoMesh src={src} size={size} speed={speed} />
        </Suspense>
      </Canvas>
    </div>
  );
};
