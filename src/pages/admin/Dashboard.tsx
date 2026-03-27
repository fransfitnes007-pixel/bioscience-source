import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { FileText, MessageSquare, Mail, ArrowRight, Users, Package, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface Stats {
  pendingApplications: number;
  newInquiries: number;
  newMessages: number;
  totalApproved: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface RecentItem {
  id: string;
  type: "application" | "inquiry" | "message" | "order";
  title: string;
  subtitle: string;
  status: string;
  date: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    pendingApplications: 0, newInquiries: 0, newMessages: 0,
    totalApproved: 0, pendingOrders: 0, totalRevenue: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { count: pendingApps },
          { count: newInq },
          { count: newMsg },
          { count: approvedApps },
          { count: pendingOrds },
          { data: paidOrders },
        ] = await Promise.all([
          supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "approved"),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("orders").select("total").eq("payment_status", "paid"),
        ]);

        const totalRevenue = paidOrders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
        setStats({
          pendingApplications: pendingApps || 0, newInquiries: newInq || 0,
          newMessages: newMsg || 0, totalApproved: approvedApps || 0,
          pendingOrders: pendingOrds || 0, totalRevenue,
        });

        const [{ data: recentApps }, { data: recentInquiries }, { data: recentMessages }] = await Promise.all([
          supabase.from("applications").select("id, business_name, contact_name, status, created_at").order("created_at", { ascending: false }).limit(3),
          supabase.from("inquiries").select("id, business_name, name, product_name, status, created_at").order("created_at", { ascending: false }).limit(3),
          supabase.from("contact_messages").select("id, name, email, subject, status, created_at").order("created_at", { ascending: false }).limit(3),
        ]);

        const items: RecentItem[] = [];
        recentApps?.forEach(app => items.push({ id: app.id, type: "application", title: app.business_name, subtitle: app.contact_name, status: app.status, date: app.created_at }));
        recentInquiries?.forEach(inq => items.push({ id: inq.id, type: "inquiry", title: inq.product_name, subtitle: `${inq.name} - ${inq.business_name}`, status: inq.status, date: inq.created_at }));
        recentMessages?.forEach(msg => items.push({ id: msg.id, type: "message", title: msg.subject || "No Subject", subtitle: `${msg.name} (${msg.email})`, status: msg.status, date: msg.created_at }));
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentItems(items.slice(0, 8));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTypeIcon = (type: RecentItem["type"]) => {
    const icons = { application: FileText, inquiry: MessageSquare, message: Mail, order: Package };
    const colors = { application: "text-blue-400", inquiry: "text-purple-400", message: "text-green-400", order: "text-orange-400" };
    const Icon = icons[type];
    return <Icon className={`h-4 w-4 ${colors[type]}`} />;
  };

  const getTypeRoute = (type: RecentItem["type"]) => {
    const routes = { application: "/admin/applications", inquiry: "/admin/inquiries", message: "/admin/messages", order: "/admin/orders" };
    return routes[type];
  };

  const getStatusPill = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-900/30 text-yellow-400",
      new: "bg-blue-900/30 text-blue-400",
      approved: "bg-green-900/30 text-green-400",
      denied: "bg-red-900/30 text-red-400",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
        {status}
      </span>
    );
  };

  const statCards = [
    { label: "Pending Orders", value: stats.pendingOrders, icon: Package },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "Pending Applications", value: stats.pendingApplications, icon: FileText },
    { label: "New Inquiries", value: stats.newInquiries, icon: MessageSquare },
    { label: "Unread Messages", value: stats.newMessages, icon: Mail },
    { label: "Approved Partners", value: stats.totalApproved, icon: Users },
  ];

  const quickActions = [
    { label: "Manage Orders", desc: `${stats.pendingOrders} pending`, route: "/admin/orders", icon: Package },
    { label: "View Applications", desc: `${stats.pendingApplications} pending`, route: "/admin/applications", icon: FileText },
    { label: "View Inquiries", desc: `${stats.newInquiries} new`, route: "/admin/inquiries", icon: MessageSquare },
    { label: "View Messages", desc: `${stats.newMessages} unread`, route: "/admin/messages", icon: Mail },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your store</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-foreground">
                  <stat.icon className="h-4 w-4 text-background" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-5 cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate(action.route)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{action.label}</p>
                    <p className="text-sm text-muted-foreground">{action.desc}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : recentItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No recent activity</div>
            ) : (
              <div className="divide-y divide-border">
                {recentItems.map(item => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary cursor-pointer transition-colors"
                    onClick={() => navigate(getTypeRoute(item.type))}
                  >
                    <div className="flex items-center gap-3">
                      {getTypeIcon(item.type)}
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusPill(item.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
