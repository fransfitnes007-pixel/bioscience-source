import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SupplierLayout } from "@/components/supplier/SupplierLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Package, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  shipping_city: string | null;
  shipping_state: string | null;
  item_count: number;
  fulfillment_progress: { fulfilled: number; total: number };
}

const SupplierOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get supplier
      const { data: supplier } = await supabase
        .from("suppliers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!supplier) return;

      // Get assigned orders with safe view data
      const { data: assignments } = await supabase
        .from("supplier_order_assignments")
        .select("order_id")
        .eq("supplier_id", supplier.id);

      if (!assignments || assignments.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const orderIds = assignments.map((a) => a.order_id);

      // Fetch orders using the supplier-safe view
      const { data: ordersData } = await supabase
        .from("supplier_order_view")
        .select("*")
        .in("id", orderIds)
        .order("created_at", { ascending: false });

      if (ordersData) {
        // Get item counts and fulfillment progress for each order
        const ordersWithDetails = await Promise.all(
          ordersData.map(async (order) => {
            const { data: items } = await supabase
              .from("order_items")
              .select("id")
              .eq("order_id", order.id);

            const { data: fulfillments } = await supabase
              .from("order_item_fulfillment")
              .select("status")
              .eq("supplier_id", supplier.id)
              .in("order_item_id", items?.map((i) => i.id) || []);

            const fulfilledCount = fulfillments?.filter(
              (f) => f.status === "shipped" || f.status === "completed"
            ).length || 0;

            return {
              ...order,
              item_count: items?.length || 0,
              fulfillment_progress: {
                fulfilled: fulfilledCount,
                total: items?.length || 0,
              },
            };
          })
        );

        setOrders(ordersWithDetails);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "shipped":
        return "default";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <SupplierLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Assigned Orders</h1>
          <p className="text-muted-foreground">Manage and fulfill your assigned orders</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {orders.length === 0 ? "No orders assigned to you yet" : "No orders match your filters"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead>Ship To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{format(new Date(order.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>{order.item_count} items</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{
                                width: `${(order.fulfillment_progress.fulfilled / order.fulfillment_progress.total) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {order.fulfillment_progress.fulfilled}/{order.fulfillment_progress.total}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.shipping_city && order.shipping_state
                          ? `${order.shipping_city}, ${order.shipping_state}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/supplier/orders/${order.id}`}>
                            Fulfill <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  );
};

export default SupplierOrders;
