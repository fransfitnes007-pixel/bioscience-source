import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Package,
  Search,
  Eye,
  Truck,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
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
  tracking_number?: string;
  shipping_carrier?: string;
  created_at: string;
  paid_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  variation_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "processing", label: "Processing", color: "bg-blue-500" },
  { value: "shipped", label: "Shipped", color: "bg-purple-500" },
  { value: "delivered", label: "Delivered", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "paid", label: "Paid", color: "bg-green-500" },
  { value: "failed", label: "Failed", color: "bg-red-500" },
  { value: "refunded", label: "Refunded", color: "bg-gray-500" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const { toast } = useToast();

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const pending = data?.filter((o) => o.status === "pending").length || 0;
      const revenue = data?.reduce((sum, o) => sum + (o.payment_status === "paid" ? Number(o.total) : 0), 0) || 0;
      const paid = data?.filter((o) => o.payment_status === "paid").length || 0;

      setStats({
        totalOrders: total,
        pendingOrders: pending,
        totalRevenue: revenue,
        paidOrders: paid,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(query) ||
          order.billing_email.toLowerCase().includes(query) ||
          `${order.billing_first_name} ${order.billing_last_name}`.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (paymentFilter !== "all") {
      filtered = filtered.filter((order) => order.payment_status === paymentFilter);
    }

    setFilteredOrders(filtered);
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (error) {
      console.error("Error fetching order items:", error);
      return;
    }

    setOrderItems(data || []);
  };

  const openOrderDetail = async (order: Order) => {
    setSelectedOrder(order);
    setInternalNotes(order.internal_notes || "");
    await fetchOrderItems(order.id);
    setIsDetailOpen(true);
  };

  const openShippingDialog = (order: Order) => {
    setSelectedOrder(order);
    setTrackingNumber((order as any).tracking_number || "");
    setShippingCarrier((order as any).shipping_carrier || "");
    setIsShippingOpen(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });

      fetchOrders();
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const updateShippingInfo = async () => {
    if (!selectedOrder) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "shipped",
          internal_notes: `Tracking: ${shippingCarrier} - ${trackingNumber}\n${selectedOrder.internal_notes || ""}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedOrder.id);

      if (error) throw error;

      toast({
        title: "Shipping Updated",
        description: "Order marked as shipped with tracking information",
      });

      setIsShippingOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Error updating shipping:", error);
      toast({
        title: "Error",
        description: "Failed to update shipping information",
        variant: "destructive",
      });
    }
  };

  const saveInternalNotes = async () => {
    if (!selectedOrder) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update({ internal_notes: internalNotes, updated_at: new Date().toISOString() })
        .eq("id", selectedOrder.id);

      if (error) throw error;

      toast({
        title: "Notes Saved",
        description: "Internal notes updated successfully",
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUSES.find((s) => s.value === status);
    return (
      <Badge className={`${statusConfig?.color || "bg-gray-500"} text-white`}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const statusConfig = PAYMENT_STATUSES.find((s) => s.value === status);
    return (
      <Badge variant="outline" className={`border-2 ${status === "paid" ? "border-green-500 text-green-500" : status === "failed" ? "border-red-500 text-red-500" : "border-yellow-500 text-yellow-500"}`}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Orders & Payments</h1>
          <p className="text-muted-foreground mt-1">
            Manage orders, payments, and shipping
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Package className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid Orders</p>
                  <p className="text-2xl font-bold">{stats.paidOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order #, email, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  {PAYMENT_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No orders found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {order.billing_first_name} {order.billing_last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.billing_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(order.total).toLocaleString()}
                      </TableCell>
                      <TableCell>{getPaymentBadge(order.payment_status || "pending")}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openOrderDetail(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openShippingDialog(order)}
                            disabled={order.status === "shipped" || order.status === "delivered"}
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Status & Payment */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Payment:</span>
                    {getPaymentBadge(selectedOrder.payment_status || "pending")}
                  </div>
                  {selectedOrder.paid_at && (
                    <span className="text-sm text-muted-foreground">
                      Paid: {format(new Date(selectedOrder.paid_at), "MMM d, yyyy h:mm a")}
                    </span>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Variation</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.variation_name || "-"}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${Number(item.unit_price).toFixed(2)}</TableCell>
                          <TableCell className="text-right">${Number(item.total_price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${Number(selectedOrder.subtotal).toFixed(2)}</span>
                    </div>
                    {Number(selectedOrder.discount_amount) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${Number(selectedOrder.discount_amount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${Number(selectedOrder.shipping_cost || 0).toFixed(2)}</span>
                    </div>
                    {Number(selectedOrder.buyer_protection_cost) > 0 && (
                      <div className="flex justify-between">
                        <span>Buyer Protection</span>
                        <span>${Number(selectedOrder.buyer_protection_cost).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                      <span>Total</span>
                      <span>${Number(selectedOrder.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Billing Address</h3>
                    <div className="text-sm space-y-1">
                      <p>{selectedOrder.billing_first_name} {selectedOrder.billing_last_name}</p>
                      {selectedOrder.billing_company && <p>{selectedOrder.billing_company}</p>}
                      <p>{selectedOrder.billing_address}</p>
                      {selectedOrder.billing_address_2 && <p>{selectedOrder.billing_address_2}</p>}
                      <p>{selectedOrder.billing_city}, {selectedOrder.billing_state} {selectedOrder.billing_zip}</p>
                      <p>{selectedOrder.billing_country}</p>
                      <p className="pt-2">{selectedOrder.billing_email}</p>
                      {selectedOrder.billing_phone && <p>{selectedOrder.billing_phone}</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    {selectedOrder.shipping_same_as_billing ? (
                      <p className="text-sm text-muted-foreground">Same as billing</p>
                    ) : (
                      <div className="text-sm space-y-1">
                        <p>{selectedOrder.shipping_first_name} {selectedOrder.shipping_last_name}</p>
                        {selectedOrder.shipping_company && <p>{selectedOrder.shipping_company}</p>}
                        <p>{selectedOrder.shipping_address}</p>
                        {selectedOrder.shipping_address_2 && <p>{selectedOrder.shipping_address_2}</p>}
                        <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}</p>
                        <p>{selectedOrder.shipping_country}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="font-semibold mb-3">Internal Notes</h3>
                  <Textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add internal notes about this order..."
                    rows={3}
                  />
                  <Button onClick={saveInternalNotes} className="mt-2" size="sm">
                    Save Notes
                  </Button>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Customer Notes</h3>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Shipping Dialog */}
        <Dialog open={isShippingOpen} onOpenChange={setIsShippingOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Shipping Information</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="carrier">Shipping Carrier</Label>
                <Select value={shippingCarrier} onValueChange={setShippingCarrier}>
                  <SelectTrigger id="carrier">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USPS">USPS</SelectItem>
                    <SelectItem value="UPS">UPS</SelectItem>
                    <SelectItem value="FedEx">FedEx</SelectItem>
                    <SelectItem value="DHL">DHL</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsShippingOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateShippingInfo} disabled={!shippingCarrier || !trackingNumber}>
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
