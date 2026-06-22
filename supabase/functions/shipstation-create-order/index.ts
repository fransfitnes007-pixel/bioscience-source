// Creates a ShipStation order after a Stripe payment succeeds.
// Invoked server-side from `verify-payment`. Not exposed for direct client use.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHIP_FROM = {
  name: Deno.env.get("SHIP_FROM_NAME") || "Resurrected Labz",
  street1: Deno.env.get("SHIP_FROM_STREET1") || "1 Warehouse Way",
  city: Deno.env.get("SHIP_FROM_CITY") || "Miami",
  state: Deno.env.get("SHIP_FROM_STATE") || "FL",
  postalCode: Deno.env.get("SHIP_FROM_POSTAL_CODE") || "33101",
  country: Deno.env.get("SHIP_FROM_COUNTRY") || "US",
  phone: Deno.env.get("SHIP_FROM_PHONE") || "",
};

const COUNTRY_ISO: Record<string, string> = {
  "United States": "US", USA: "US", US: "US",
  Canada: "CA", "United Kingdom": "GB", Australia: "AU",
  Germany: "DE", France: "FR",
};
const toIso = (c?: string | null) => (c ? COUNTRY_ISO[c] || (c.length === 2 ? c.toUpperCase() : "US") : "US");

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Internal-only: require service role key in header OR called from another function
    const internalKey = req.headers.get("x-internal-key");
    const expected = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!internalKey || internalKey !== expected) {
      return new Response(JSON.stringify({ error: "Forbidden" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
    }

    const apiKey = Deno.env.get("SHIPSTATION_API_KEY");
    const apiSecret = Deno.env.get("SHIPSTATION_API_SECRET");
    if (!apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: "ShipStation not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 503 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();
    if (error || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 });
    }

    // Idempotency: skip if already pushed
    if (order.shipstation_order_id) {
      return new Response(JSON.stringify({ ok: true, alreadyCreated: true, shipstationOrderId: order.shipstation_order_id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    }

    const shipSame = order.shipping_same_as_billing !== false;
    const ship = {
      name: `${(shipSame ? order.billing_first_name : order.shipping_first_name) || ""} ${(shipSame ? order.billing_last_name : order.shipping_last_name) || ""}`.trim(),
      company: (shipSame ? order.billing_company : order.shipping_company) || null,
      street1: shipSame ? order.billing_address : order.shipping_address,
      street2: (shipSame ? order.billing_address_2 : order.shipping_address_2) || null,
      city: shipSame ? order.billing_city : order.shipping_city,
      state: shipSame ? order.billing_state : order.shipping_state,
      postalCode: shipSame ? order.billing_zip : order.shipping_zip,
      country: toIso(shipSame ? order.billing_country : order.shipping_country),
      phone: order.billing_phone || null,
    };

    const bill = {
      name: `${order.billing_first_name || ""} ${order.billing_last_name || ""}`.trim(),
      company: order.billing_company || null,
      street1: order.billing_address,
      street2: order.billing_address_2 || null,
      city: order.billing_city,
      state: order.billing_state,
      postalCode: order.billing_zip,
      country: toIso(order.billing_country),
      phone: order.billing_phone || null,
    };

    // Map service code -> ShipStation carrierCode + serviceCode
    const service: string = order.fulfillment_service || "usps_priority_mail";
    let carrierCode = "stamps_com";
    if (service.startsWith("ups")) carrierCode = "ups";
    else if (service.startsWith("fedex")) carrierCode = "fedex";

    const items = (order.order_items || []).map((it: any) => ({
      lineItemKey: it.id,
      sku: it.product_id ? String(it.product_id) : it.product_name,
      name: it.product_name,
      quantity: it.quantity,
      unitPrice: Number(it.unit_price || 0),
      options: it.variation_name ? [{ name: "Variation", value: it.variation_name }] : [],
    }));

    // Rough total weight (oz): 5oz per unit + 8oz packaging
    const totalUnits = (order.order_items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0);
    const weightOz = Math.max(16, totalUnits * 5 + 8);

    const ssOrder = {
      orderNumber: order.order_number,
      orderKey: order.id,
      orderDate: new Date(order.created_at || Date.now()).toISOString(),
      paymentDate: order.paid_at || new Date().toISOString(),
      orderStatus: "awaiting_shipment",
      customerUsername: order.billing_email,
      customerEmail: order.billing_email,
      billTo: bill,
      shipTo: ship,
      items,
      amountPaid: Number(order.total || 0),
      taxAmount: Number(order.tax_amount || 0),
      shippingAmount: Number(order.shipping_cost || 0),
      customerNotes: order.notes || null,
      internalNotes: order.internal_notes || null,
      requestedShippingService: service,
      carrierCode,
      serviceCode: service,
      packageCode: "package",
      confirmation: "none",
      weight: { value: weightOz, units: "ounces" },
      advancedOptions: {
        storeId: Deno.env.get("SHIPSTATION_STORE_ID") ? Number(Deno.env.get("SHIPSTATION_STORE_ID")) : undefined,
        customField1: order.discount_code || null,
      },
    };

    const auth = "Basic " + btoa(`${apiKey}:${apiSecret}`);
    const resp = await fetch("https://ssapi.shipstation.com/orders/createorder", {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(ssOrder),
    });

    const txt = await resp.text();
    if (!resp.ok) {
      console.error("ShipStation createorder failed", resp.status, txt);
      return new Response(JSON.stringify({ error: "ShipStation order creation failed", status: resp.status, detail: txt }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 });
    }

    const created = JSON.parse(txt);
    await supabase
      .from("orders")
      .update({
        shipstation_order_id: String(created.orderId || ""),
        shipstation_order_key: created.orderKey || order.id,
        fulfillment_carrier: order.fulfillment_carrier || (carrierCode === "stamps_com" ? "USPS" : carrierCode.toUpperCase()),
      })
      .eq("id", order.id);

    return new Response(JSON.stringify({ ok: true, shipstationOrderId: created.orderId, orderNumber: created.orderNumber }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (e: any) {
    console.error("shipstation-create-order error", e);
    return new Response(JSON.stringify({ error: "Internal error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
