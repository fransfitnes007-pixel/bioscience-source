import { supabase } from "@/integrations/supabase/client";

export const formatCents = (cents: number | null | undefined) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((cents || 0) / 100);

export const formatNumber = (n: number | null | undefined) =>
  new Intl.NumberFormat("en-US").format(n || 0);

export async function getCurrentAffiliate() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data } = await supabase
    .from("affiliates")
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();
  return data;
}

export function generateShortSlug(prefix?: string) {
  const rand = Math.random().toString(36).slice(2, 8);
  return prefix ? `${prefix}-${rand}` : rand;
}
