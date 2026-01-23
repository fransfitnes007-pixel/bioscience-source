import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminSidebar from "./AdminSidebar";
import AdminAuthGuard from "./AdminAuthGuard";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-background">
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main
          className={cn(
            "min-h-screen transition-all duration-300",
            isSidebarCollapsed ? "ml-16" : "ml-64"
          )}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminLayout;
