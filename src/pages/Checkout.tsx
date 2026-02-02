import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { DealProgress } from "@/components/cart/DealProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CreditCard,
  Shield,
  Check,
  ArrowLeft,
  Lock,
  Truck,
  Package,
  Loader2,
} from "lucide-react";

const BUYER_PROTECTION_COST = 29.99;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, currentTier, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(2);

  // Form state
  const [buyerProtection, setBuyerProtection] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  
  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
        return;
      }
      setUserId(session.user.id);
      setBilling(prev => ({ ...prev, email: session.user.email || "" }));
    });
  }, [navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      navigate("/cart");
    }
  }, [items, navigate, isSubmitting]);

  // Calculate totals
  const getDiscount = () => {
    if (!currentTier) return 0;
    if ((currentTier.rewardType === "percent_off" || currentTier.rewardType === "percent_off_shipping") && currentTier.rewardValue) {
      return subtotal * (currentTier.rewardValue / 100);
    }
    if (currentTier.rewardType === "fixed_off" && currentTier.rewardValue) {
      return currentTier.rewardValue;
    }
    return 0;
  };

  const discount = getDiscount();
  const freeShipping = currentTier?.rewardType === "free_shipping" || 
                       currentTier?.rewardType === "percent_off_shipping";
  const shippingCost = freeShipping ? 0 : 25.00;
  const protectionCost = buyerProtection ? BUYER_PROTECTION_COST : 0;
  const total = subtotal - discount + shippingCost + protectionCost;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Please log in to complete your order");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order number
      const orderNumber = `PB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          order_number: orderNumber,
          subtotal: subtotal,
          discount_amount: discount,
          discount_tier: currentTier?.name || null,
          shipping_cost: shippingCost,
          buyer_protection: buyerProtection,
          buyer_protection_cost: protectionCost,
          total: total,
          billing_first_name: billing.firstName,
          billing_last_name: billing.lastName,
          billing_email: billing.email,
          billing_phone: billing.phone,
          billing_company: billing.company,
          billing_address: billing.address,
          billing_address_2: billing.address2,
          billing_city: billing.city,
          billing_state: billing.state,
          billing_zip: billing.zip,
          billing_country: billing.country,
          shipping_same_as_billing: sameAsBilling,
          shipping_first_name: sameAsBilling ? null : shipping.firstName,
          shipping_last_name: sameAsBilling ? null : shipping.lastName,
          shipping_company: sameAsBilling ? null : shipping.company,
          shipping_address: sameAsBilling ? null : shipping.address,
          shipping_address_2: sameAsBilling ? null : shipping.address2,
          shipping_city: sameAsBilling ? null : shipping.city,
          shipping_state: sameAsBilling ? null : shipping.state,
          shipping_zip: sameAsBilling ? null : shipping.zip,
          shipping_country: sameAsBilling ? null : shipping.country,
          status: "pending",
          payment_status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        variation_id: item.variationId,
        product_name: item.productName,
        variation_name: item.variationName,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: { orderId: order.id },
        }
      );

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        // Clear cart before redirecting
        await clearCart();
        // Redirect to Stripe Checkout
        window.location.href = checkoutData.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to process checkout");
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all";
  const labelClassName = "font-heading text-sm font-medium text-foreground block mb-2";

  const steps = [
    { num: 1, label: "Cart", completed: true },
    { num: 2, label: "Info", completed: currentStep > 2 },
    { num: 3, label: "Shipping", completed: currentStep > 3 },
    { num: 4, label: "Payment", completed: false },
    { num: 5, label: "Complete", completed: false },
  ];

  return (
    <Layout>
      <div className="pt-24 lg:pt-32 pb-16 min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {steps.map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    step.completed
                      ? "bg-foreground text-background"
                      : step.num === currentStep
                      ? "bg-foreground/20 text-foreground border border-foreground"
                      : "bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  {step.completed ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4 flex items-center justify-center font-heading text-xs font-bold">
                      {step.num}
                    </span>
                  )}
                  <span className="font-heading text-sm font-medium hidden sm:inline">
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 lg:w-16 h-0.5 bg-border mx-2" />
                )}
              </div>
            ))}
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm">Back to Cart</span>
          </Link>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Billing Information */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Billing Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClassName}>First Name *</label>
                      <input
                        type="text"
                        required
                        value={billing.firstName}
                        onChange={(e) => setBilling({ ...billing, firstName: e.target.value })}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>Last Name *</label>
                      <input
                        type="text"
                        required
                        value={billing.lastName}
                        onChange={(e) => setBilling({ ...billing, lastName: e.target.value })}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={labelClassName}>Email *</label>
                      <input
                        type="email"
                        required
                        value={billing.email}
                        onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>Phone *</label>
                      <input
                        type="tel"
                        required
                        value={billing.phone}
                        onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className={labelClassName}>Company Name</label>
                    <input
                      type="text"
                      value={billing.company}
                      onChange={(e) => setBilling({ ...billing, company: e.target.value })}
                      className={inputClassName}
                    />
                  </div>

                  <div className="mt-4">
                    <label className={labelClassName}>Street Address *</label>
                    <input
                      type="text"
                      required
                      value={billing.address}
                      onChange={(e) => setBilling({ ...billing, address: e.target.value })}
                      className={inputClassName}
                    />
                  </div>

                  <div className="mt-4">
                    <label className={labelClassName}>Apartment, Suite, etc.</label>
                    <input
                      type="text"
                      value={billing.address2}
                      onChange={(e) => setBilling({ ...billing, address2: e.target.value })}
                      className={inputClassName}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className={labelClassName}>City *</label>
                      <input
                        type="text"
                        required
                        value={billing.city}
                        onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>State/Province *</label>
                      <input
                        type="text"
                        required
                        value={billing.state}
                        onChange={(e) => setBilling({ ...billing, state: e.target.value })}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>ZIP/Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={billing.zip}
                        onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className={labelClassName}>Country *</label>
                    <select
                      value={billing.country}
                      onChange={(e) => setBilling({ ...billing, country: e.target.value })}
                      className={inputClassName}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Information
                  </h2>

                  <label className="flex items-center gap-3 cursor-pointer mb-6">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="w-5 h-5 rounded border-border"
                    />
                    <span className="font-body text-foreground">Same as billing address</span>
                  </label>

                  {!sameAsBilling && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClassName}>First Name *</label>
                          <input
                            type="text"
                            required
                            value={shipping.firstName}
                            onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className={labelClassName}>Last Name *</label>
                          <input
                            type="text"
                            required
                            value={shipping.lastName}
                            onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                            className={inputClassName}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClassName}>Company Name</label>
                        <input
                          type="text"
                          value={shipping.company}
                          onChange={(e) => setShipping({ ...shipping, company: e.target.value })}
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label className={labelClassName}>Street Address *</label>
                        <input
                          type="text"
                          required
                          value={shipping.address}
                          onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label className={labelClassName}>Apartment, Suite, etc.</label>
                        <input
                          type="text"
                          value={shipping.address2}
                          onChange={(e) => setShipping({ ...shipping, address2: e.target.value })}
                          className={inputClassName}
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className={labelClassName}>City *</label>
                          <input
                            type="text"
                            required
                            value={shipping.city}
                            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className={labelClassName}>State/Province *</label>
                          <input
                            type="text"
                            required
                            value={shipping.state}
                            onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                            className={inputClassName}
                          />
                        </div>
                        <div>
                          <label className={labelClassName}>ZIP/Postal Code *</label>
                          <input
                            type="text"
                            required
                            value={shipping.zip}
                            onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                            className={inputClassName}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClassName}>Country *</label>
                        <select
                          value={shipping.country}
                          onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                          className={inputClassName}
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                          <option>Germany</option>
                          <option>France</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Secure Payment Notice */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Secure Payment
                  </h2>

                  <div className="p-4 bg-secondary/30 rounded-lg flex items-center gap-3">
                    <Lock className="w-5 h-5 text-green-500" />
                    <span className="font-body text-sm text-muted-foreground">
                      Payment is processed securely through Stripe with 256-bit SSL encryption.
                      You'll be redirected to complete payment after submitting your order.
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-6">
                  {/* Deal Progress */}
                  <DealProgress />

                  {/* Buyer Protection */}
                  <div
                    onClick={() => setBuyerProtection(!buyerProtection)}
                    className={`bg-card border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      buyerProtection
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          buyerProtection
                            ? "border-foreground bg-foreground"
                            : "border-border"
                        }`}
                      >
                        {buyerProtection && <Check className="w-4 h-4 text-background" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-foreground" />
                          <span className="font-heading font-semibold text-foreground">
                            Buyer Protection
                          </span>
                        </div>
                        <p className="font-body text-sm text-muted-foreground mb-3">
                          Guarantee your order arrives safely. Full refund or replacement if your 
                          products are damaged, lost, or don't arrive.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-2xl font-bold text-foreground">
                            ${BUYER_PROTECTION_COST.toFixed(2)}
                          </span>
                          <span className="font-body text-xs text-green-500 font-medium">
                            RECOMMENDED
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Summary
                    </h2>

                    {/* Items */}
                    <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="font-body text-muted-foreground truncate flex-1 mr-2">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-heading text-foreground">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between font-body">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">{formatCurrency(subtotal)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between font-body text-green-500">
                          <span>{currentTier?.name} Discount</span>
                          <span>-{formatCurrency(discount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between font-body">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className={freeShipping ? "text-green-500" : "text-foreground"}>
                          {freeShipping ? "FREE" : formatCurrency(shippingCost)}
                        </span>
                      </div>

                      {buyerProtection && (
                        <div className="flex justify-between font-body">
                          <span className="text-muted-foreground">Buyer Protection</span>
                          <span className="text-foreground">{formatCurrency(protectionCost)}</span>
                        </div>
                      )}

                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-heading font-semibold text-foreground">Total</span>
                        <span className="font-heading text-2xl font-bold text-foreground">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full mt-6 gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>

                    <p className="font-body text-xs text-muted-foreground text-center mt-4">
                      By placing this order, you agree to our{" "}
                      <Link to="/terms" className="underline hover:text-foreground">
                        Terms of Service
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
