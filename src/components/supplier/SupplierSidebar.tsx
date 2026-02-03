import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, MessageSquare, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/point-logo-white.png";

const navItems = [
  { href: "/supplier", label: "Dashboard", icon: LayoutDashboard },
  { href: "/supplier/orders", label: "Orders", icon: Package },
  { href: "/supplier/messages", label: "Messages", icon: MessageSquare },
];

export const SupplierSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/access");
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/supplier" className="flex items-center gap-2">
          <img src={logo} alt="Point Bio" className="h-8" />
          <span className="text-sm text-muted-foreground">Supplier Portal</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};
