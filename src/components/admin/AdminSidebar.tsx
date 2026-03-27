import { NavLink as RouterNavLink, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  FileText,
  FileImage,
  Users,
  MessageSquare,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Truck,
  Tag,
  Store,
  ArrowRightLeft,
  Gift,
  Megaphone,
  TicketPercent,
  DollarSign,
  BarChart3,
  Globe,
  ShoppingBag,
  Music,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import resurrectedLogo from "@/assets/resurrected-logo.png";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navSections = [
  {
    items: [
      { title: "Home", href: "/admin", icon: Home, end: true },
      {
        title: "Orders",
        href: "/admin/orders",
        icon: Package,
        children: [
          { title: "Drafts", href: "/admin/orders/drafts" },
          { title: "Shipping labels", href: "/admin/shipping-labels" },
          { title: "Abandoned checkouts", href: "/admin/abandoned-checkouts" },
        ],
      },
      {
        title: "Products",
        href: "/admin/products",
        icon: Tag,
        children: [
          { title: "Inventory", href: "/admin/inventory" },
          { title: "Transfers", href: "/admin/transfers" },
          { title: "Gift cards", href: "/admin/gift-cards" },
        ],
      },
    ],
  },
  {
    items: [
      {
        title: "Customers",
        href: "/admin/customers",
        icon: Users,
        children: [
          { title: "Segments", href: "/admin/segments" },
        ],
      },
      {
        title: "Discounts",
        href: "/admin/discounts",
        icon: TicketPercent,
      },
      {
        title: "Marketing",
        href: "/admin/marketing",
        icon: Megaphone,
        children: [
          { title: "Campaigns", href: "/admin/marketing/campaigns" },
        ],
      },
      {
        title: "Content",
        href: "/admin/content/files",
        icon: FileImage,
        children: [
          { title: "Files", href: "/admin/content/files" },
          { title: "Menus", href: "/admin/content/menus" },
          { title: "Blog posts", href: "/admin/content/blog" },
        ],
      },
      {
        title: "Finance",
        href: "/admin/finance",
        icon: DollarSign,
        children: [
          { title: "Payouts", href: "/admin/finance/payouts" },
        ],
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        children: [
          { title: "Reports", href: "/admin/analytics/reports" },
          { title: "Live View", href: "/admin/analytics/live" },
        ],
      },
    ],
  },
  {
    items: [
      { title: "Applications", href: "/admin/applications", icon: FileText },
      { title: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
      { title: "Contact Messages", href: "/admin/messages", icon: Mail },
      { title: "Client Messages", href: "/admin/messages-center", icon: MessageSquare },
      { title: "Suppliers", href: "/admin/suppliers", icon: Truck },
    ],
  },
];

const AdminSidebar = ({ isCollapsed, onToggle }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "You have been logged out successfully." });
    navigate("/admin/login");
  };

  const isActive = (href: string, end?: boolean) => {
    if (end) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-[#1a1a1a] transition-all duration-300 flex flex-col",
        isCollapsed ? "w-[56px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-[#333]">
        {!isCollapsed && (
          <img src={resurrectedLogo} alt="Resurrected" className="h-7" />
        )}
        <button
          onClick={onToggle}
          className={cn(
            "p-1.5 rounded hover:bg-[#333] text-[#b5b5b5] transition-colors",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section, si) => (
          <div key={si}>
            {si > 0 && <div className="mx-3 my-2 border-t border-[#333]" />}
            <ul className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const active = isActive(item.href, item.end);
                return (
                  <li key={item.href}>
                    <RouterNavLink
                      to={item.href}
                      end={item.end}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-[#333] text-white"
                          : "text-[#b5b5b5] hover:bg-[#2a2a2a] hover:text-white",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </RouterNavLink>
                    {/* Sub items */}
                    {!isCollapsed && item.children && active && (
                      <ul className="ml-9 mt-0.5 space-y-0.5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <RouterNavLink
                              to={child.href}
                              className={cn(
                                "block px-3 py-1.5 rounded text-sm transition-colors",
                                location.pathname === child.href
                                  ? "text-white"
                                  : "text-[#999] hover:text-white"
                              )}
                            >
                              {child.title}
                            </RouterNavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-[#333] space-y-0.5">
        <RouterNavLink
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#b5b5b5] hover:bg-[#2a2a2a] hover:text-white transition-colors",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Store className="h-[18px] w-[18px] shrink-0" />
          {!isCollapsed && <span>View Store</span>}
        </RouterNavLink>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#b5b5b5] hover:bg-[#2a2a2a] hover:text-red-400 transition-colors w-full",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
