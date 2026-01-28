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
}

const CONNECTION_DISTANCE = 15; // percentage of screen

export const MolecularAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [particles] = useState<Particle[]>(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    }))
  );
  const rippleIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
      setScrollProgress(progress);
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: rippleIdRef.current++, x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  }, []);

  // Calculate particle positions with mouse offset
  const particlePositions = useMemo(() => {
    return particles.map((particle) => ({
      ...particle,
      currentX: particle.x + (mousePos.x - 0.5) * 20 * particle.speedX,
      currentY: particle.y + (mousePos.y - 0.5) * 20 * particle.speedY,
    }));
  }, [particles, mousePos]);

  // Calculate connections between nearby particles
  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
    
    for (let i = 0; i < particlePositions.length; i++) {
      for (let j = i + 1; j < particlePositions.length; j++) {
        const p1 = particlePositions[i];
        const p2 = particlePositions[j];
        const dx = p1.currentX - p2.currentX;
        const dy = p1.currentY - p2.currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < CONNECTION_DISTANCE) {
          const opacity = 1 - distance / CONNECTION_DISTANCE;
          lines.push({
            x1: p1.currentX,
            y1: p1.currentY,
            x2: p2.currentX,
            y2: p2.currentY,
            opacity: opacity * 0.3,
          });
        }
      }
    }
    return lines;
  }, [particlePositions]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden bg-black"
      onClick={handleClick}
    >
      {/* Connection lines between particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((conn, i) => (
          <line
            key={i}
            x1={`${conn.x1}%`}
            y1={`${conn.y1}%`}
            x2={`${conn.x2}%`}
            y2={`${conn.y2}%`}
            stroke={`rgba(255, 255, 255, ${conn.opacity})`}
            strokeWidth="1"
            className="transition-opacity duration-300"
          />
        ))}
      </svg>

      {/* Floating particles that respond to mouse */}
      {particlePositions.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none transition-transform duration-700 ease-out"
          style={{
            left: `${particle.currentX}%`,
            top: `${particle.currentY}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `rgba(255, 255, 255, ${0.2 + particle.size * 0.08})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.3)`,
          }}
        />
      ))}

      {/* Ripple effects on click */}
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
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)",
            }}
          />
        </div>
      ))}


      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};