// Stripe webhook: records affiliate conversions from completed checkout sessions.
// Public endpoint - relies on Stripe signature verification.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeKey) {
    return new Response(JSON.stringify({ error: "Stripe not configured" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  let event: Stripe.Event;
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    if (webhookSecret && sig) {
      event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    } else {
      // Fallback for manual testing — accept raw JSON
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400,
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(supabase, stripe, session);
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      await handleRefund(supabase, charge);
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[stripe-webhook] handler error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});

async function handleCheckoutCompleted(supabase: any, stripe: Stripe, session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {};
  const visitorId = meta.rl_visitor_id || meta.visitor_id;
  const affiliateIdMeta = meta.rl_aff || meta.affiliate_id;
  const codeIdMeta = meta.rl_code || meta.code_id;
  const linkIdMeta = meta.rl_link || meta.link_id;
  const discountCode = (meta.discount_code || "").toUpperCase();

  // Resolve affiliate via metadata or discount code
  let affiliateId = affiliateIdMeta ?? null;
  let codeId = codeIdMeta ?? null;
  let commissionRate = 0.15;

  if (!affiliateId && discountCode) {
    const { data: code } = await supabase
      .from("affiliate_codes")
      .select("id, affiliate_id")
      .eq("code", discountCode)
      .eq("active", true)
      .maybeSingle();
    if (code) {
      affiliateId = code.affiliate_id;
      codeId = code.id;
    }
  }

  if (!affiliateId) {
    console.log("[stripe-webhook] no affiliate attribution");
    return;
  }

  // Pull rate from affiliate (custom or tier-based)
  const { data: aff } = await supabase
    .from("affiliates")
    .select("id, tier, custom_commission_rate")
    .eq("id", affiliateId)
    .maybeSingle();

  if (aff?.custom_commission_rate) {
    commissionRate = Number(aff.custom_commission_rate);
  } else if (aff?.tier) {
    const { data: tier } = await supabase
      .from("commission_tiers")
      .select("commission_rate")
      .eq("tier", aff.tier)
      .maybeSingle();
    if (tier) commissionRate = Number(tier.commission_rate);
  }

  const gross = session.amount_subtotal ?? session.amount_total ?? 0;
  const discount = (session.total_details?.amount_discount as number | undefined) ?? 0;
  const net = session.amount_total ?? gross;
  const commission = Math.round(net * commissionRate);

  // Hold period from settings
  const { data: settings } = await supabase
    .from("affiliate_program_settings")
    .select("default_hold_period_days, auto_approve_commissions")
    .eq("id", 1)
    .maybeSingle();
  const holdDays = settings?.default_hold_period_days ?? 30;
  const holdUntil = new Date(Date.now() + holdDays * 86400_000).toISOString();
  const status = settings?.auto_approve_commissions ? "approved" : "pending";

  const { error } = await supabase.from("affiliate_conversions").insert({
    affiliate_id: affiliateId,
    code_id: codeId,
    link_id: linkIdMeta,
    visitor_id: visitorId,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
    stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
    customer_email: session.customer_email ?? session.customer_details?.email ?? null,
    order_id: meta.order_id ?? null,
    gross_amount_cents: gross,
    discount_amount_cents: discount,
    net_amount_cents: net,
    commission_rate_used: commissionRate,
    commission_cents: commission,
    status,
    hold_until: holdUntil,
    approved_at: status === "approved" ? new Date().toISOString() : null,
  });

  if (error) {
    console.error("[stripe-webhook] conversion insert error", error);
    throw error;
  }

  // Mark click as converted if visitor known
  if (visitorId) {
    await supabase
      .from("affiliate_clicks")
      .update({ converted: true })
      .eq("affiliate_id", affiliateId)
      .eq("visitor_id", visitorId)
      .eq("converted", false);
  }

  console.log(`[stripe-webhook] conversion recorded: aff=${affiliateId} commission=${commission}`);
}

async function handleRefund(supabase: any, charge: Stripe.Charge) {
  const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!pi) return;
  await supabase
    .from("affiliate_conversions")
    .update({
      status: "refunded",
      refunded_at: new Date().toISOString(),
      refund_reason: charge.refunds?.data?.[0]?.reason ?? "stripe_refund",
    })
    .eq("stripe_payment_intent_id", pi);
}
