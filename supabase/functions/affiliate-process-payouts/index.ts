// Admin-only: scans approved conversions past hold period, groups by affiliate,
// and creates queued payouts when the eligible balance meets the threshold.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Verify admin
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Auth required" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
    });
  }
  const token = authHeader.replace("Bearer ", "");
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: userData } = await userClient.auth.getUser(token);
  if (!userData?.user) {
    return new Response(JSON.stringify({ error: "Auth required" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
    });
  }
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Admin only" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403,
    });
  }

  try {
    const { data: settings } = await supabase
      .from("affiliate_program_settings")
      .select("minimum_payout_cents")
      .eq("id", 1)
      .maybeSingle();
    const minimumDefault = settings?.minimum_payout_cents ?? 5000;

    // Group eligible conversions per affiliate
    const { data: conversions, error: cErr } = await supabase
      .from("affiliate_conversions")
      .select("id, affiliate_id, commission_cents")
      .eq("status", "approved")
      .is("payout_id", null)
      .lte("hold_until", new Date().toISOString());
    if (cErr) throw cErr;

    const grouped = new Map<string, { ids: string[]; total: number }>();
    for (const c of conversions ?? []) {
      const g = grouped.get(c.affiliate_id) ?? { ids: [], total: 0 };
      g.ids.push(c.id);
      g.total += c.commission_cents ?? 0;
      grouped.set(c.affiliate_id, g);
    }

    const results: any[] = [];
    for (const [affiliateId, g] of grouped.entries()) {
      const { data: aff } = await supabase
        .from("affiliates")
        .select("id, payout_threshold_cents, payout_method_id")
        .eq("id", affiliateId)
        .maybeSingle();
      const threshold = aff?.payout_threshold_cents ?? minimumDefault;
      if (g.total < threshold) {
        results.push({ affiliateId, skipped: true, total: g.total, threshold });
        continue;
      }

      const { data: method } = aff?.payout_method_id
        ? await supabase.from("payout_methods").select("id, method").eq("id", aff.payout_method_id).maybeSingle()
        : { data: null };

      const { data: payout, error: pErr } = await supabase
        .from("affiliate_payouts")
        .insert({
          affiliate_id: affiliateId,
          payout_method_id: aff?.payout_method_id ?? null,
          method: method?.method ?? "stripe",
          amount_cents: g.total,
          net_amount_cents: g.total,
          conversion_ids: g.ids,
          status: "queued",
          scheduled_for: new Date().toISOString(),
        })
        .select()
        .single();
      if (pErr) throw pErr;

      await supabase
        .from("affiliate_conversions")
        .update({ status: "paid", payout_id: payout.id, paid_at: new Date().toISOString() })
        .in("id", g.ids);

      results.push({ affiliateId, payoutId: payout.id, amount: g.total });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[process-payouts] error", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});
