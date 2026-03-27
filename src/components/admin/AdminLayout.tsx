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
      <div className="admin-theme min-h-screen bg-[#f6f6f7]">
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
          <div className="sticky top-0 z-30 bg-white border-b border-[#e1e3e5] px-6 h-14 flex items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7175]" />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-[#c9cccf] bg-[#f6f6f7] text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#005bd3] focus:border-transparent"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-[#f1f1f1] transition-colors">
              <Bell className="h-5 w-5 text-[#6d7175]" />
            </button>
          </div>
          <div className="p-6 max-w-[1200px] mx-auto">{children}</div>
        </main>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminLayout;
