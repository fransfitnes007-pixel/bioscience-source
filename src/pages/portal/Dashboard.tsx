import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MessageSquare, Clock, DollarSign, Tags, FileImage, Smartphone, ExternalLink } from "lucide-react";
import { APP_SUBSCRIPTION_URL, APP_SUBSCRIPTION_NAME, APP_SUBSCRIPTION_TAGLINE } from "@/lib/app-subscription";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  unreadMessages: number;
  totalSpent: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

const PortalDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [profile, setProfile] = useState<{ first_name: string; business_name: string; company_logo_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, business_name, company_logo_url')
        .eq('user_id', userId)
        .single();

      if (profileData) setProfile(profileData);

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_number, status, total, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const orders = ordersData || [];
      setRecentOrders(orders.slice(0, 5));

      // Fetch unread messages
      const { count: unreadCount } = await supabase
        .from('client_messages')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', userId)
        .eq('sender_type', 'admin')
        .eq('is_read', false);

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
        unreadMessages: unreadCount || 0,
        totalSpent: orders.reduce((sum, o) => sum + Number(o.total), 0),
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'processing': return 'bg-blue-500/10 text-blue-500';
      case 'shipped': return 'bg-purple-500/10 text-purple-500';
      case 'delivered': return 'bg-green-500/10 text-green-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {loading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              `Welcome back, ${profile?.first_name || 'there'}!`
            )}
          </h1>
          <p className="text-muted-foreground">Here's an overview of your account</p>
        </div>

        {/* Resurrected App banner */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-foreground">
                <Smartphone className="h-5 w-5 text-background" />
              </div>
              <div>
                <p className="font-medium text-foreground">{APP_SUBSCRIPTION_NAME}</p>
                <p className="text-sm text-muted-foreground">{APP_SUBSCRIPTION_TAGLINE}</p>
              </div>
            </div>
            <Button
              asChild
              className="shrink-0"
              onClick={async () => {
                try {
                  const { data: { session } } = await supabase.auth.getSession();
                  await supabase.from('analytics_events').insert({
                    event_name: 'app_subscription_activate_click',
                    event_data: { source: 'portal_dashboard_banner', url: APP_SUBSCRIPTION_URL },
                    user_id: session?.user?.id ?? null,
                  });
                } catch (e) {
                  console.warn('Failed to track app activate click', e);
                }
              }}
            >
              <a href={APP_SUBSCRIPTION_URL} target="_blank" rel="noopener noreferrer">
                Activate on the App
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Company Logo Card - if logo exists */}
        {profile?.company_logo_url && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Your Company Logo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border border-border overflow-hidden bg-secondary/30 flex items-center justify-center">
                  {profile.company_logo_url.toLowerCase().endsWith('.pdf') ? (
                    <FileImage className="w-10 h-10 text-muted-foreground" />
                  ) : (
                    <img
                      src={profile.company_logo_url}
                      alt="Company logo"
                      className="w-full h-full object-contain p-2"
                    />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>This logo will be used for custom vial labeling on your orders.</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link to="/portal/profile">Update Logo</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.totalOrders}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.pendingOrders}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.unreadMessages}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{formatCurrency(stats?.totalSpent || 0)}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest orders</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/portal/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="font-medium">{formatCurrency(Number(order.total))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
              <CardDescription>Send us a message and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/portal/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Browse Products</CardTitle>
              <CardDescription>Explore our catalog and place a new order</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link to="/products">
                  <Package className="mr-2 h-4 w-4" />
                  View Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
};

export default PortalDashboard;