import { useEffect, useRef, useState } from "react";

export const MolecularAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Color shifts based on scroll: deep blue → purple → warm amber
  const hue = Math.round(220 + scrollProgress * 140); // 220 (blue) → 360 (red/warm)

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden transition-colors duration-700"
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 30%, 3%) 0%, hsl(${hue + 30}, 40%, 6%) 50%, hsl(${hue + 60}, 35%, 4%) 100%)`,
      }}
    >
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
