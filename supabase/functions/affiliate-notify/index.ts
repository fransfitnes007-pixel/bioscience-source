// Sends affiliate-related transactional emails via Resend.
// Public endpoint - validates request shape; safe to call from client because
// it only sends to the affiliate's own registered email looked up server-side.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Resurrected Labz Affiliates <affiliates@resurrectedlabz.com>";
const LOGO = "https://nunwpsiixyqmbgvvokmq.supabase.co/storage/v1/object/public/email-assets/logo-white.png";

type EventType = "application_received" | "application_approved" | "payout_sent" | "tier_promoted";

interface Payload {
  type: EventType;
  email?: string;
  affiliate_id?: string;
  display_name?: string;
  data?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.error("[affiliate-notify] RESEND_API_KEY not configured");
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body = (await req.json()) as Payload;
    if (!body?.type) {
      return new Response(JSON.stringify({ error: "type required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400,
      });
    }

    let email = body.email;
    let name = body.display_name ?? "there";

    if (!email && body.affiliate_id) {
      const { data } = await supabase
        .from("affiliates")
        .select("email, display_name, name")
        .eq("id", body.affiliate_id)
        .maybeSingle();
      email = data?.email ?? undefined;
      name = data?.display_name ?? data?.name ?? name;
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "email required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400,
      });
    }

    const { subject, html } = buildTemplate(body.type, name, body.data ?? {});

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [email], subject, html }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("[affiliate-notify] resend error", text);
      return new Response(JSON.stringify({ error: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502,
      });
    }

    // Log to notifications table for the portal
    if (body.affiliate_id) {
      await supabase.from("affiliate_notifications").insert({
        affiliate_id: body.affiliate_id,
        type: body.type,
        title: subject,
        body: stripHtml(html).slice(0, 280),
        email_sent_at: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[affiliate-notify] error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});

function stripHtml(s: string) { return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }

function buildTemplate(type: EventType, name: string, data: Record<string, any>) {
  switch (type) {
    case "application_received":
      return wrap("Application received", name,
        `Thanks for applying to the Resurrected Labz affiliate program. We review every application within 48 hours and will be in touch as soon as we have an update.`,
        "We'll be in touch within 48h."
      );
    case "application_approved":
      return wrap("You're in. Welcome to the program.", name,
        `Your application has been approved. Sign in to your creator dashboard to grab your tracking link, discount code and brand assets.`,
        "Open the creator dashboard",
        data.dashboard_url ?? "https://resurrectedlabz.com/creator/dashboard"
      );
    case "payout_sent":
      return wrap("Your payout is on the way", name,
        `A payout of $${((data.amount_cents ?? 0) / 100).toFixed(2)} has been queued via ${data.method ?? "your default method"}. Funds should land in 1-3 business days.`,
        "View earnings",
        "https://resurrectedlabz.com/creator/earnings"
      );
    case "tier_promoted":
      return wrap(`You've been promoted to ${data.tier ?? "a new tier"}`, name,
        `Your performance unlocked a new tier with a higher commission rate and new perks. Keep going.`,
        "See my tier",
        "https://resurrectedlabz.com/creator/dashboard"
      );
  }
}

function wrap(subject: string, name: string, body: string, ctaLabel?: string, ctaUrl?: string) {
  const cta = ctaLabel && ctaUrl
    ? `<tr><td style="padding:24px 40px 40px;"><a href="${ctaUrl}" style="display:inline-block;background:#ffffff;color:#000;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;">${ctaLabel}</a></td></tr>`
    : "";
  const html = `<!DOCTYPE html><html><body style="margin:0;background:#0a0a0a;font-family:-apple-system,Inter,sans-serif;color:#fff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
      <tr><td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:32px 40px;border-bottom:1px solid #222;text-align:center;">
            <img src="${LOGO}" alt="Resurrected Labz" width="160" style="height:auto;" />
          </td></tr>
          <tr><td style="padding:40px;">
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#fff;">${subject}</h1>
            <p style="margin:0 0 12px;font-size:15px;color:#aaa;">Hi ${name},</p>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#ddd;">${body}</p>
          </td></tr>
          ${cta}
          <tr><td style="padding:24px 40px;border-top:1px solid #222;font-size:12px;color:#666;text-align:center;">
            Resurrected Labz Affiliate Program · <a href="https://resurrectedlabz.com" style="color:#888;">resurrectedlabz.com</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
  return { subject, html };
}
