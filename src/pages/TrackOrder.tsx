import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Package, Truck, CheckCircle, Clock, MapPin, ExternalLink } from "lucide-react";
import resurrectedLogo from "@/assets/resurrected-logo.png";

interface TrackingData {
  order_number: string;
  status: string;
  created_at: string;
  shipped_at: string;
  items: { product_name: string; variation_name: string; quantity: number }[];
  shipments: {
    shipment_number: string;
    status: string;
    carrier: string;
    tracking_number: string;
    tracking_url: string;
    shipped_at: string;
    delivered_at: string;
  }[];
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
}

const STEPS = [
  { key: "confirmed", label: "Order Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

const TrackOrder = () => {
  const { orderNumber } = useParams();
  const [data, setData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderNumber) fetchTracking();
  }, [orderNumber]);

  const fetchTracking = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Please sign in to track your order");
        setIsLoading(false);
        return;
      }

      const { data: order, error: err } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .eq("user_id", session.user.id)
        .single();

      if (err || !order) {
        setError("Order not found");
        setIsLoading(false);
        return;
      }

      const { data: items } = await supabase
        .from("order_items")
        .select("product_name, variation_name, quantity")
        .eq("order_id", order.id);

      const { data: shipments } = await supabase
        .from("order_shipments")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: false });

      setData({
        order_number: order.order_number,
        status: order.status,
        created_at: order.created_at,
        shipped_at: order.shipped_at,
        items: items || [],
        shipments: shipments || [],
        shipping_city: order.shipping_same_as_billing ? order.billing_city : order.shipping_city,
        shipping_state: order.shipping_same_as_billing ? order.billing_state : order.shipping_state,
        shipping_country: order.shipping_same_as_billing ? order.billing_country : order.shipping_country,
      });
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === "delivered") return 3;
    if (status === "shipped") return 2;
    if (status === "processing") return 1;
    return 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <img src={resurrectedLogo} alt="Resurrected" className="h-8 mx-auto mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ mixBlendMode: 'lighten' }} />
            <p className="text-muted-foreground">{error || "Order not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStep = getStepIndex(data.status);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <img src={resurrectedLogo} alt="Resurrected" className="h-8 mx-auto mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ mixBlendMode: 'lighten' }} />
          <h1 className="text-2xl font-bold mb-1">Track Your Order</h1>
          <p className="text-muted-foreground">Order #{data.order_number}</p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              />

              {STEPS.map((step, i) => (
                <div key={step.key} className="relative flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    i <= currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground"
                  }`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs font-medium ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipments */}
        {data.shipments.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Shipment Details</h3>
              {data.shipments.map(shipment => (
                <div key={shipment.shipment_number} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={
                      shipment.status === "delivered" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                    }>
                      {shipment.status}
                    </Badge>
                    {shipment.tracking_url && (
                      <a
                        href={shipment.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Track package <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Carrier:</span> {shipment.carrier}
                  </p>
                  {shipment.tracking_number && (
                    <p className="text-sm font-mono">
                      <span className="text-muted-foreground">Tracking:</span> {shipment.tracking_number}
                    </p>
                  )}
                  {shipment.shipped_at && (
                    <p className="text-xs text-muted-foreground">
                      Shipped {format(new Date(shipment.shipped_at), "MMMM d, yyyy")}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Items */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Items in your order</h3>
            <div className="space-y-3">
              {data.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.product_name}</p>
                    {item.variation_name && <p className="text-xs text-muted-foreground">{item.variation_name}</p>}
                  </div>
                  <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Shipping to</h3>
            <p className="text-sm text-muted-foreground">
              {data.shipping_city}, {data.shipping_state} {data.shipping_country}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Order placed {format(new Date(data.created_at), "MMMM d, yyyy")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackOrder;
