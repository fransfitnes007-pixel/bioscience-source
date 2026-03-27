import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Package, Search, Eye, Truck, DollarSign, Clock, CheckCircle, XCircle,
  AlertCircle, MoreHorizontal, Plus, Archive, FileText, RefreshCw,
  ArrowUpDown, Filter,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  buyer_protection_cost: number;
  total: number;
  billing_first_name: string;
  billing_last_name: string;
  billing_email: string;
  billing_phone: string;
  billing_company: string;
  custom_labeling?: boolean;
  created_at: string;
  paid_at: string;
  fulfillment_status?: string;
  items_count?: number;
  fulfilled_count?: number;
}

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", icon: Clock, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  { value: "processing", label: "Processing", icon: RefreshCw, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "shipped", label: "Shipped", icon: Truck, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { value: "delivered", label: "Delivered", icon: CheckCircle, color: "bg-green-500/10 text-green-600 border-green-500/20" },
  { value: "cancelled", label: "Cancelled", icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20" },
];

const TABS = [
  { value: "all", label: "All" },
  { value: "unfulfilled", label: "Unfulfilled" },
  { value: "unpaid", label: "Unpaid" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0, unfulfilled: 0, unpaid: 0, open: 0, totalRevenue: 0,
  });

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const enrichedOrders = data || [];
      setOrders(enrichedOrders);

      setStats({
        total: enrichedOrders.length,
        unfulfilled: enrichedOrders.filter(o => !["delivered", "shipped", "cancelled"].includes(o.status)).length,
        unpaid: enrichedOrders.filter(o => o.payment_status !== "paid").length,
        open: enrichedOrders.filter(o => !["delivered", "cancelled"].includes(o.status)).length,
        totalRevenue: enrichedOrders.reduce((sum, o) => sum + (o.payment_status === "paid" ? Number(o.total) : 0), 0),
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({ title: "Error", description: "Failed to load orders", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    // Tab filter
    if (activeTab === "unfulfilled" && ["delivered", "shipped", "cancelled"].includes(order.status)) return false;
    if (activeTab === "unpaid" && order.payment_status === "paid") return false;
    if (activeTab === "open" && ["delivered", "cancelled"].includes(order.status)) return false;
    if (activeTab === "closed" && !["delivered", "cancelled"].includes(order.status)) return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(q) ||
        order.billing_email.toLowerCase().includes(q) ||
        `${order.billing_first_name} ${order.billing_last_name}`.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    const aVal = sortField === "total" ? Number(a[sortField as keyof Order]) : String(a[sortField as keyof Order] || "");
    const bVal = sortField === "total" ? Number(b[sortField as keyof Order]) : String(b[sortField as keyof Order] || "");
    if (sortDir === "asc") return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const toggleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedOrders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedOrders(next);
  };

  const bulkUpdateStatus = async (status: string) => {
    try {
      const ids = Array.from(selectedOrders);
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .in("id", ids);
      if (error) throw error;
      toast({ title: "Success", description: `${ids.length} orders updated to ${status}` });
      setSelectedOrders(new Set());
      fetchOrders();
    } catch {
      toast({ title: "Error", description: "Failed to update orders", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = ORDER_STATUSES.find(s => s.value === status);
    return (
      <Badge variant="outline" className={`${config?.color || "bg-muted text-muted-foreground"} font-medium`}>
        {config?.label || status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-500/10 text-green-600 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      failed: "bg-red-500/10 text-red-600 border-red-500/20",
      refunded: "bg-muted text-muted-foreground border-border",
    };
    return (
      <Badge variant="outline" className={`${colors[status] || colors.pending} font-medium`}>
        {status === "paid" ? "Paid" : status === "failed" ? "Failed" : status === "refunded" ? "Refunded" : "Pending"}
      </Badge>
    );
  };

  const getFulfillmentBadge = (order: Order) => {
    if (order.status === "cancelled") return <Badge variant="outline" className="bg-muted text-muted-foreground">Cancelled</Badge>;
    if (order.status === "delivered") return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Fulfilled</Badge>;
    if (order.status === "shipped") return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">In transit</Badge>;
    return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Unfulfilled</Badge>;
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/orders/drafts")}>
              <FileText className="h-4 w-4 mr-1" />
              Drafts
            </Button>
            <Button size="sm" onClick={() => navigate("/admin/orders/new")}>
              <Plus className="h-4 w-4 mr-1" />
              Create order
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total orders", value: stats.total, icon: Package },
            { label: "Unfulfilled", value: stats.unfulfilled, icon: AlertCircle },
            { label: "Unpaid", value: stats.unpaid, icon: Clock },
            { label: "Open", value: stats.open, icon: RefreshCw },
            { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-3 flex items-center gap-3">
                <stat.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs + Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              {TABS.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                  {tab.label}
                  {tab.value !== "all" && (
                    <span className="ml-1 text-muted-foreground">
                      {tab.value === "unfulfilled" ? stats.unfulfilled :
                       tab.value === "unpaid" ? stats.unpaid :
                       tab.value === "open" ? stats.open : ""}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 w-[250px] h-9"
                />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.size > 0 && (
            <div className="flex items-center gap-3 py-2 px-3 bg-muted/50 rounded-lg mt-2">
              <span className="text-sm font-medium">{selectedOrders.size} selected</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => bulkUpdateStatus("processing")}>
                    Mark as Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => bulkUpdateStatus("shipped")}>
                    Mark as Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => bulkUpdateStatus("delivered")}>
                    Mark as Delivered
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => bulkUpdateStatus("cancelled")} className="text-destructive">
                    Cancel Orders
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrders(new Set())}>
                Clear
              </Button>
            </div>
          )}

          <TabsContent value={activeTab} className="mt-2">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p>No orders found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-10">
                          <Checkbox
                            checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("order_number")}>
                          <div className="flex items-center gap-1">Order <ArrowUpDown className="h-3 w-3" /></div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                          <div className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></div>
                        </TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("total")}>
                          <div className="flex items-center gap-1">Total <ArrowUpDown className="h-3 w-3" /></div>
                        </TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Fulfillment</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map(order => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          <TableCell onClick={e => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedOrders.has(order.id)}
                              onCheckedChange={() => toggleSelect(order.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm font-medium text-primary">
                              #{order.order_number}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">
                                {order.billing_first_name} {order.billing_last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">{order.billing_email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>{getPaymentBadge(order.payment_status || "pending")}</TableCell>
                          <TableCell>{getFulfillmentBadge(order)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell onClick={e => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/admin/orders/${order.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" /> View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/admin/orders/${order.id}#fulfillment`)}>
                                  <Truck className="h-4 w-4 mr-2" /> Fulfill order
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={async () => {
                                    await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
                                    fetchOrders();
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" /> Cancel order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
