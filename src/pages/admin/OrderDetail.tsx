import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  ArrowLeft, Package, Truck, DollarSign, Clock, CheckCircle, XCircle,
  RotateCcw, MapPin, User, Mail, Phone, FileText, Plus, Send,
  Tags, FileImage, Download, AlertTriangle, Copy, ExternalLink,
} from "lucide-react";

interface OrderData {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  subtotal: number;
  discount_amount: number;
  discount_code: string;
  discount_tier: string;
  shipping_cost: number;
  buyer_protection: boolean;
  buyer_protection_cost: number;
  tax_amount: number;
  total: number;
  billing_first_name: string;
  billing_last_name: string;
  billing_email: string;
  billing_phone: string;
  billing_company: string;
  billing_address: string;
  billing_address_2: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_company: string;
  shipping_address: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  shipping_same_as_billing: boolean;
  notes: string;
  internal_notes: string;
  custom_labeling: boolean;
  custom_labeling_logo_url: string;
  custom_labeling_cost: number;
  stripe_payment_intent_id: string;
  created_at: string;
  paid_at: string;
  shipped_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  variation_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface TimelineEvent {
  id: string;
  action: string;
  details: any;
  created_at: string;
  user_id: string;
}

interface Shipment {
  id: string;
  shipment_number: string;
  status: string;
  carrier: string;
  tracking_number: string;
  tracking_url: string;
  shipped_at: string;
  delivered_at: string;
  created_at: string;
}

interface Refund {
  id: string;
  amount: number;
  reason: string;
  status: string;
  refund_type: string;
  created_at: string;
}

const CARRIERS = [
  { value: "usps", label: "USPS", trackingUrl: "https://tools.usps.com/go/TrackConfirmAction?tLabels=" },
  { value: "ups", label: "UPS", trackingUrl: "https://www.ups.com/track?tracknum=" },
  { value: "fedex", label: "FedEx", trackingUrl: "https://www.fedex.com/fedextrack/?tracknumbers=" },
  { value: "dhl", label: "DHL", trackingUrl: "https://www.dhl.com/us-en/home/tracking.html?tracking-id=" },
  { value: "other", label: "Other", trackingUrl: "" },
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [internalNotes, setInternalNotes] = useState("");

  // Fulfillment dialog
  const [isFulfillOpen, setIsFulfillOpen] = useState(false);
  const [fulfillCarrier, setFulfillCarrier] = useState("");
  const [fulfillTracking, setFulfillTracking] = useState("");
  const [fulfillNotify, setFulfillNotify] = useState(true);
  const [fulfillItems, setFulfillItems] = useState<Set<string>>(new Set());

  // Refund dialog
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundType, setRefundType] = useState("full");

  useEffect(() => {
    if (id) fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setIsLoading(true);
    await Promise.all([fetchOrder(), fetchItems(), fetchTimeline(), fetchShipments(), fetchRefunds()]);
    setIsLoading(false);
  };

  const fetchOrder = async () => {
    const { data } = await supabase.from("orders").select("*").eq("id", id).single();
    if (data) {
      setOrder(data as any);
      setInternalNotes(data.internal_notes || "");
    }
  };

  const fetchItems = async () => {
    const { data } = await supabase.from("order_items").select("*").eq("order_id", id);
    setItems(data || []);
  };

  const fetchTimeline = async () => {
    const { data } = await supabase.from("order_activity_log").select("*").eq("order_id", id).order("created_at", { ascending: false });
    setTimeline(data || []);
  };

  const fetchShipments = async () => {
    const { data } = await supabase.from("order_shipments").select("*").eq("order_id", id).order("created_at", { ascending: false });
    setShipments(data || []);
  };

  const fetchRefunds = async () => {
    const { data } = await supabase.from("order_refunds").select("*").eq("order_id", id).order("created_at", { ascending: false });
    setRefunds(data || []);
  };

  const updateStatus = async (status: string) => {
    if (!order) return;
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", order.id);
    await logActivity(`Status changed to ${status}`);
    toast({ title: "Order updated", description: `Status changed to ${status}` });
    fetchOrder();
    fetchTimeline();
  };

  const saveNotes = async () => {
    if (!order) return;
    await supabase.from("orders").update({ internal_notes: internalNotes }).eq("id", order.id);
    toast({ title: "Notes saved" });
  };

  const logActivity = async (action: string, details?: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from("order_activity_log").insert({
      order_id: id!,
      action,
      details: details || {},
      user_id: session?.user?.id,
    });
  };

  const handleFulfill = async () => {
    if (!order) return;
    const carrier = CARRIERS.find(c => c.value === fulfillCarrier);
    const trackingUrl = carrier?.trackingUrl ? `${carrier.trackingUrl}${fulfillTracking}` : "";

    // Create shipment
    const shipmentNumber = `SHP-${Date.now().toString(36).toUpperCase()}`;
    const { data: shipment, error } = await supabase.from("order_shipments").insert({
      order_id: order.id,
      shipment_number: shipmentNumber,
      status: "shipped",
      carrier: carrier?.label || fulfillCarrier,
      tracking_number: fulfillTracking,
      tracking_url: trackingUrl,
      shipped_at: new Date().toISOString(),
      created_by: (await supabase.auth.getSession()).data.session?.user?.id,
    }).select().single();

    if (error) {
      toast({ title: "Error", description: "Failed to create shipment", variant: "destructive" });
      return;
    }

    // Add shipment items
    if (shipment) {
      const itemsToFulfill = fulfillItems.size > 0
        ? items.filter(i => fulfillItems.has(i.id))
        : items;

      await supabase.from("shipment_items").insert(
        itemsToFulfill.map(item => ({
          shipment_id: shipment.id,
          order_item_id: item.id,
          quantity: item.quantity,
        }))
      );
    }

    // Update order status
    await supabase.from("orders").update({
      status: "shipped",
      shipped_at: new Date().toISOString(),
      fulfillment_carrier: carrier?.label || fulfillCarrier,
      fulfillment_tracking_number: fulfillTracking,
    }).eq("id", order.id);

    await logActivity("Order fulfilled", {
      carrier: carrier?.label,
      tracking_number: fulfillTracking,
      shipment_number: shipmentNumber,
    });

    // Send notification if checked
    if (fulfillNotify && fulfillTracking) {
      try {
        await supabase.functions.invoke("send-shipping-notification", {
          body: {
            order_id: order.id,
            carrier: fulfillCarrier,
            tracking_number: fulfillTracking,
            estimated_delivery: shipment?.estimated_delivery || order.estimated_delivery_date,
          },
        });
      } catch (e) {
        console.error("Failed to send notification:", e);
      }
    }

    toast({ title: "Order fulfilled", description: `Shipment ${shipmentNumber} created` });
    setIsFulfillOpen(false);
    setFulfillCarrier("");
    setFulfillTracking("");
    setFulfillItems(new Set());
    fetchAll();
  };

  const handleRefund = async () => {
    if (!order) return;
    const amount = refundType === "full" ? Number(order.total) : Number(refundAmount);

    await supabase.from("order_refunds").insert({
      order_id: order.id,
      amount,
      reason: refundReason,
      refund_type: refundType,
      status: "pending",
      refunded_by: (await supabase.auth.getSession()).data.session?.user?.id,
    });

    if (refundType === "full") {
      await supabase.from("orders").update({ payment_status: "refunded" }).eq("id", order.id);
    }

    await logActivity("Refund created", { amount, type: refundType, reason: refundReason });
    toast({ title: "Refund created", description: `$${amount.toFixed(2)} refund initiated` });
    setIsRefundOpen(false);
    setRefundAmount("");
    setRefundReason("");
    fetchAll();
  };

  if (isLoading || !order) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading order...</div>
      </AdminLayout>
    );
  }

  const shippingAddr = order.shipping_same_as_billing
    ? {
        name: `${order.billing_first_name} ${order.billing_last_name}`,
        company: order.billing_company,
        address: order.billing_address,
        address2: order.billing_address_2,
        city: order.billing_city,
        state: order.billing_state,
        zip: order.billing_zip,
        country: order.billing_country,
      }
    : {
        name: `${order.shipping_first_name} ${order.shipping_last_name}`,
        company: order.shipping_company,
        address: order.shipping_address,
        address2: order.shipping_address_2,
        city: order.shipping_city,
        state: order.shipping_state,
        zip: order.shipping_zip,
        country: order.shipping_country,
      };

  const totalRefunded = refunds.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/orders")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">#{order.order_number}</h1>
                <Badge variant="outline" className={
                  order.payment_status === "paid" ? "bg-green-900/200/10 text-green-400 border-green-500/20" :
                  order.payment_status === "refunded" ? "bg-muted text-muted-foreground" :
                  "bg-yellow-900/200/10 text-yellow-600 border-yellow-500/20"
                }>
                  {order.payment_status === "paid" ? "Paid" : order.payment_status === "refunded" ? "Refunded" : "Payment pending"}
                </Badge>
                <Badge variant="outline" className={
                  order.status === "delivered" ? "bg-green-900/200/10 text-green-400 border-green-500/20" :
                  order.status === "shipped" ? "bg-blue-900/200/10 text-blue-400 border-blue-500/20" :
                  order.status === "cancelled" ? "bg-red-900/200/10 text-red-400 border-red-500/20" :
                  "bg-yellow-900/200/10 text-yellow-600 border-yellow-500/20"
                }>
                  {order.status === "delivered" ? "Fulfilled" :
                   order.status === "shipped" ? "In transit" :
                   order.status === "cancelled" ? "Cancelled" : "Unfulfilled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={order.status} onValueChange={updateStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setIsRefundOpen(true)}>
              <RotateCcw className="h-4 w-4 mr-1" /> Refund
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fulfillment Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {order.status === "shipped" || order.status === "delivered" ? "Fulfilled" : "Unfulfilled"}
                    <span className="text-muted-foreground font-normal">({items.length} items)</span>
                  </CardTitle>
                  {!["shipped", "delivered", "cancelled"].includes(order.status) && (
                    <Button size="sm" onClick={() => {
                      setFulfillItems(new Set(items.map(i => i.id)));
                      setIsFulfillOpen(true);
                    }}>
                      <Truck className="h-4 w-4 mr-1" /> Fulfill items
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            {item.variation_name && (
                              <p className="text-xs text-muted-foreground">{item.variation_name}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${Number(item.unit_price).toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${Number(item.total_price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Shipments */}
            {shipments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Shipments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shipments.map(shipment => (
                    <div key={shipment.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{shipment.shipment_number}</span>
                          <Badge variant="outline" className={
                            shipment.status === "delivered" ? "bg-green-900/200/10 text-green-400" :
                            "bg-blue-900/200/10 text-blue-400"
                          }>
                            {shipment.status}
                          </Badge>
                        </div>
                        {shipment.tracking_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={shipment.tracking_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" /> Track
                            </a>
                          </Button>
                        )}
                      </div>
                      {shipment.carrier && (
                        <p className="text-sm text-muted-foreground">
                          {shipment.carrier} • {shipment.tracking_number}
                        </p>
                      )}
                      {shipment.shipped_at && (
                        <p className="text-xs text-muted-foreground">
                          Shipped {format(new Date(shipment.shipped_at), "MMM d, yyyy h:mm a")}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Refunds */}
            {refunds.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" /> Refunds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {refunds.map(refund => (
                    <div key={refund.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium">${Number(refund.amount).toFixed(2)} — {refund.refund_type}</p>
                        {refund.reason && <p className="text-xs text-muted-foreground">{refund.reason}</p>}
                        <p className="text-xs text-muted-foreground">{format(new Date(refund.created_at), "MMM d, yyyy")}</p>
                      </div>
                      <Badge variant="outline" className={
                        refund.status === "completed" ? "bg-green-900/200/10 text-green-400" :
                        "bg-yellow-900/200/10 text-yellow-600"
                      }>
                        {refund.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Payment Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span>${Number(order.subtotal).toFixed(2)}</span>
                  </div>
                  {Number(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount {order.discount_code && `(${order.discount_code})`}</span>
                      <span>-${Number(order.discount_amount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${Number(order.shipping_cost || 0).toFixed(2)}</span>
                  </div>
                  {order.buyer_protection && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Buyer Protection</span>
                      <span>${Number(order.buyer_protection_cost || 0).toFixed(2)}</span>
                    </div>
                  )}
                  {order.custom_labeling && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Custom Labeling</span>
                      <span>${Number(order.custom_labeling_cost || 0).toFixed(2)}</span>
                    </div>
                  )}
                  {Number(order.tax_amount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${Number(order.tax_amount).toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${Number(order.total).toFixed(2)}</span>
                  </div>
                  {totalRefunded > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Refunded</span>
                      <span>-${totalRefunded.toFixed(2)}</span>
                    </div>
                  )}
                  {totalRefunded > 0 && (
                    <div className="flex justify-between font-bold">
                      <span>Net payment</span>
                      <span>${(Number(order.total) - totalRefunded).toFixed(2)}</span>
                    </div>
                  )}
                </div>
                {order.paid_at && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Paid on {format(new Date(order.paid_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.length === 0 && (
                    <p className="text-sm text-muted-foreground">No activity logged yet</p>
                  )}
                  {timeline.map(event => (
                    <div key={event.id} className="flex gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                      <div>
                        <p className="text-sm">{event.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.created_at), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm">Order created</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={internalNotes}
                  onChange={e => setInternalNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={3}
                />
                <Button size="sm" onClick={saveNotes} className="w-full">Save notes</Button>
                {order.notes && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Customer note</p>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" /> Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{order.billing_first_name} {order.billing_last_name}</p>
                  {order.billing_company && <p className="text-sm text-muted-foreground">{order.billing_company}</p>}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <a href={`mailto:${order.billing_email}`} className="text-primary hover:underline">{order.billing_email}</a>
                  </div>
                  {order.billing_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{order.billing_phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Shipping address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-0.5">
                  <p className="font-medium">{shippingAddr.name}</p>
                  {shippingAddr.company && <p>{shippingAddr.company}</p>}
                  <p>{shippingAddr.address}</p>
                  {shippingAddr.address2 && <p>{shippingAddr.address2}</p>}
                  <p>{shippingAddr.city}, {shippingAddr.state} {shippingAddr.zip}</p>
                  <p>{shippingAddr.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Billing address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-0.5">
                  <p className="font-medium">{order.billing_first_name} {order.billing_last_name}</p>
                  {order.billing_company && <p>{order.billing_company}</p>}
                  <p>{order.billing_address}</p>
                  {order.billing_address_2 && <p>{order.billing_address_2}</p>}
                  <p>{order.billing_city}, {order.billing_state} {order.billing_zip}</p>
                  <p>{order.billing_country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Custom Labeling */}
            {order.custom_labeling && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tags className="h-4 w-4" /> Custom Labeling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.custom_labeling_logo_url ? (
                    <div className="space-y-3">
                      <div className="w-full aspect-square rounded-lg border bg-background flex items-center justify-center overflow-hidden">
                        {order.custom_labeling_logo_url.toLowerCase().endsWith('.pdf') ? (
                          <FileImage className="w-12 h-12 text-muted-foreground" />
                        ) : (
                          <img src={order.custom_labeling_logo_url} alt="Logo" className="max-w-full max-h-full object-contain p-4" />
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={order.custom_labeling_logo_url} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" /> Download logo
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Custom labeling requested, no logo uploaded</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Fulfillment Dialog */}
      <Dialog open={isFulfillOpen} onOpenChange={setIsFulfillOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Fulfill order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Items to fulfill</Label>
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <Checkbox
                    checked={fulfillItems.has(item.id)}
                    onCheckedChange={checked => {
                      const next = new Set(fulfillItems);
                      if (checked) next.add(item.id); else next.delete(item.id);
                      setFulfillItems(next);
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product_name}</p>
                    {item.variation_name && <p className="text-xs text-muted-foreground">{item.variation_name}</p>}
                  </div>
                  <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <Label>Shipping carrier</Label>
                <Select value={fulfillCarrier} onValueChange={setFulfillCarrier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARRIERS.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tracking number</Label>
                <Input value={fulfillTracking} onChange={e => setFulfillTracking(e.target.value)} placeholder="Enter tracking number" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox checked={fulfillNotify} onCheckedChange={c => setFulfillNotify(!!c)} id="notify" />
              <label htmlFor="notify" className="text-sm">Send shipment notification to customer</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFulfillOpen(false)}>Cancel</Button>
            <Button onClick={handleFulfill} disabled={!fulfillCarrier}>
              <Truck className="h-4 w-4 mr-1" /> Fulfill items
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Refund type</Label>
              <Select value={refundType} onValueChange={setRefundType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full refund (${Number(order.total).toFixed(2)})</SelectItem>
                  <SelectItem value="partial">Partial refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {refundType === "partial" && (
              <div>
                <Label>Refund amount</Label>
                <Input
                  type="number"
                  value={refundAmount}
                  onChange={e => setRefundAmount(e.target.value)}
                  placeholder="0.00"
                  max={Number(order.total)}
                />
              </div>
            )}
            <div>
              <Label>Reason (optional)</Label>
              <Textarea value={refundReason} onChange={e => setRefundReason(e.target.value)} placeholder="Reason for refund..." rows={2} />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Refund amount</span>
                <span className="font-medium">
                  ${refundType === "full" ? Number(order.total).toFixed(2) : (Number(refundAmount) || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRefund}>
              <RotateCcw className="h-4 w-4 mr-1" /> Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default OrderDetail;
