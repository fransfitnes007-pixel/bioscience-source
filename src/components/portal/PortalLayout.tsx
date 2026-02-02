import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import PortalSidebar from "./PortalSidebar";
import ClientAuthGuard from "./ClientAuthGuard";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePortalNotifications } from "@/hooks/usePortalNotifications";
import { supabase } from "@/integrations/supabase/client";

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Get user ID for notifications
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Enable real-time notifications
  usePortalNotifications(userId);

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
