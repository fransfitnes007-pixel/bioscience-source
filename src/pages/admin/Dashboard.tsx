import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Mail, ArrowRight, Users } from "lucide-react";
import { format } from "date-fns";

interface Stats {
  pendingApplications: number;
  newInquiries: number;
  newMessages: number;
  totalApproved: number;
}

interface RecentItem {
  id: string;
  type: "application" | "inquiry" | "message";
  title: string;
  subtitle: string;
  status: string;
  date: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    pendingApplications: 0,
    newInquiries: 0,
    newMessages: 0,
    totalApproved: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const [
          { count: pendingApps },
          { count: newInq },
          { count: newMsg },
          { count: approvedApps },
        ] = await Promise.all([
          supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "approved"),
        ]);

        setStats({
          pendingApplications: pendingApps || 0,
          newInquiries: newInq || 0,
          newMessages: newMsg || 0,
          totalApproved: approvedApps || 0,
        });

        // Fetch recent items
        const [
          { data: recentApps },
          { data: recentInquiries },
          { data: recentMessages },
        ] = await Promise.all([
          supabase
            .from("applications")
            .select("id, business_name, contact_name, status, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("inquiries")
            .select("id, business_name, name, product_name, status, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("contact_messages")
            .select("id, name, email, subject, status, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
        ]);

        const items: RecentItem[] = [];

        recentApps?.forEach((app) => {
          items.push({
            id: app.id,
            type: "application",
            title: app.business_name,
            subtitle: app.contact_name,
            status: app.status,
            date: app.created_at,
          });
        });

        recentInquiries?.forEach((inq) => {
          items.push({
            id: inq.id,
            type: "inquiry",
            title: inq.product_name,
            subtitle: `${inq.name} - ${inq.business_name}`,
            status: inq.status,
            date: inq.created_at,
          });
        });

        recentMessages?.forEach((msg) => {
          items.push({
            id: msg.id,
            type: "message",
            title: msg.subject || "No Subject",
            subtitle: `${msg.name} (${msg.email})`,
            status: msg.status,
            date: msg.created_at,
          });
        });

        // Sort by date
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
    switch (type) {
      case "application":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "inquiry":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "message":
        return <Mail className="h-4 w-4 text-green-500" />;
    }
  };

  const getTypeRoute = (type: RecentItem["type"]) => {
    switch (type) {
      case "application":
        return "/admin/applications";
      case "inquiry":
        return "/admin/inquiries";
      case "message":
        return "/admin/messages";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of applications, inquiries, and messages
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Pending Applications"
            value={stats.pendingApplications}
            icon={FileText}
            description="Awaiting review"
          />
          <StatsCard
            title="New Inquiries"
            value={stats.newInquiries}
            icon={MessageSquare}
            description="Require attention"
          />
          <StatsCard
            title="Unread Messages"
            value={stats.newMessages}
            icon={Mail}
            description="Need response"
          />
          <StatsCard
            title="Approved Partners"
            value={stats.totalApproved}
            icon={Users}
            description="Total approved"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate("/admin/applications")}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">View Applications</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingApplications} pending
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate("/admin/inquiries")}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">View Inquiries</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.newInquiries} new
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate("/admin/messages")}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">View Messages</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.newMessages} unread
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : recentItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div>
            ) : (
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => navigate(getTypeRoute(item.type))}
                  >
                    <div className="flex items-center gap-4">
                      {getTypeIcon(item.type)}
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={item.status} />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(item.date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
