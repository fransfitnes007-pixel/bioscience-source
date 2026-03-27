import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminSidebar from "./AdminSidebar";
import AdminAuthGuard from "./AdminAuthGuard";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <AdminAuthGuard>
      <div className="admin-theme min-h-screen bg-background">
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main
          className={cn(
            "min-h-screen transition-all duration-300",
            isSidebarCollapsed ? "ml-[56px]" : "ml-[240px]"
          )}
        >
          {/* Top bar */}
          <div className="sticky top-0 z-30 bg-card border-b border-border px-6 h-14 flex items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <div className="p-6 max-w-[1200px] mx-auto">{children}</div>
        </main>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminLayout;
