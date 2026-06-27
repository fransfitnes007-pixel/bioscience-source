import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Package, Search, Eye, Truck, MoreHorizontal, Plus, FileText,
  ArrowUpDown, Calendar,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  billing_first_name: string;
  billing_last_name: string;
  billing_email: string;
  created_at: string;
}

const TABS = [
  { value: "all", label: "All" },
  { value: "unfulfilled", label: "Unfulfilled" },
  { value: "unpaid", label: "Unpaid" },
  { value: "open", label: "Open" },
  { value: "archived", label: "Archived" },
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
    total: 0, itemsOrdered: 0, returns: 0, fulfilled: 0, delivered: 0,
  });

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("payment_status", "paid")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const enriched = data || [];
      setOrders(enriched);

      setStats({
        total: enriched.length,
        itemsOrdered: enriched.length,
        returns: 0,
        fulfilled: enriched.filter(o => ["delivered", "shipped"].includes(o.status)).length,
        delivered: enriched.filter(o => o.status === "delivered").length,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({ title: "Error", description: "Failed to load orders", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === "unfulfilled" && ["delivered", "shipped", "cancelled"].includes(order.status)) return false;
    if (activeTab === "unpaid" && order.payment_status === "paid") return false;
    if (activeTab === "open" && ["delivered", "cancelled"].includes(order.status)) return false;
    if (activeTab === "archived" && order.status !== "cancelled") return false;

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
    if (selectedOrders.size === filteredOrders.length) setSelectedOrders(new Set());
    else setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedOrders);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedOrders(next);
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const getPaymentDot = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-600",
      pending: "bg-yellow-900/200",
      failed: "bg-red-900/200",
      refunded: "bg-gray-400",
    };
    return (
      <span className="flex items-center gap-1.5 text-sm text-foreground">
        <span className={`h-2 w-2 rounded-full ${colors[status] || colors.pending}`} />
        {status === "paid" ? "Paid" : status === "failed" ? "Failed" : status === "refunded" ? "Refunded" : "Pending"}
      </span>
    );
  };

  const getFulfillmentDot = (order: Order) => {
    if (order.status === "cancelled") return <span className="flex items-center gap-1.5 text-sm text-foreground"><span className="h-2 w-2 rounded-full bg-gray-400" />Cancelled</span>;
    if (order.status === "delivered") return <span className="flex items-center gap-1.5 text-sm text-foreground"><span className="h-2 w-2 rounded-full bg-green-600" />Fulfilled</span>;
    if (order.status === "shipped") return <span className="flex items-center gap-1.5 text-sm text-foreground"><span className="h-2 w-2 rounded-full bg-blue-900/200" />In transit</span>;
    return <span className="flex items-center gap-1.5 text-sm text-foreground"><span className="h-2 w-2 rounded-full bg-yellow-900/200" />Unfulfilled</span>;
  };

  const getDeliveryDot = (order: Order) => {
    if (order.status === "delivered") return <span className="flex items-center gap-1.5 text-sm text-foreground"><span className="h-2 w-2 rounded-full bg-green-600" />Delivered</span>;
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Orders</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-card border-border text-foreground hover:bg-secondary"
              onClick={() => navigate("/admin/orders/drafts")}
            >
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
                  More actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border text-foreground">
                <DropdownMenuItem onClick={() => navigate("/admin/orders/drafts")}>View drafts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90"
              onClick={() => navigate("/admin/orders/new")}
            >
              Create order
            </Button>
          </div>
        </div>

        {/* Stats Bar - Shopify style */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex divide-x divide-border">
            <div className="px-5 py-4 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground font-medium">Today</span>
            </div>
            {[
              { label: "Orders", value: stats.total, color: "bg-blue-900/200" },
              { label: "Items ordered", value: stats.itemsOrdered, color: "bg-blue-900/200" },
              { label: "Returns", value: `$${stats.returns}`, color: "bg-yellow-900/200" },
              { label: "Orders fulfilled", value: stats.fulfilled, color: "bg-green-900/200" },
              { label: "Orders delivered", value: stats.delivered, color: "bg-green-900/200" },
            ].map((stat, i) => (
              <div key={i} className="flex-1 px-5 py-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-semibold text-foreground">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">—</span>
                </div>
                <div className="mt-2 h-0.5 rounded-full bg-border">
                  <div className={`h-full rounded-full ${stat.color} w-0`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0 border-b border-border">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">+</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-9 pl-8 pr-3 w-[220px] rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedOrders.size > 0 && (
          <div className="flex items-center gap-3 py-2 px-4 bg-accent rounded-lg border border-accent">
            <span className="text-sm font-medium text-foreground">{selectedOrders.size} selected</span>
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground text-xs" onClick={() => setSelectedOrders(new Set())}>
              Clear
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No orders found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 w-10">
                    <Checkbox
                      checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4 text-muted-foreground font-medium cursor-pointer" onClick={() => handleSort("order_number")}>
                    <span className="flex items-center gap-1">Order <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="py-3 px-4 text-muted-foreground font-medium cursor-pointer" onClick={() => handleSort("created_at")}>
                    <span className="flex items-center gap-1">Date ↓</span>
                  </th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Customer</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium cursor-pointer" onClick={() => handleSort("total")}>
                    <span className="flex items-center gap-1">Total</span>
                  </th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Payment status</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Fulfillment status</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Delivery status</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    className="border-b border-border hover:bg-secondary cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedOrders.has(order.id)}
                        onCheckedChange={() => toggleSelect(order.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-primary">
                        #{order.order_number}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {order.billing_first_name} {order.billing_last_name}
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">{getPaymentDot(order.payment_status || "pending")}</td>
                    <td className="py-3 px-4">{getFulfillmentDot(order)}</td>
                    <td className="py-3 px-4">{getDeliveryDot(order)}</td>
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-accent">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border-border text-foreground">
                          <DropdownMenuItem onClick={() => navigate(`/admin/orders/${order.id}`)}>
                            <Eye className="h-4 w-4 mr-2" /> View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/orders/${order.id}#fulfillment`)}>
                            <Truck className="h-4 w-4 mr-2" /> Fulfill order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
