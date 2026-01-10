import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  ArrowRight,
  ShoppingBag,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_name: string;
  variation_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  discount_amount: number | null;
  discount_tier: string | null;
  shipping_cost: number | null;
  buyer_protection: boolean;
  buyer_protection_cost: number | null;
  total: number;
  billing_email: string;
  billing_first_name: string;
  billing_last_name: string;
  created_at: string;
  order_items: OrderItem[];
}

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order");
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifyAndFetch = async () => {
      if (!orderNumber) {
        setLoading(false);
        return;
      }

      try {
        // Verify payment if session ID exists
        if (sessionId) {
          await supabase.functions.invoke("verify-payment", {
            body: { sessionId, orderNumber },
          });
        }

        // Fetch order details
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (*)
          `)
          .eq("order_number", orderNumber)
          .single();

        if (!error && data) {
          setOrder(data as unknown as Order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [orderNumber, sessionId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const copyOrderNumber = () => {
    if (order?.order_number) {
      navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      toast.success("Order number copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-24 lg:pt-32 pb-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading order details...</div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="pt-24 lg:pt-32 pb-16 min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
              Order Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find the order you're looking for.
            </p>
            <Link to="/products">
              <Button variant="hero">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 lg:pt-32 pb-16 min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Order Confirmed!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-body text-muted-foreground text-lg"
            >
              Thank you for your order, {order.billing_first_name}!
            </motion.p>
          </motion.div>

          {/* Order Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6 mb-8 text-center"
          >
            <p className="font-body text-sm text-muted-foreground mb-2">Order Number</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-heading text-2xl font-bold text-foreground tracking-wider">
                {order.order_number}
              </span>
              <button
                onClick={copyOrderNumber}
                className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Status Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {[
              { icon: CheckCircle2, label: "Confirmed", active: true },
              { icon: Package, label: "Processing", active: order.status !== "pending" },
              { icon: Truck, label: "Shipped", active: order.status === "shipped" },
            ].map((step, index) => (
              <div
                key={step.label}
                className={`p-4 rounded-xl border text-center transition-all ${
                  step.active
                    ? "bg-foreground/5 border-foreground/20"
                    : "bg-secondary/30 border-border"
                }`}
              >
                <step.icon
                  className={`w-8 h-8 mx-auto mb-2 ${
                    step.active ? "text-foreground" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`font-heading text-sm font-medium ${
                    step.active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card border border-border rounded-xl overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-border">
              <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Details
              </h2>
            </div>

            <div className="divide-y divide-border">
              {order.order_items.map((item) => (
                <div key={item.id} className="p-6 flex justify-between items-center">
                  <div>
                    <p className="font-heading font-medium text-foreground">
                      {item.product_name}
                    </p>
                    {item.variation_name && (
                      <p className="font-body text-sm text-muted-foreground">
                        {item.variation_name}
                      </p>
                    )}
                    <p className="font-body text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-heading font-semibold text-foreground">
                    {formatCurrency(item.total_price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-secondary/30 space-y-3">
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatCurrency(order.subtotal)}</span>
              </div>

              {order.discount_amount && order.discount_amount > 0 && (
                <div className="flex justify-between font-body text-green-500">
                  <span>{order.discount_tier} Discount</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}

              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Shipping</span>
                <span className={order.shipping_cost === 0 ? "text-green-500" : "text-foreground"}>
                  {order.shipping_cost === 0 ? "FREE" : formatCurrency(order.shipping_cost || 0)}
                </span>
              </div>

              {order.buyer_protection && order.buyer_protection_cost && (
                <div className="flex justify-between font-body">
                  <span className="text-muted-foreground">Buyer Protection</span>
                  <span className="text-foreground">
                    {formatCurrency(order.buyer_protection_cost)}
                  </span>
                </div>
              )}

              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-heading font-semibold text-foreground">Total</span>
                <span className="font-heading text-2xl font-bold text-foreground">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Confirmation Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-secondary/30 border border-border rounded-xl p-6 mb-8 flex items-center gap-4"
          >
            <Mail className="w-8 h-8 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="font-heading font-medium text-foreground">
                Confirmation email sent
              </p>
              <p className="font-body text-sm text-muted-foreground">
                We've sent order details to {order.billing_email}
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/products">
              <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
