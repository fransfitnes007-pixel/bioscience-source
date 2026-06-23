import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import resurrectedLogo from "@/assets/resurrected-logo.png";

interface PortalSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/portal",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/portal/products",
    icon: ShoppingBag,
  },
  {
    title: "Orders",
    href: "/portal/orders",
    icon: Package,
  },
  {
    title: "Messages",
    href: "/portal/messages",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    href: "/portal/profile",
    icon: User,
  },
];

const PortalSidebar = ({ isCollapsed, onToggle }: PortalSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });
  }, []);

  const unreadCount = useUnreadMessages(userId);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  const NotificationBell = () => (
    <NavLink to="/portal/messages" className="relative">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
    </NavLink>
  );

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        <div className="fixed top-4 right-4 z-50">
          <NotificationBell />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
            <aside
              className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <img src={resurrectedLogo} alt="Resurrected" className="h-8" />
                </div>

                <nav className="flex-1 p-2 space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === "/portal"}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  ))}
                </nav>

                <div className="p-2 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <img src={resurrectedLogo} alt="Resurrected" className="h-8" />
          )}
          <div className={cn("flex items-center gap-1", isCollapsed && "mx-auto")}>
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="shrink-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/portal"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground",
                  isCollapsed && "justify-center px-2"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              isCollapsed && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default PortalSidebar;