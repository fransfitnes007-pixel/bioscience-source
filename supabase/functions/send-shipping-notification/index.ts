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

    // Send email via Resend
    if (resendApiKey) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Your Order Has Shipped!</h1>
          </div>
          
          <p>Hi ${order.billing_first_name},</p>
          
          <p>Great news! Your order <strong>#${order.order_number}</strong> is on its way.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Shipping Details</h3>
            <p><strong>Carrier:</strong> ${carrierDisplay}</p>
            ${tracking_number ? `<p><strong>Tracking Number:</strong> ${tracking_number}</p>` : ""}
            ${deliveryText}
            
            ${trackingUrl ? `
              <a href="${trackingUrl}" 
                 style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; 
                        text-decoration: none; border-radius: 4px; margin-top: 10px;">
                Track Your Package
              </a>
            ` : ""}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Items Shipped</h3>
            <ul style="padding-left: 20px;">
              ${itemsList}
            </ul>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Shipping Address</h3>
            <p style="margin: 0;">
              ${order.shipping_first_name || order.billing_first_name} ${order.shipping_last_name || order.billing_last_name}<br>
              ${order.shipping_address || order.billing_address}<br>
              ${order.shipping_city || order.billing_city}, ${order.shipping_state || order.billing_state} ${order.shipping_zip || order.billing_zip}<br>
              ${order.shipping_country || order.billing_country}
            </p>
          </div>
          
          <p>If you have any questions about your shipment, please don't hesitate to contact us.</p>
          
          <p>Thank you for your order!</p>
          
          <p style="color: #666;">
            Best regards,<br>
            The Resurrected Team
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            This email was sent regarding order #${order.order_number}.
            If you didn't place this order, please contact us immediately.
          </p>
        </div>
      `;

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Resurrected <noreply@resurrected.com>",
          to: [order.billing_email],
          subject: `Your Order #${order.order_number} Has Shipped!`,
          html: emailHtml,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Resend error:", errorText);
      }

      // Log the email
      await supabaseClient.from("email_logs").insert({
        email_type: "shipping_notification",
        recipient_email: order.billing_email,
        recipient_name: `${order.billing_first_name} ${order.billing_last_name}`,
        subject: `Your Order #${order.order_number} Has Shipped!`,
        status: emailResponse.ok ? "sent" : "failed",
        sent_at: emailResponse.ok ? new Date().toISOString() : null,
        metadata: {
          order_id,
          order_number: order.order_number,
          carrier,
          tracking_number,
        },
      });
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
