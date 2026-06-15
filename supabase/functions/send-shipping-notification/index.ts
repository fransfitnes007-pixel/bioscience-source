import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRACKING_URLS: Record<string, string> = {
  ups: "https://www.ups.com/track?tracknum=",
  fedex: "https://www.fedex.com/fedextrack/?tracknumbers=",
  usps: "https://tools.usps.com/go/TrackConfirmAction?tLabels=",
  dhl: "https://www.dhl.com/us-en/home/tracking.html?tracking-id=",
  other: "",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // Authenticate the request - require admin or supplier role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin or supplier
    const { data: roles, error: rolesError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .in("role", ["admin", "supplier"]);

    if (rolesError || !roles || roles.length === 0) {
      return new Response(
        JSON.stringify({ error: "Admin or supplier access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { order_id, items_shipped, carrier, tracking_number, estimated_delivery } = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "Order ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch order details (including customer email)
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch order items
    const { data: orderItems } = await supabaseClient
      .from("order_items")
      .select("product_name, variation_name, quantity")
      .eq("order_id", order_id);

    // Build tracking link
    const carrierKey = carrier?.toLowerCase() || "other";
    const trackingBaseUrl = TRACKING_URLS[carrierKey] || "";
    const trackingUrl = tracking_number && trackingBaseUrl 
      ? `${trackingBaseUrl}${tracking_number}` 
      : null;

    // Format carrier name for display
    const carrierDisplay = carrier ? carrier.toUpperCase() : "Carrier";

    // Format items list
    const itemsList = (items_shipped || orderItems || [])
      .map((item: { product_name: string; variation_name?: string; quantity: number }) => {
        const variation = item.variation_name ? ` (${item.variation_name})` : "";
        return `<li>${item.product_name}${variation} x ${item.quantity}</li>`;
      })
      .join("");

    // Format estimated delivery
    const deliveryText = estimated_delivery 
      ? `<p><strong>Estimated Delivery:</strong> ${new Date(estimated_delivery).toLocaleDateString("en-US", { 
          weekday: "long", 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        })}</p>`
      : "";

    // Send branded shipping update via Lovable Emails (idempotent per tracking number)
    try {
      const itemsForEmail = (items_shipped || orderItems || []).map((it: any) => ({
        name: it.product_name,
        variation: it.variation_name ?? undefined,
        quantity: it.quantity,
      }));

      const estimatedDeliveryStr = estimated_delivery
        ? new Date(estimated_delivery).toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
          })
        : undefined;

      const idempotencyKey = `shipping-update-${order_id}-${tracking_number || "no-track"}`;

      const { error: emailErr } = await supabaseClient.functions.invoke(
        "send-transactional-email",
        {
          body: {
            templateName: "shipping-update",
            recipientEmail: order.billing_email,
            idempotencyKey,
            templateData: {
              recipientName: order.billing_first_name || "Researcher",
              orderNumber: order.order_number,
              carrier: carrierDisplay,
              trackingNumber: tracking_number || "",
              trackingUrl: trackingUrl || "https://resurrectedlabz.com",
              estimatedDelivery: estimatedDeliveryStr,
              items: itemsForEmail,
            },
          },
        },
      );

      // Log the email
      await supabaseClient.from("email_logs").insert({
        email_type: "shipping_notification",
        recipient_email: order.billing_email,
        recipient_name: `${order.billing_first_name} ${order.billing_last_name}`,
        subject: `Your Order #${order.order_number} Has Shipped!`,
        status: emailErr ? "failed" : "sent",
        sent_at: emailErr ? null : new Date().toISOString(),
        metadata: { order_id, order_number: order.order_number, carrier, tracking_number },
      });
    } catch (e) {
      console.warn("shipping-update email send failed", e);
    }

    // Log activity
    await supabaseClient.from("order_activity_log").insert({
      order_id,
      action: "shipping_notification_sent",
      details: {
        carrier,
        tracking_number,
        estimated_delivery,
        items_count: (items_shipped || orderItems || []).length,
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Shipping notification sent" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error: unknown) {
    console.error("Error sending shipping notification:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process shipping notification" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
