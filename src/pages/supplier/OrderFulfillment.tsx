import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SupplierLayout } from "@/components/supplier/SupplierLayout";
import { FulfillmentChecklist } from "@/components/supplier/FulfillmentChecklist";
import { ShippingForm } from "@/components/supplier/ShippingForm";
import { SupplierChat } from "@/components/supplier/SupplierChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Package, Tags, Download, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type FulfillmentStatus = "pending" | "in_production" | "packed" | "shipped" | "completed";

interface OrderDetails {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  fulfillment_carrier: string | null;
  fulfillment_tracking_number: string | null;
  estimated_delivery_date: string | null;
  custom_labeling?: boolean;
  custom_labeling_logo_url?: string | null;
}

interface FulfillmentItem {
  id: string;
  order_item_id: string;
  product_name: string;
  variation_name: string | null;
  quantity: number;
  status: FulfillmentStatus;
}

const SupplierOrderFulfillment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [fulfillmentItems, setFulfillmentItems] = useState<FulfillmentItem[]>([]);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get supplier
      const { data: supplier } = await supabase
        .from("suppliers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!supplier) {
        navigate("/supplier/orders");
        return;
      }

      setSupplierId(supplier.id);

      // Verify assignment
      const { data: assignment } = await supabase
        .from("supplier_order_assignments")
        .select("id")
        .eq("order_id", id)
        .eq("supplier_id", supplier.id)
        .single();

      if (!assignment) {
        toast({
          title: "Access Denied",
          description: "You don't have access to this order",
          variant: "destructive",
        });
        navigate("/supplier/orders");
        return;
      }

      // Fetch order using safe view
      const { data: orderData } = await supabase
        .from("supplier_order_view")
        .select("*")
        .eq("id", id)
        .single();

      if (orderData) {
        // Also fetch custom labeling info from orders table (suppliers have SELECT access)
        const { data: fullOrderData } = await supabase
          .from("orders")
          .select("custom_labeling, custom_labeling_logo_url")
          .eq("id", id)
          .single();

        setOrder({
          ...orderData,
          custom_labeling: fullOrderData?.custom_labeling || false,
          custom_labeling_logo_url: fullOrderData?.custom_labeling_logo_url || null,
        });
      }

      // Fetch order items
      const { data: items } = await supabase
        .from("order_items")
        .select("id, product_name, variation_name, quantity")
        .eq("order_id", id);

      if (items) {
        // Fetch or create fulfillment records
        const fulfillmentData = await Promise.all(
          items.map(async (item) => {
            const { data: existing } = await supabase
              .from("order_item_fulfillment")
              .select("*")
              .eq("order_item_id", item.id)
              .single();

            if (existing) {
              return {
                id: existing.id,
                order_item_id: item.id,
                product_name: item.product_name,
                variation_name: item.variation_name,
                quantity: item.quantity,
                status: existing.status as FulfillmentStatus,
              };
            }

            // Create new fulfillment record
            const { data: newRecord } = await supabase
              .from("order_item_fulfillment")
              .insert({
                order_item_id: item.id,
                supplier_id: supplier.id,
                status: "pending",
                updated_by: user.id,
              })
              .select()
              .single();

            return {
              id: newRecord?.id || "",
              order_item_id: item.id,
              product_name: item.product_name,
              variation_name: item.variation_name,
              quantity: item.quantity,
              status: "pending" as FulfillmentStatus,
            };
          })
        );

        setFulfillmentItems(fulfillmentData);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (itemId: string, status: FulfillmentStatus) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("order_item_fulfillment")
      .update({
        status,
        updated_by: user.id,
        shipped_at: status === "shipped" ? new Date().toISOString() : null,
      })
      .eq("id", itemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      return;
    }

    // Log activity
    await supabase.from("order_activity_log").insert({
      order_id: id,
      user_id: user.id,
      action: "fulfillment_status_updated",
      details: { item_id: itemId, new_status: status },
    });

    setFulfillmentItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );

    toast({
      title: "Status Updated",
      description: `Item marked as ${status}`,
    });
  };

  const handleShippingSubmit = async (data: {
    carrier: string;
    trackingNumber: string;
    estimatedDeliveryDate: string;
    notes: string;
  }) => {
    setIsSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !id) {
      setIsSaving(false);
      return;
    }

    // Update all fulfillment items with shipping info
    for (const item of fulfillmentItems) {
      await supabase
        .from("order_item_fulfillment")
        .update({
          shipping_carrier: data.carrier,
          tracking_number: data.trackingNumber,
          notes: data.notes,
          updated_by: user.id,
        })
        .eq("id", item.id);
    }

    // Log activity
    await supabase.from("order_activity_log").insert({
      order_id: id,
      user_id: user.id,
      action: "shipping_info_updated",
      details: {
        carrier: data.carrier,
        tracking_number: data.trackingNumber,
        estimated_delivery: data.estimatedDeliveryDate,
      },
    });

    toast({
      title: "Shipping Info Saved",
      description: "Shipping details have been updated",
    });

    setIsSaving(false);
  };

  const allShipped = fulfillmentItems.every(
    (item) => item.status === "shipped" || item.status === "completed"
  );

  const handleDownloadLogo = async (logoUrl: string) => {
    try {
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      const extension = logoUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'png';
      const fileName = `order_${order?.order_number || 'unknown'}_logo.${extension}`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Downloading ${fileName}`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Unable to download the logo. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <SupplierLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SupplierLayout>
    );
  }

  if (!order) {
    return (
      <SupplierLayout>
        <div className="p-6">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </SupplierLayout>
    );
  }

  return (
    <SupplierLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/supplier/orders")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
            <p className="text-muted-foreground">
              {format(new Date(order.created_at), "MMMM d, yyyy")}
            </p>
          </div>
          <Badge variant={allShipped ? "default" : "secondary"} className="ml-auto">
            {allShipped ? "All Shipped" : order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.shipping_address}</p>
                <p>
                  {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                </p>
                <p>{order.shipping_country}</p>
              </CardContent>
            </Card>

            {/* Custom Labeling Info - only show if custom labeling selected */}
            {order.custom_labeling && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tags className="h-5 w-5 text-primary" />
                    Custom Logo Labeling Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This order requires custom logo labeling on vials. Download the customer's logo below.
                  </p>
                  {order.custom_labeling_logo_url ? (
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg border border-border overflow-hidden bg-background flex items-center justify-center">
                        {order.custom_labeling_logo_url.toLowerCase().endsWith('.pdf') ? (
                          <FileImage className="w-10 h-10 text-muted-foreground" />
                        ) : (
                          <img
                            src={order.custom_labeling_logo_url}
                            alt="Customer logo"
                            className="w-full h-full object-contain p-2"
                          />
                        )}
                      </div>
                      <Button
                        onClick={() => handleDownloadLogo(order.custom_labeling_logo_url!)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Logo
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-destructive">
                      ⚠️ No logo file uploaded for this order. Contact admin.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Fulfillment Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products to Fulfill
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FulfillmentChecklist
                  items={fulfillmentItems}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>

            {/* Shipping Form */}
            <ShippingForm
              initialData={{
                carrier: order.fulfillment_carrier || "",
                trackingNumber: order.fulfillment_tracking_number || "",
                estimatedDeliveryDate: order.estimated_delivery_date || "",
              }}
              onSubmit={handleShippingSubmit}
              isLoading={isSaving}
            />
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            {supplierId && (
              <div className="sticky top-6 h-[600px]">
                <SupplierChat orderId={order.id} supplierId={supplierId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
};

export default SupplierOrderFulfillment;
