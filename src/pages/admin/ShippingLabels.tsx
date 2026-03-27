import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Package, Truck, ExternalLink } from "lucide-react";

interface ShipmentRow {
  id: string;
  shipment_number: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_city: string;
  items_count: number;
  carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  status: string;
  shipped_at: string | null;
  delivered_at: string | null;
  weight: number | null;
  shipping_cost: number | null;
  created_at: string;
}

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Not printed" },
  { value: "shipped", label: "Printed" },
  { value: "returns", label: "Returns" },
];

const ShippingLabels = () => {
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchShipments = async () => {
      const { data: shipmentsData } = await supabase
        .from("order_shipments")
        .select("*, orders!inner(order_number, shipping_first_name, shipping_last_name, shipping_city, shipping_state)")
        .order("created_at", { ascending: false });

      if (shipmentsData) {
        const rows: ShipmentRow[] = shipmentsData.map((s: any) => ({
          id: s.id,
          shipment_number: s.shipment_number,
          order_id: s.order_id,
          order_number: s.orders?.order_number || "",
          customer_name: `${s.orders?.shipping_first_name || ""} ${s.orders?.shipping_last_name || ""}`.trim(),
          customer_city: `${s.orders?.shipping_city || ""}, ${s.orders?.shipping_state || ""}`,
          items_count: 1,
          carrier: s.carrier,
          tracking_number: s.tracking_number,
          tracking_url: s.tracking_url,
          status: s.status,
          shipped_at: s.shipped_at,
          delivered_at: s.delivered_at,
          weight: s.weight,
          shipping_cost: s.shipping_cost,
          created_at: s.created_at,
        }));
        setShipments(rows);
      }
      setIsLoading(false);
    };
    fetchShipments();
  }, []);

  const filtered = shipments.filter(s => {
    if (activeTab === "pending") return s.status === "pending";
    if (activeTab === "shipped") return ["shipped", "delivered"].includes(s.status);
    if (activeTab === "returns") return false;
    return true;
  });

  const getDeliveryBadge = (status: string) => {
    if (status === "delivered") return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">Delivered</span>;
    if (status === "shipped") return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">In transit</span>;
    return <span className="text-xs text-muted-foreground">No status yet</span>;
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Shipping labels</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
                  More actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border text-foreground">
                <DropdownMenuItem>Create manifest</DropdownMenuItem>
                <DropdownMenuItem>Schedule USPS pickup <ExternalLink className="h-3 w-3 ml-2" /></DropdownMenuItem>
                <DropdownMenuItem>Manage preferred services</DropdownMenuItem>
                <DropdownMenuItem>Hide analytics bar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
              <Package className="h-4 w-4 mr-1" /> 0 orders to ship
            </Button>
          </div>
        </div>

        {/* Delivery Performance */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <span className="text-sm text-foreground font-medium">🇺🇸 US domestic delivery performance</span>
          </div>
          <div className="flex divide-x divide-border">
            <div className="px-5 py-4 flex items-center gap-3">
              <span className="text-sm text-foreground">📅 30 days</span>
            </div>
            {[
              { label: "Delivered within 5 days", value: "0%" },
              { label: "Shipped next day", value: "0%" },
              { label: "Tracking included", value: "0%" },
            ].map((stat, i) => (
              <div key={i} className="flex-1 px-5 py-4">
                <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.value} —</p>
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
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Truck className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No shipping labels yet</p>
              <p className="text-sm mt-1">Shipping labels will appear here when orders are fulfilled</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 w-10"><Checkbox /></th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Order</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Items</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Weight</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Cost</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Shipping service</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Delivery status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3 px-4"><Checkbox /></td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-primary">#{s.order_number} · {s.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{s.customer_city}</p>
                    </td>
                    <td className="py-3 px-4 text-foreground">{s.items_count}</td>
                    <td className="py-3 px-4 text-foreground">{s.weight ? `${s.weight} lb` : "—"}</td>
                    <td className="py-3 px-4 text-foreground">{s.shipping_cost ? `$${Number(s.shipping_cost).toFixed(2)}` : "—"}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-foreground">{s.carrier || "—"}</p>
                        {s.tracking_number && <p className="text-xs text-muted-foreground font-mono">{s.tracking_number}</p>}
                      </div>
                    </td>
                    <td className="py-3 px-4">{getDeliveryBadge(s.status)}</td>
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

export default ShippingLabels;
