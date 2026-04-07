import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, RefreshCw, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  discount_amount: number | null;
  shipping_cost: number | null;
  total: number;
  created_at: string;
  billing_first_name: string;
  billing_last_name: string;
}

interface OrderItem {
  id: string;
  product_id?: string | null;
  variation_id?: string | null;
  product_name: string;
  variation_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ReorderItem extends OrderItem {
  selected: boolean;
}

const PortalOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [reordering, setReordering] = useState<string | null>(null);
  
  // Reorder confirmation dialog state
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [reorderItems, setReorderItems] = useState<ReorderItem[]>([]);
  const [reorderOrderNumber, setReorderOrderNumber] = useState("");
  const [processingReorder, setProcessingReorder] = useState(false);
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      setOrders(data || []);
      setFilteredOrders(data || []);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const fetchOrderItems = async (orderId: string) => {
    setLoadingItems(true);
    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    setOrderItems(data || []);
    setLoadingItems(false);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
  };

  const handleReorder = async (orderId: string, orderNumber: string) => {
    setReordering(orderId);
    
    // Fetch order items
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (!items || items.length === 0) {
      toast({
        title: "No items found",
        description: "This order has no items to reorder.",
        variant: "destructive",
      });
      setReordering(null);
      return;
    }

    // Open confirmation dialog with items
    setReorderItems(items.map(item => ({ ...item, selected: true })));
    setReorderOrderNumber(orderNumber);
    setReorderDialogOpen(true);
    setReordering(null);
  };

  const toggleItemSelection = (itemId: string) => {
    setReorderItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAllItems = (selected: boolean) => {
    setReorderItems(prev => prev.map(item => ({ ...item, selected })));
  };

  const confirmReorder = async () => {
    const selectedItems = reorderItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to reorder.",
        variant: "destructive",
      });
      return;
    }

    setProcessingReorder(true);

    for (const item of selectedItems) {
      await addToCart({
        productId: item.product_id || item.product_name,
        productName: item.product_name,
        variationId: item.variation_id || item.variation_name || '',
        variationName: item.variation_name || '',
        quantity: item.quantity,
        price: Number(item.unit_price),
      });
    }

    toast({
      title: "Items added to cart",
      description: `${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} have been added to your cart.`,
    });

    setProcessingReorder(false);
    setReorderDialogOpen(false);
    setReorderItems([]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
            <p className="text-muted-foreground">View and track all your orders</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No orders found</p>
              <Button className="mt-4" asChild>
                <a href="/products">Browse Products</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-lg">{order.order_number}</p>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(Number(order.total))}</p>
                      </div>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleReorder(order.id, order.order_number)}
                        disabled={reordering === order.id}
                      >
                        {reordering === order.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline ml-1">Reorder</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
              <DialogDescription>
                Placed on {selectedOrder && formatDate(selectedOrder.created_at)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${getStatusColor(selectedOrder?.status || '')}`}>
                  {selectedOrder?.status}
                </span>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-3">Items</h4>
                {loadingItems ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          {item.variation_name && (
                            <p className="text-sm text-muted-foreground">{item.variation_name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(Number(item.total_price))}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(Number(selectedOrder?.subtotal || 0))}</span>
                </div>
                {selectedOrder?.discount_amount && Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Discount</span>
                    <span>-{formatCurrency(Number(selectedOrder.discount_amount))}</span>
                  </div>
                )}
                {selectedOrder?.shipping_cost && Number(selectedOrder.shipping_cost) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(Number(selectedOrder.shipping_cost))}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(Number(selectedOrder?.total || 0))}</span>
                </div>
              </div>

              {/* Reorder Button */}
              <Button 
                className="w-full" 
                onClick={() => {
                  if (selectedOrder) {
                    handleReorder(selectedOrder.id, selectedOrder.order_number);
                    setSelectedOrder(null);
                  }
                }}
                disabled={reordering === selectedOrder?.id}
              >
                {reordering === selectedOrder?.id ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                Reorder All Items
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reorder Confirmation Dialog */}
        <Dialog open={reorderDialogOpen} onOpenChange={setReorderDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Reorder from {reorderOrderNumber}</DialogTitle>
              <DialogDescription>
                Select which items you'd like to add to your cart
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {/* Select All */}
              <div className="flex items-center gap-2 pb-2 border-b">
                <Checkbox
                  id="select-all"
                  checked={reorderItems.length > 0 && reorderItems.every(item => item.selected)}
                  onCheckedChange={(checked) => toggleAllItems(!!checked)}
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  Select All ({reorderItems.length} items)
                </label>
              </div>

              {/* Items List */}
              {reorderItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    item.selected ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                  }`}
                >
                  <Checkbox
                    id={item.id}
                    checked={item.selected}
                    onCheckedChange={() => toggleItemSelection(item.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.product_name}</p>
                    {item.variation_name && (
                      <p className="text-xs text-muted-foreground">{item.variation_name}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{formatCurrency(Number(item.unit_price))}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setReorderDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmReorder} 
                disabled={processingReorder || reorderItems.filter(i => i.selected).length === 0}
              >
                {processingReorder ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                Add {reorderItems.filter(i => i.selected).length} to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  );
};

export default PortalOrders;
