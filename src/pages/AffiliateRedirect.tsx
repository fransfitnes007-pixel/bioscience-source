import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Cookie helper
const setCookie = (name: string, value: string, days: number) => {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
};

const getOrSetVisitorId = () => {
  const match = document.cookie.match(/(?:^|; )rl_vid=([^;]+)/);
  if (match) return match[1];
  const id = crypto.randomUUID();
  setCookie("rl_vid", id, 365);
  return id;
};

const AffiliateRedirect = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    (async () => {
      if (!slug) return (window.location.href = "/");

      const { data: link } = await supabase
        .from("tracking_links")
        .select("id, affiliate_id, code_id, destination_url, active, utm_source, utm_medium, utm_campaign, utm_content")
        .eq("short_slug", slug)
        .maybeSingle();

      if (!link || !link.active) {
        window.location.href = "/";
        return;
      }

      const visitorId = getOrSetVisitorId();

      // First-party 90-day affiliate attribution cookie
      setCookie("rl_aff", link.affiliate_id, 90);
      if (link.code_id) setCookie("rl_code", link.code_id, 90);
      setCookie("rl_link", link.id, 90);

      // Record click (fire-and-forget; no PII)
      const ua = navigator.userAgent;
      const device = /Mobi|Android/i.test(ua) ? "mobile" : /Tablet|iPad/i.test(ua) ? "tablet" : "desktop";
      await supabase.from("affiliate_clicks").insert({
        affiliate_id: link.affiliate_id,
        code_id: link.code_id,
        link_id: link.id,
        visitor_id: visitorId,
        referrer: document.referrer || null,
        landing_page: link.destination_url,
        device_type: device,
        user_agent_hash: btoa(ua).slice(0, 32),
        utm_source: link.utm_source,
        utm_medium: link.utm_medium,
        utm_campaign: link.utm_campaign,
        utm_content: link.utm_content,
      });

      // Increment counter (best-effort; non-atomic, fine for v1)
      try { await (supabase.rpc as any)("increment_link_clicks", { p_link_id: link.id }); } catch {}

      // Append UTM to destination
      const dest = new URL(link.destination_url, window.location.origin);
      if (link.utm_source) dest.searchParams.set("utm_source", link.utm_source);
      if (link.utm_medium) dest.searchParams.set("utm_medium", link.utm_medium);
      if (link.utm_campaign) dest.searchParams.set("utm_campaign", link.utm_campaign);
      if (link.utm_content) dest.searchParams.set("utm_content", link.utm_content);
      dest.searchParams.set("aff", link.affiliate_id);
      window.location.href = dest.toString();
    })();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Redirecting…</p>
    </div>
  );
};

export default AffiliateRedirect;
