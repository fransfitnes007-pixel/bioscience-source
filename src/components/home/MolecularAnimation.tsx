import { useEffect, useRef, useState } from "react";

export const MolecularAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x: x * 20, y: y * 20 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central molecular structure */}
      <svg
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`,
          transition: "transform 0.3s ease-out",
        }}
        viewBox="0 0 400 400"
      >
        {/* Orbit rings */}
        <circle
          cx="200"
          cy="200"
          r="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-foreground animate-line-draw"
          style={{ strokeDasharray: 1000, opacity: 0.3 }}
        />
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-foreground"
          style={{ opacity: 0.2 }}
        />
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-foreground"
          style={{ opacity: 0.15 }}
        />

        {/* Molecular nodes */}
        <g className="animate-fade-in">
          <circle cx="200" cy="200" r="6" fill="currentColor" className="text-foreground" style={{ opacity: 0.8 }} />
          <circle cx="280" cy="200" r="4" fill="currentColor" className="text-foreground" style={{ opacity: 0.6 }} />
          <circle cx="120" cy="200" r="4" fill="currentColor" className="text-foreground" style={{ opacity: 0.6 }} />
          <circle cx="200" cy="120" r="4" fill="currentColor" className="text-foreground" style={{ opacity: 0.6 }} />
          <circle cx="200" cy="280" r="4" fill="currentColor" className="text-foreground" style={{ opacity: 0.6 }} />
          <circle cx="250" cy="140" r="3" fill="currentColor" className="text-foreground" style={{ opacity: 0.4 }} />
          <circle cx="150" cy="260" r="3" fill="currentColor" className="text-foreground" style={{ opacity: 0.4 }} />
          <circle cx="260" cy="260" r="3" fill="currentColor" className="text-foreground" style={{ opacity: 0.4 }} />
          <circle cx="140" cy="140" r="3" fill="currentColor" className="text-foreground" style={{ opacity: 0.4 }} />
        </g>

        {/* Connecting lines */}
        <g className="text-foreground" style={{ opacity: 0.2 }}>
          <line x1="200" y1="200" x2="280" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <line x1="200" y1="200" x2="120" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <line x1="200" y1="200" x2="200" y2="120" stroke="currentColor" strokeWidth="0.5" />
          <line x1="200" y1="200" x2="200" y2="280" stroke="currentColor" strokeWidth="0.5" />
          <line x1="200" y1="200" x2="250" y2="140" stroke="currentColor" strokeWidth="0.5" />
          <line x1="200" y1="200" x2="150" y2="260" stroke="currentColor" strokeWidth="0.5" />
          <line x1="200" y1="200" x2="260" y2="260" stroke="currentColor" strokeWidth="0.5" />
          <line x1="200" y1="200" x2="140" y2="140" stroke="currentColor" strokeWidth="0.5" />
        </g>
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground/20 particle"
            style={{
              left: `${15 + (i * 7) % 70}%`,
              top: `${20 + (i * 11) % 60}%`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
