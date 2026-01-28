import { useEffect, useRef, useState, useCallback } from "react";

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
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  }, []);

  // Color shifts based on scroll: deep blue → purple → warm amber
  const hue = Math.round(220 + scrollProgress * 140);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden transition-colors duration-700"
      onClick={handleClick}
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 30%, 3%) 0%, hsl(${hue + 30}, 40%, 6%) 50%, hsl(${hue + 60}, 35%, 4%) 100%)`,
      }}
    >
      {/* Floating particles that respond to mouse */}
      {particles.map((particle) => {
        const offsetX = (mousePos.x - 0.5) * 20 * particle.speedX;
        const offsetY = (mousePos.y - 0.5) * 20 * particle.speedY;
        return (
          <div
            key={particle.id}
            className="absolute rounded-full pointer-events-none transition-transform duration-700 ease-out"
            style={{
              left: `${particle.x + offsetX}%`,
              top: `${particle.y + offsetY}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `hsla(${hue + particle.id * 5}, 60%, 60%, ${0.15 + particle.size * 0.05})`,
              boxShadow: `0 0 ${particle.size * 2}px hsla(${hue + particle.id * 5}, 60%, 60%, 0.3)`,
            }}
          />
        );
      })}

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
              background: `radial-gradient(circle, hsla(${hue + 30}, 60%, 60%, 0.4) 0%, transparent 70%)`,
            }}
          />
        </div>
      ))}

      {/* Subtle radial glow following mouse with scroll-based color */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, hsla(${hue + 20}, 50%, 50%, 0.04) 0%, transparent 70%)`,
        }}
      />
      
      {/* Secondary softer glow */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, hsla(${hue + 40}, 45%, 45%, 0.03) 0%, transparent 60%)`,
        }}
      />

      {/* Subtle grid pattern with color tint */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsla(${hue}, 50%, 70%, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, hsla(${hue}, 50%, 70%, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};
