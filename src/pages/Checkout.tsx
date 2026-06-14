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
  Tags,
  FileImage,
  Upload,
  Smartphone,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import LogoUploader from "@/components/shared/LogoUploader";
import SignatureModal from "@/components/agreements/SignatureModal";
import { LegalPopup } from "@/components/LegalPopup";

// Buyer protection pricing scales with order tier
const getBuyerProtectionCost = (tierNumber: number | undefined): number => {
  if (!tierNumber) return 30; // Base price
  switch (tierNumber) {
    case 1: return 30;   // $2k tier
    case 2: return 60;   // $5k tier
    case 3: return 120;  // $10k tier
    case 4: return 240;  // $20k tier
    case 5: return 480;  // $50k tier
    case 6: return 960;  // $100k tier
    default: return 30;
  }
};

interface ShippingRate {
  carrier: string;
  service: string;
  label: string;
  cost: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  recommended: boolean;
  freeShipping?: boolean;
  freeShippingReason?: string | null;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, currentTier, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(2);

  // Form state
  const [buyerProtection, setBuyerProtection] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [customLabeling, setCustomLabeling] = useState(false);
  const [customLabelingLogoUrl, setCustomLabelingLogoUrl] = useState<string | null>(null);
  const [savedLogoUrl, setSavedLogoUrl] = useState<string | null>(null);
  const [useSavedLogo, setUseSavedLogo] = useState(false);
  const [appSubscription, setAppSubscription] = useState(false);
  const APP_SUBSCRIPTION_COST = 19;
  const [orderTempId] = useState(() => crypto.randomUUID());

  // Checkout terms signature gate
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsSig, setTermsSig] = useState<{ initials: string; signedAt: string } | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [legalPopup, setLegalPopup] = useState<"terms" | "privacy" | null>(null);

  // Shipping rate state
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  
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

  // Check auth and fetch saved logo
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in or create an account to complete your purchase");
        navigate("/account");
        return;
      }
      setUserId(session.user.id);
      setBilling(prev => ({ ...prev, email: session.user.email || "" }));

      // Fetch profile to check for saved logo
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_logo_url')
        .eq('user_id', session.user.id)
        .single();

      if (profile?.company_logo_url) {
        setSavedLogoUrl(profile.company_logo_url);
      }
    });
  }, [navigate]);

  // Fetch shipping rates when address/items change
  useEffect(() => {
    const destCountry = sameAsBilling ? billing.country : shipping.country;
    const destState = sameAsBilling ? billing.state : shipping.state;
    const destZip = sameAsBilling ? billing.zip : shipping.zip;
    const destCity = sameAsBilling ? billing.city : shipping.city;

    // Only fetch if we have minimum address info
    if (!destCountry || items.length === 0) return;

    const fetchRates = async () => {
      setIsLoadingShipping(true);
      try {
        const { data, error } = await supabase.functions.invoke("calculate-shipping", {
          body: {
            items: items.map(item => ({
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
            })),
            destination: {
              country: destCountry,
              state: destState,
              zip: destZip,
              city: destCity,
            },
            subtotal,
          },
        });

        if (error) throw error;

        if (data?.rates) {
          setShippingRates(data.rates);
          // Auto-select recommended rate
          const recommended = data.recommended;
          if (recommended) {
            setSelectedShippingRate(recommended);
            setSelectedCarrier(recommended.service);
          }
        }
      } catch (err) {
        console.error("Failed to fetch shipping rates:", err);
        // Fallback to flat rate
        setSelectedShippingRate({
          carrier: "USPS",
          service: "usps_priority",
          label: "Standard Shipping",
          cost: 25.00,
          estimatedDaysMin: 3,
          estimatedDaysMax: 7,
          recommended: true,
        });
      } finally {
        setIsLoadingShipping(false);
      }
    };

    const debounce = setTimeout(fetchRates, 500);
    return () => clearTimeout(debounce);
  }, [billing.country, billing.state, billing.zip, billing.city, shipping.country, shipping.state, shipping.zip, shipping.city, sameAsBilling, items, subtotal]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      navigate("/cart");
    }
  }, [items, navigate, isSubmitting]);

  // Check if current tier is BOGO
  const isBogo = currentTier?.rewardType === "bogo_shipping" || 
                 currentTier?.rewardType === "bogo_shipping_next_order";

  // Calculate totals with proper tier alignment
  const getDiscount = () => {
    if (!currentTier) return 0;
    
    // Percentage discounts (tiers 1-4)
    if (currentTier.rewardType === "percentage_discount" && currentTier.rewardValue) {
      return subtotal * (currentTier.rewardValue / 100);
    }
    if (currentTier.rewardType === "percentage_discount_shipping" && currentTier.rewardValue) {
      return subtotal * (currentTier.rewardValue / 100);
    }
    
    // BOGO tiers (5-6) - the "discount" is effectively the full subtotal (customer gets double for free)
    // But we don't charge extra, so no monetary discount shown - value is in the doubled items
    if (isBogo) {
      return 0; // BOGO value shown in items, not as discount
    }
    
    return 0;
  };

  const discount = getDiscount();
  const freeShipping = currentTier?.rewardType === "percentage_discount_shipping" || 
                       currentTier?.rewardType === "bogo_shipping" ||
                       currentTier?.rewardType === "bogo_shipping_next_order";
  const shippingCost = freeShipping ? 0 : (selectedShippingRate?.freeShipping ? 0 : (selectedShippingRate?.cost ?? 25.00));
  const buyerProtectionCost = getBuyerProtectionCost(currentTier?.tierNumber);
  const protectionCost = buyerProtection ? buyerProtectionCost : 0;
  const customLabelingCost = 0; // $0 for now as specified
  const appSubscriptionCost = appSubscription ? APP_SUBSCRIPTION_COST : 0;
  const total = subtotal - discount + shippingCost + protectionCost + customLabelingCost + appSubscriptionCost;

  // Get the logo URL to use for this order
  const getOrderLogoUrl = () => {
    if (!customLabeling) return null;
    if (useSavedLogo && savedLogoUrl) return savedLogoUrl;
    return customLabelingLogoUrl;
  };

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

    if (!termsSig) {
      toast.error("Please review and sign the Purchase Terms before continuing.");
      setShowTermsModal(true);
      return;
    }

    if (!agreedToTerms) {
      toast.error("You must agree to the Terms & Conditions and Privacy Policy to continue.");
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
          custom_labeling: customLabeling,
          custom_labeling_logo_url: getOrderLogoUrl(),
          custom_labeling_cost: customLabelingCost,
          app_subscription: appSubscription,
          app_subscription_cost: appSubscriptionCost,
          app_subscription_interval: 'month',
          fulfillment_carrier: selectedShippingRate?.carrier || null,
          estimated_delivery_date: selectedShippingRate ? 
            new Date(Date.now() + selectedShippingRate.estimatedDaysMax * 86400000).toISOString().split('T')[0] : null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Auto-create shipment record with selected carrier
      const shipmentNumber = `SHP-${Date.now().toString(36).toUpperCase()}`;
      await supabase.from("order_shipments").insert({
        order_id: order.id,
        shipment_number: shipmentNumber,
        status: "pending",
        carrier: selectedShippingRate?.carrier || "USPS",
        shipping_cost: shippingCost,
        estimated_delivery: selectedShippingRate ?
          new Date(Date.now() + selectedShippingRate.estimatedDaysMax * 86400000).toISOString().split('T')[0] : null,
        notes: `Auto-selected: ${selectedShippingRate?.label || "Standard Shipping"}`,
      });

      // Create order items - for BOGO, add both paid and free items
      const orderItems: any[] = [];
      
      items.forEach((item) => {
        // Add the paid item
        orderItems.push({
          order_id: order.id,
          product_id: item.productId || null,
          variation_id: item.variationId || null,
          product_name: item.productName,
          variation_name: item.variationName,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        });
        
        // For BOGO tiers, add the same item again as FREE
        if (isBogo) {
          orderItems.push({
            order_id: order.id,
            product_id: item.productId || null,
            variation_id: item.variationId || null,
            product_name: `${item.productName} (BOGO FREE)`,
            variation_name: item.variationName,
            quantity: item.quantity,
            unit_price: 0,
            total_price: 0,
          });
        }
      });

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

                {/* Vial Labeling Options */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Tags className="w-5 h-5" />
                    Vial Labeling Options
                  </h2>

                  <div className="space-y-4">
                    {/* Standard White Label */}
                    <div
                      onClick={() => {
                        setCustomLabeling(false);
                        setUseSavedLogo(false);
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        !customLabeling
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            !customLabeling
                              ? "border-foreground bg-foreground"
                              : "border-border"
                          }`}
                        >
                          {!customLabeling && <Check className="w-3 h-3 text-background" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-medium text-foreground">
                              Standard White Label
                            </span>
                            <span className="font-heading font-semibold text-foreground">FREE</span>
                          </div>
                          <p className="font-body text-sm text-muted-foreground mt-1">
                            Clean, professional blank white labels on your vials
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Custom Logo Labeling */}
                    <div
                      onClick={() => setCustomLabeling(true)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        customLabeling
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            customLabeling
                              ? "border-foreground bg-foreground"
                              : "border-border"
                          }`}
                        >
                          {customLabeling && <Check className="w-3 h-3 text-background" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-medium text-foreground">
                              Custom Logo Labeling
                            </span>
                            <span className="font-heading font-semibold text-foreground">$0.00</span>
                          </div>
                          <p className="font-body text-sm text-muted-foreground mt-1">
                            Your company logo on every vial
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Logo upload section (only visible when custom labeling is selected) */}
                    {customLabeling && (
                      <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-border space-y-4">
                        {savedLogoUrl && (
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={useSavedLogo}
                                onChange={(e) => {
                                  setUseSavedLogo(e.target.checked);
                                  if (e.target.checked) {
                                    setCustomLabelingLogoUrl(null);
                                  }
                                }}
                                className="w-4 h-4 rounded border-border"
                              />
                              <span className="font-body text-sm text-foreground">
                                Use my saved company logo
                              </span>
                            </label>
                            {useSavedLogo && (
                              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                                <div className="w-12 h-12 rounded border border-border overflow-hidden bg-secondary/30 flex items-center justify-center">
                                  {savedLogoUrl.toLowerCase().endsWith('.pdf') ? (
                                    <FileImage className="w-6 h-6 text-muted-foreground" />
                                  ) : (
                                    <img
                                      src={savedLogoUrl}
                                      alt="Saved logo"
                                      className="w-full h-full object-contain p-1"
                                    />
                                  )}
                                </div>
                                <span className="font-body text-sm text-foreground">
                                  Your saved logo will be used
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {(!savedLogoUrl || !useSavedLogo) && (
                          <div className="space-y-3">
                            <p className="font-heading text-sm font-medium text-foreground">
                              {savedLogoUrl ? "Or upload a different logo for this order:" : "Upload your company logo:"}
                            </p>
                            {userId && (
                              <LogoUploader
                                bucketPath={`orders/${orderTempId}`}
                                existingLogoUrl={customLabelingLogoUrl}
                                onUploadComplete={(url) => setCustomLabelingLogoUrl(url)}
                                onRemove={() => setCustomLabelingLogoUrl(null)}
                                compact
                              />
                            )}
                            <p className="font-body text-xs text-muted-foreground">
                              PNG or PDF • Transparent background required
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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

                  {/* App Subscription Add-on */}
                  <div
                    onClick={() => setAppSubscription(!appSubscription)}
                    className={`relative bg-card border rounded-xl p-6 cursor-pointer transition-all duration-500 overflow-hidden ${
                      appSubscription
                        ? "border-foreground bg-foreground/[0.04]"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <div className="absolute top-3 right-3">
                      <span className="font-body text-[9px] uppercase tracking-[0.25em] text-foreground/60 border border-border px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                          appSubscription
                            ? "border-foreground bg-foreground"
                            : "border-border"
                        }`}
                      >
                        {appSubscription && <Check className="w-3.5 h-3.5 text-background" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <img src={peptidezLogo.url} alt="Peptidez App" className="w-6 h-6 object-contain" />
                          <span className="font-display text-xl text-foreground leading-tight">
                            Peptidez App Access
                          </span>
                        </div>
                        <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">
                          Lifetime dosage protocols, cycle tracking, and a private community of researchers — delivered as a deep-link to your phone.
                        </p>
                        <ul className="space-y-1.5 mb-4">
                          {[
                            "Personalized protocol library",
                            "Cycle & reconstitution tracker",
                            "Members-only research notes",
                          ].map((b) => (
                            <li key={b} className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                              <Sparkles className="w-3 h-3 text-foreground/60" strokeWidth={1.5} />
                              {b}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-baseline justify-between border-t border-border/40 pt-3">
                          <div>
                            <span className="font-display text-2xl text-foreground">
                              ${APP_SUBSCRIPTION_COST}
                            </span>
                            <span className="font-body text-xs text-muted-foreground ml-1">/ month</span>
                          </div>
                          <span className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            Cancel anytime
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

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
                            ${buyerProtectionCost.toFixed(2)}
                          </span>
                          <span className="font-body text-xs text-emerald-500 font-medium">
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
                        <div key={item.id}>
                          <div className="flex justify-between text-sm">
                            <span className="font-body text-muted-foreground truncate flex-1 mr-2">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="font-heading text-foreground">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                          {/* Show BOGO bonus item */}
                          {isBogo && (
                            <div className="flex justify-between text-sm mt-1 pl-4">
                              <span className="font-body text-emerald-500 truncate flex-1 mr-2">
                                + {item.productName} × {item.quantity} (BOGO FREE)
                              </span>
                              <span className="font-heading text-emerald-500">
                                FREE
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between font-body">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">{formatCurrency(subtotal)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between font-body text-emerald-500">
                          <span>{currentTier?.name} Discount</span>
                          <span>-{formatCurrency(discount)}</span>
                        </div>
                      )}

                      {isBogo && (
                        <div className="flex justify-between font-body text-emerald-500">
                          <span>🎁 {currentTier?.name} BOGO Bonus</span>
                          <span>+{items.reduce((sum, item) => sum + item.quantity, 0)} FREE items</span>
                        </div>
                      )}

                      <div className="flex justify-between font-body">
                        <div className="text-muted-foreground">
                          <span>Shipping</span>
                          {selectedShippingRate && !freeShipping && (
                            <p className="text-xs mt-0.5">
                              {selectedShippingRate.label} ({selectedShippingRate.estimatedDaysMin}-{selectedShippingRate.estimatedDaysMax} days)
                            </p>
                          )}
                          {(freeShipping || selectedShippingRate?.freeShipping) && (
                            <p className="text-xs text-emerald-500 mt-0.5">
                              {selectedShippingRate?.freeShippingReason || "Free with your tier!"}
                            </p>
                          )}
                          {isLoadingShipping && (
                            <p className="text-xs mt-0.5">Calculating...</p>
                          )}
                        </div>
                        <span className={freeShipping || selectedShippingRate?.freeShipping ? "text-emerald-500" : "text-foreground"}>
                          {freeShipping || selectedShippingRate?.freeShipping ? "FREE" : formatCurrency(shippingCost)}
                        </span>
                      </div>

                      {buyerProtection && (
                        <div className="flex justify-between font-body">
                          <span className="text-muted-foreground">Buyer Protection</span>
                          <span className="text-foreground">{formatCurrency(protectionCost)}</span>
                        </div>
                      )}

                      {appSubscription && (
                        <div className="flex justify-between font-body">
                          <span className="text-muted-foreground">App Access (monthly)</span>
                          <span className="text-foreground">{formatCurrency(appSubscriptionCost)}</span>
                        </div>
                      )}

                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-heading font-semibold text-foreground">Total</span>
                        <span className="font-heading text-2xl font-bold text-foreground">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>

                    <div className={`mt-6 rounded-lg border p-4 ${termsSig ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-secondary/20"}`}>
                      {termsSig ? (
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-heading text-sm font-semibold text-foreground">
                              Purchase Terms signed
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Initialed <span className="font-display tracking-widest">{termsSig.initials}</span> on {new Date(termsSig.signedAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowTermsModal(true)}
                            className="text-xs underline text-muted-foreground hover:text-foreground"
                          >
                            Re-sign
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="font-heading text-sm font-semibold text-foreground">
                              Sign the Purchase Terms to continue
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Required before payment. Click I Agree and initial.
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="hero"
                            onClick={() => setShowTermsModal(true)}
                          >
                            Review & Sign
                          </Button>
                        </div>
                      )}
                    </div>

                    <label className={`mt-4 flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${agreedToTerms ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-secondary/20 hover:border-foreground/30"}`}>
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-border accent-foreground"
                      />
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        By checking this box, I acknowledge and agree to the{" "}
                        <button
                          type="button"
                          onClick={() => setLegalPopup("terms")}
                          className="underline text-foreground hover:opacity-80"
                        >
                          Terms &amp; Conditions
                        </button>
                        ,{" "}
                        <button
                          type="button"
                          onClick={() => setLegalPopup("privacy")}
                          className="underline text-foreground hover:opacity-80"
                        >
                          Privacy Policy
                        </button>
                        , and confirm that all products are sold strictly for laboratory research use only — not for human or animal consumption. I am 21 years of age or older. I understand all sales are final with no refunds, returns, exchanges, or cancellations. I assume all risks associated with purchase, handling, storage, and use of products.
                      </span>
                    </label>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full mt-4 gap-2"
                      disabled={isSubmitting || !termsSig || !agreedToTerms}
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

                    <SignatureModal
                      open={showTermsModal}
                      onOpenChange={setShowTermsModal}
                      type="purchaser_terms"
                      signerName={`${billing.firstName} ${billing.lastName}`.trim()}
                      signerEmail={billing.email}
                      onSigned={(sig) => setTermsSig({ initials: sig.initials, signedAt: sig.signedAt })}
                      ctaLabel="Sign Purchase Terms"
                    />

                    <p className="font-body text-xs text-muted-foreground text-center mt-4">
                      By placing this order, you agree to our{" "}
                      <button
                        type="button"
                        onClick={() => setLegalPopup("terms")}
                        className="underline hover:text-foreground"
                      >
                        Terms of Service
                      </button>
                    </p>

                    {legalPopup && (
                      <LegalPopup
                        type={legalPopup}
                        onClose={() => setLegalPopup(null)}
                      />
                    )}
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
