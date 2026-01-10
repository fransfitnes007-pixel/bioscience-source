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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { sessionId, orderNumber } = await req.json();

    if (!sessionId && !orderNumber) {
      throw new Error("Session ID or Order Number is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    let paymentStatus = "pending";
    let paymentSucceeded = false;

    if (sessionId) {
      // Verify session with Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === "paid") {
        paymentStatus = "paid";
        paymentSucceeded = true;
      } else if (session.payment_status === "unpaid") {
        paymentStatus = "failed";
      }

      // Update order if we have metadata
      if (session.metadata?.order_id) {
        const { error } = await supabaseClient
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

    // Get order details if orderNumber provided
    let order = null;
    if (orderNumber) {
      const { data, error } = await supabaseClient
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("order_number", orderNumber)
        .single();

      if (!error) {
        order = data;
      }
    }

    return new Response(JSON.stringify({
      success: paymentSucceeded,
      paymentStatus,
      order,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
