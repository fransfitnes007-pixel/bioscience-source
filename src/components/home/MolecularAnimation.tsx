import { useEffect, useRef, useState, useCallback, useMemo } from "react";


interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface OrbitDot {
  id: number;
  angle: number;
  radius: number;
  size: number;
  speed: number;
  delay: number;
}

const CONNECTION_DISTANCE = 18;

export const MolecularAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  // Fewer, subtler background particles
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.3 + 0.05,
    }))
  );

  // Orbiting dots around the vial
  const orbitDots = useMemo<OrbitDot[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (360 / 8) * i,
        radius: 140 + Math.random() * 60,
        size: Math.random() * 3 + 2,
        speed: 20 + Math.random() * 15,
        delay: i * 0.8,
      })),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    const handleScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min(window.scrollY / docH, 1) : 0);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newRipple = {
      id: rippleIdRef.current++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 1000);
  }, []);

  // Particle positions with mouse parallax
  const particlePositions = useMemo(
    () =>
      particles.map((p) => ({
        ...p,
        currentX: p.x + (mousePos.x - 0.5) * 15 * p.speedX,
        currentY: p.y + (mousePos.y - 0.5) * 15 * p.speedY,
      })),
    [particles, mousePos]
  );

  // Connections
  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
    for (let i = 0; i < particlePositions.length; i++) {
      for (let j = i + 1; j < particlePositions.length; j++) {
        const dx = particlePositions[i].currentX - particlePositions[j].currentX;
        const dy = particlePositions[i].currentY - particlePositions[j].currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          lines.push({
            x1: particlePositions[i].currentX,
            y1: particlePositions[i].currentY,
            x2: particlePositions[j].currentX,
            y2: particlePositions[j].currentY,
            opacity: (1 - dist / CONNECTION_DISTANCE) * 0.15,
          });
        }
      }
    }
    return lines;
  }, [particlePositions]);

  // 3D tilt values driven by mouse
  const tiltX = (mousePos.y - 0.5) * -12;
  const tiltY = (mousePos.x - 0.5) * 12;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-background"
      onClick={handleClick}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground) / 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((conn, i) => (
          <line
            key={i}
            x1={`${conn.x1}%`}
            y1={`${conn.y1}%`}
            x2={`${conn.x2}%`}
            y2={`${conn.y2}%`}
            stroke={`hsl(var(--foreground) / ${conn.opacity})`}
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Background particles */}
      {particlePositions.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.currentX}%`,
            top: `${p.currentY}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `hsl(var(--foreground) / ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px hsl(var(--foreground) / ${p.opacity * 0.5})`,
            transition: "left 0.8s ease-out, top 0.8s ease-out",
          }}
        />
      ))}


      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none animate-[ripple_1s_ease-out_forwards]"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--foreground) / 0.3) 0%, transparent 70%)",
            }}
          />
        </div>
      ))}

      {/* Bottom gradient fade into content */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};
