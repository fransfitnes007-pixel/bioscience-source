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
      pending: "bg-yellow-500",
      failed: "bg-red-500",
      refunded: "bg-gray-400",
    };
    return (
      <span className="flex items-center gap-1.5 text-sm text-[#202223]">
        <span className={`h-2 w-2 rounded-full ${colors[status] || colors.pending}`} />
        {status === "paid" ? "Paid" : status === "failed" ? "Failed" : status === "refunded" ? "Refunded" : "Pending"}
      </span>
    );
  };

  const getFulfillmentDot = (order: Order) => {
    if (order.status === "cancelled") return <span className="flex items-center gap-1.5 text-sm text-[#202223]"><span className="h-2 w-2 rounded-full bg-gray-400" />Cancelled</span>;
    if (order.status === "delivered") return <span className="flex items-center gap-1.5 text-sm text-[#202223]"><span className="h-2 w-2 rounded-full bg-green-600" />Fulfilled</span>;
    if (order.status === "shipped") return <span className="flex items-center gap-1.5 text-sm text-[#202223]"><span className="h-2 w-2 rounded-full bg-blue-500" />In transit</span>;
    return <span className="flex items-center gap-1.5 text-sm text-[#202223]"><span className="h-2 w-2 rounded-full bg-yellow-500" />Unfulfilled</span>;
  };

  const getDeliveryDot = (order: Order) => {
    if (order.status === "delivered") return <span className="flex items-center gap-1.5 text-sm text-[#202223]"><span className="h-2 w-2 rounded-full bg-green-600" />Delivered</span>;
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#202223]" />
            <h1 className="text-xl font-semibold text-[#202223]">Orders</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]"
              onClick={() => navigate("/admin/orders/drafts")}
            >
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
                  More actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-[#e1e3e5] text-[#202223]">
                <DropdownMenuItem onClick={() => navigate("/admin/orders/drafts")}>View drafts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              className="bg-[#303030] text-white hover:bg-[#1a1a1a]"
              onClick={() => navigate("/admin/orders/new")}
            >
              Create order
            </Button>
          </div>
        </div>

        {/* Stats Bar - Shopify style */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
          <div className="flex divide-x divide-[#e1e3e5]">
            <div className="px-5 py-4 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#6d7175]" />
              <span className="text-sm text-[#202223] font-medium">Today</span>
            </div>
            {[
              { label: "Orders", value: stats.total, color: "bg-blue-500" },
              { label: "Items ordered", value: stats.itemsOrdered, color: "bg-blue-500" },
              { label: "Returns", value: `$${stats.returns}`, color: "bg-yellow-500" },
              { label: "Orders fulfilled", value: stats.fulfilled, color: "bg-green-500" },
              { label: "Orders delivered", value: stats.delivered, color: "bg-green-500" },
            ].map((stat, i) => (
              <div key={i} className="flex-1 px-5 py-4">
                <p className="text-sm text-[#6d7175]">{stat.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-semibold text-[#202223]">{stat.value}</span>
                  <span className="text-xs text-[#6d7175]">—</span>
                </div>
                <div className="mt-2 h-0.5 rounded-full bg-[#e1e3e5]">
                  <div className={`h-full rounded-full ${stat.color} w-0`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0 border-b border-[#e1e3e5]">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? "border-[#202223] text-[#202223]"
                    : "border-transparent text-[#6d7175] hover:text-[#202223]"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button className="px-3 py-2.5 text-sm text-[#6d7175] hover:text-[#202223]">+</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7175]" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-9 pl-8 pr-3 w-[220px] rounded-lg border border-[#c9cccf] bg-white text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
              />
            </div>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedOrders.size > 0 && (
          <div className="flex items-center gap-3 py-2 px-4 bg-[#f0f6ff] rounded-lg border border-[#b4d5fe]">
            <span className="text-sm font-medium text-[#202223]">{selectedOrders.size} selected</span>
            <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] text-xs" onClick={() => setSelectedOrders(new Set())}>
              Clear
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-[#6d7175]">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-[#6d7175]">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No orders found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e1e3e5] text-left">
                  <th className="py-3 px-4 w-10">
                    <Checkbox
                      checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4 text-[#6d7175] font-medium cursor-pointer" onClick={() => handleSort("order_number")}>
                    <span className="flex items-center gap-1">Order <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="py-3 px-4 text-[#6d7175] font-medium cursor-pointer" onClick={() => handleSort("created_at")}>
                    <span className="flex items-center gap-1">Date ↓</span>
                  </th>
                  <th className="py-3 px-4 text-[#6d7175] font-medium">Customer</th>
                  <th className="py-3 px-4 text-[#6d7175] font-medium cursor-pointer" onClick={() => handleSort("total")}>
                    <span className="flex items-center gap-1">Total</span>
                  </th>
                  <th className="py-3 px-4 text-[#6d7175] font-medium">Payment status</th>
                  <th className="py-3 px-4 text-[#6d7175] font-medium">Fulfillment status</th>
                  <th className="py-3 px-4 text-[#6d7175] font-medium">Delivery status</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    className="border-b border-[#e1e3e5] hover:bg-[#f6f6f7] cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedOrders.has(order.id)}
                        onCheckedChange={() => toggleSelect(order.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-[#005bd3]">
                        #{order.order_number}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6d7175]">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="py-3 px-4 text-[#202223]">
                      {order.billing_first_name} {order.billing_last_name}
                    </td>
                    <td className="py-3 px-4 text-[#202223] font-medium">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">{getPaymentDot(order.payment_status || "pending")}</td>
                    <td className="py-3 px-4">{getFulfillmentDot(order)}</td>
                    <td className="py-3 px-4">{getDeliveryDot(order)}</td>
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-[#e1e3e5]">
                            <MoreHorizontal className="h-4 w-4 text-[#6d7175]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border-[#e1e3e5] text-[#202223]">
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
