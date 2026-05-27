import { useState } from "react";
import { cn } from "@/lib/utils";
import CreatorSidebar from "./CreatorSidebar";
import CreatorAuthGuard from "./CreatorAuthGuard";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  children: React.ReactNode;
}

const CreatorLayout = ({ children }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <CreatorAuthGuard>
      <div className="min-h-screen bg-background">
        <CreatorSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main
          className={cn(
            "min-h-screen transition-all duration-300",
            isMobile ? "ml-0 pt-16" : isCollapsed ? "ml-16" : "ml-64"
          )}
        >
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </CreatorAuthGuard>
  );
};

export default CreatorLayout;
