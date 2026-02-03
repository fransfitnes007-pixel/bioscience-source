import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SupplierLayout } from "@/components/supplier/SupplierLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, Truck, CheckCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface DashboardStats {
  totalAssigned: number;
  pendingFulfillment: number;
  shippedToday: number;
  completed: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  item_count: number;
}

const SupplierDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssigned: 0,
    pendingFulfillment: 0,
    shippedToday: 0,
    completed: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supplierName, setSupplierName] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get supplier info
      const { data: supplier } = await supabase
        .from("suppliers")
        .select("id, company_name")
        .eq("user_id", user.id)
        .single();

      if (!supplier) return;

      setSupplierName(supplier.company_name);

      // Get assigned orders
      const { data: assignments } = await supabase
        .from("supplier_order_assignments")
        .select(`
          id,
          order_id,
          orders:order_id (
            id,
            order_number,
            status,
            created_at
          )
        `)
        .eq("supplier_id", supplier.id);

      if (assignments) {
        const orders = assignments
          .map((a: any) => a.orders)
          .filter(Boolean);

        // Get order items count
        const ordersWithItems = await Promise.all(
          orders.map(async (order: any) => {
            const { count } = await supabase
              .from("order_items")
              .select("*", { count: "exact", head: true })
              .eq("order_id", order.id);
            return { ...order, item_count: count || 0 };
          })
        );

        setRecentOrders(ordersWithItems.slice(0, 5));

        // Calculate stats
        const today = new Date().toISOString().split("T")[0];
        
        // Get fulfillment data
        const { data: fulfillments } = await supabase
          .from("order_item_fulfillment")
          .select("status, shipped_at")
          .eq("supplier_id", supplier.id);

        const pendingCount = fulfillments?.filter(
          (f) => f.status === "pending" || f.status === "in_production" || f.status === "packed"
        ).length || 0;

        const shippedTodayCount = fulfillments?.filter(
          (f) => f.shipped_at && f.shipped_at.startsWith(today)
        ).length || 0;

        const completedCount = fulfillments?.filter(
          (f) => f.status === "completed"
        ).length || 0;

        setStats({
          totalAssigned: orders.length,
          pendingFulfillment: pendingCount,
          shippedToday: shippedTodayCount,
          completed: completedCount,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: "Assigned Orders", value: stats.totalAssigned, icon: Package, color: "text-blue-500" },
    { label: "Pending Fulfillment", value: stats.pendingFulfillment, icon: Clock, color: "text-yellow-500" },
    { label: "Shipped Today", value: stats.shippedToday, icon: Truck, color: "text-green-500" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-primary" },
  ];

  return (
    <SupplierLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {supplierName || "Supplier"}</h1>
          <p className="text-muted-foreground">Here's an overview of your fulfillment activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Assigned Orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/supplier/orders">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No orders assigned yet
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/supplier/orders/${order.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">Order #{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.item_count} items • {format(new Date(order.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge variant="outline">{order.status}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  );
};

export default SupplierDashboard;
