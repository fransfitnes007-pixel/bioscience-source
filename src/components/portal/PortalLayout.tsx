import { useState } from "react";
import { cn } from "@/lib/utils";
import PortalSidebar from "./PortalSidebar";
import ClientAuthGuard from "./ClientAuthGuard";
import { useIsMobile } from "@/hooks/use-mobile";

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <ClientAuthGuard>
      <div className="min-h-screen bg-background">
        <PortalSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main
          className={cn(
            "min-h-screen transition-all duration-300",
            isMobile ? "ml-0 pt-16" : (isSidebarCollapsed ? "ml-16" : "ml-64")
          )}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ClientAuthGuard>
  );
};

export default PortalLayout;
