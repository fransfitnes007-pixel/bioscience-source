import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Link as LinkIcon,
  Tag,
  DollarSign,
  Wallet,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Trophy,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import resurrectedLogo from "@/assets/resurrected-logo.png";

interface Props {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { title: "Dashboard", href: "/creator/dashboard", icon: LayoutDashboard },
  { title: "Links", href: "/creator/links", icon: LinkIcon },
  { title: "Codes", href: "/creator/codes", icon: Tag },
  { title: "Earnings", href: "/creator/earnings", icon: DollarSign },
  { title: "Payouts", href: "/creator/payouts", icon: Wallet },
  { title: "Leaderboard", href: "/creator/leaderboard", icon: Trophy },
  { title: "Resources", href: "/creator/resources", icon: ImageIcon },
  { title: "Profile", href: "/creator/profile", icon: User },
];

const CreatorSidebar = ({ isCollapsed, onToggle }: Props) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out" });
    navigate("/");
  };

  const NavList = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          onClick={onClick}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
              "hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              isCollapsed && !isMobile && "justify-center px-2"
            )
          }
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {(!isCollapsed || isMobile) && <span className="font-medium">{item.title}</span>}
        </NavLink>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <>
        <div className="fixed top-4 left-4 z-50">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >
            <aside
              className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center p-4 border-b border-border">
                  <img src={resurrectedLogo} alt="Resurrected" className="h-8" />
                </div>
                <NavList onClick={() => setMobileOpen(false)} />
                <div className="p-2 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
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

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && <img src={resurrectedLogo} alt="Resurrected" className="h-8" />}
          <Button variant="ghost" size="icon" onClick={onToggle} className={cn(isCollapsed && "mx-auto")}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <NavList />
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

export default CreatorSidebar;
