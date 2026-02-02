import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Create client with user's auth token for RLS-aware queries
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user authentication
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const userId = userData.user.id;

    const { sessionId, orderNumber } = await req.json();

    if (!sessionId && !orderNumber) {
      return new Response(
        JSON.stringify({ error: "Session ID or Order Number is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    let paymentStatus = "pending";
    let paymentSucceeded = false;

    // Create a service role client for updating order (bypasses RLS for admin operations)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (sessionId) {
      // Verify session with Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === "paid") {
        paymentStatus = "paid";
        paymentSucceeded = true;
      } else if (session.payment_status === "unpaid") {
        paymentStatus = "failed";
      }

      // Update order if we have metadata - but first verify user owns the order
      if (session.metadata?.order_id) {
        // Verify the order belongs to this user
        const { data: orderCheck, error: orderCheckError } = await supabaseClient
          .from("orders")
          .select("id, user_id")
          .eq("id", session.metadata.order_id)
          .eq("user_id", userId)
          .single();

        if (orderCheckError || !orderCheck) {
          return new Response(
            JSON.stringify({ error: "Order not found or access denied" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
          );
        }

        // Use admin client to update the order
        const { error } = await supabaseAdmin
          .from("orders")
          .update({
            payment_status: paymentStatus,
            status: paymentSucceeded ? "confirmed" : "pending",
            paid_at: paymentSucceeded ? new Date().toISOString() : null,
            stripe_customer_id: session.customer as string || null,
          })
          .eq("id", session.metadata.order_id);

        if (error) {
          console.error("Failed to update order:", error);
        }
      }
    }

    // Get order details - RLS will ensure user can only access their own orders
    let order = null;
    if (orderNumber) {
      const { data, error } = await supabaseClient
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          payment_status,
          subtotal,
          discount_amount,
          discount_tier,
          shipping_cost,
          buyer_protection,
          buyer_protection_cost,
          total,
          billing_email,
          billing_first_name,
          billing_last_name,
          created_at,
          order_items (
            id,
            product_name,
            variation_name,
            quantity,
            unit_price,
            total_price
          )
        `)
        .eq("order_number", orderNumber)
        .eq("user_id", userId)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: "Order not found or access denied" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      order = data;
    }

    return new Response(JSON.stringify({
      success: paymentSucceeded,
      paymentStatus,
      order,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Verify payment error:", error);
    // Return generic error message to avoid leaking internal details
    return new Response(JSON.stringify({ error: "Payment verification failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
