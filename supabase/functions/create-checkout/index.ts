import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CheckoutRequest {
  orderId: string;
  successUrl?: string;
  cancelUrl?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Create client with user's auth for RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData?.user?.email) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const user = userData.user;
    const { orderId, successUrl, cancelUrl } = await req.json() as CheckoutRequest;

    // Input validation
    if (!orderId || typeof orderId !== "string") {
      return new Response(
        JSON.stringify({ error: "Valid order ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      return new Response(
        JSON.stringify({ error: "Invalid order ID format" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get order details - RLS ensures user can only access their own orders
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .select(`*, order_items (*)`)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Verify order belongs to the authenticated user
    if (order.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Prevent double payment
    if (order.payment_status === "paid") {
      return new Response(
        JSON.stringify({ error: "Order has already been paid" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Payment service unavailable" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 503 }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    let customerId: string | undefined;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // SECURITY: Re-derive unit prices from canonical product_variations rows
    // rather than trusting client-supplied unit_price stored on order_items.
    const supabaseAdminForPricing = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const variationIds = Array.from(
      new Set(
        (order.order_items as Array<{ variation_id: string | null }>)
          .map((it) => it.variation_id)
          .filter((v): v is string => !!v)
      )
    );

    let canonicalByVariation = new Map<string, number>();
    let canonicalByProductStrength = new Map<string, number>();

    if (variationIds.length > 0) {
      const { data: variations, error: varErr } = await supabaseAdminForPricing
        .from("product_variations")
        .select("id, product_id, strength, price")
        .in("id", variationIds);
      if (varErr) {
        console.error("Failed to load product_variations for pricing:", varErr);
        return new Response(
          JSON.stringify({ error: "Failed to verify pricing" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      for (const v of variations || []) {
        canonicalByVariation.set(v.id, Number(v.price ?? 0));
        canonicalByProductStrength.set(
          `${v.product_id}::${(v.strength || "").toLowerCase().trim()}`,
          Number(v.price ?? 0)
        );
      }
    }

    // For items without variation_id, look up by product_id + variation_name (strength)
    const fallbackProductIds = Array.from(
      new Set(
        (order.order_items as Array<{ variation_id: string | null; product_id: string | null }>)
          .filter((it) => !it.variation_id && it.product_id)
          .map((it) => it.product_id!)
      )
    );
    if (fallbackProductIds.length > 0) {
      const { data: vars2 } = await supabaseAdminForPricing
        .from("product_variations")
        .select("id, product_id, strength, price")
        .in("product_id", fallbackProductIds);
      for (const v of vars2 || []) {
        const key = `${v.product_id}::${(v.strength || "").toLowerCase().trim()}`;
        if (!canonicalByProductStrength.has(key)) {
          canonicalByProductStrength.set(key, Number(v.price ?? 0));
        }
      }
    }

    // Build line items using canonical prices only. BOGO-FREE rows ($0) are kept
    // only when they match a canonical $0 line; never trust client unit_price > 0.
    const lineItems: any[] = [];
    for (const item of order.order_items as Array<any>) {
      let canonicalPrice: number | undefined;
      if (item.variation_id && canonicalByVariation.has(item.variation_id)) {
        canonicalPrice = canonicalByVariation.get(item.variation_id);
      } else if (item.product_id) {
        const key = `${item.product_id}::${(item.variation_name || "").toLowerCase().trim()}`;
        canonicalPrice = canonicalByProductStrength.get(key);
      }
      if (canonicalPrice === undefined) {
        // Allow $0 BOGO-FREE items written by checkout (no product mapping available)
        if (Number(item.unit_price) === 0) continue;
        console.error("No canonical price for order item", { id: item.id, name: item.product_name });
        return new Response(
          JSON.stringify({ error: "Pricing mismatch — please refresh your cart" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      if (canonicalPrice <= 0) continue;
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product_name,
            description: item.variation_name || undefined,
          },
          unit_amount: Math.round(canonicalPrice * 100),
        },
        quantity: item.quantity,
      });
    }

    // Add shipping if applicable
    if (order.shipping_cost && order.shipping_cost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: "Standard shipping",
          },
          unit_amount: Math.round(order.shipping_cost * 100),
        },
        quantity: 1,
      });
    }

    // Add buyer protection if applicable
    if (order.buyer_protection && order.buyer_protection_cost && order.buyer_protection_cost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Buyer Protection",
            description: "Full refund or replacement guarantee",
          },
          unit_amount: Math.round(order.buyer_protection_cost * 100),
        },
        quantity: 1,
      });
    }

    // Calculate discount
    const discountAmount = order.discount_amount || 0;
    
    let discounts: any[] = [];
    if (discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discountAmount * 100),
        currency: "usd",
        duration: "once",
        name: order.discount_tier || "Order Discount",
      });
      discounts = [{ coupon: coupon.id }];
    }

    // Validate redirect URLs - only allow same origin or known domains
    const origin = req.headers.get("origin") || "https://resurrected.com";
    const safeSuccessUrl = successUrl && successUrl.startsWith(origin) 
      ? successUrl 
      : `${origin}/order-confirmation?order=${order.order_number}&session_id={CHECKOUT_SESSION_ID}`;
    const safeCancelUrl = cancelUrl && cancelUrl.startsWith(origin)
      ? cancelUrl
      : `${origin}/checkout?order=${orderId}`;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email!,
      line_items: lineItems,
      mode: "payment",
      discounts,
      success_url: safeSuccessUrl,
      cancel_url: safeCancelUrl,
      metadata: {
        order_id: orderId,
        order_number: order.order_number,
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR"],
      },
    });

    // Update order with Stripe session ID using admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin
      .from("orders")
      .update({
        stripe_payment_intent_id: session.id,
        stripe_customer_id: customerId || null,
      })
      .eq("id", orderId);

    // Log security audit
    await supabaseAdmin.from("security_audit_log").insert({
      user_id: user.id,
      action: "checkout_created",
      resource_type: "order",
      resource_id: orderId,
      metadata: { order_number: order.order_number, total: order.total },
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    
    let clientMessage = "Failed to create checkout session";
    let statusCode = 500;
    
    if (error.message?.includes("not authenticated") || error.message?.includes("email not available")) {
      clientMessage = "Authentication required";
      statusCode = 401;
    } else if (error.message?.includes("not found")) {
      clientMessage = "Order not found";
      statusCode = 404;
    } else if (error.message?.includes("required")) {
      clientMessage = "Invalid request";
      statusCode = 400;
    }
    
    return new Response(JSON.stringify({ error: clientMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: statusCode,
    });
  }
});
