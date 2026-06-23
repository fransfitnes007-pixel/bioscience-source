import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface B2BTier {
  tierId: string;
  vials: number;
  priceCents: number;
  marketPriceCents: number;
  discountPercent: number;
}

export interface B2BPricingMap {
  /** key: `${productName.toLowerCase()}|${strength.toLowerCase()}` */
  byKey: Map<string, B2BTier[]>;
  loading: boolean;
}

const normalizeStrength = (s: string) => s.toLowerCase().replace(/\s+/g, "");
const keyFor = (name: string, strength: string) =>
  `${name.toLowerCase().trim()}|${normalizeStrength(strength)}`;

export const useB2BPricing = (): B2BPricingMap => {
  const { isB2B, isLoading, isRoleLoading } = useAuth();
  const [byKey, setByKey] = useState<Map<string, B2BTier[]>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading || isRoleLoading || !isB2B) {
      setByKey(new Map());
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase.rpc("get_b2b_catalog");
      if (cancelled) return;
      if (error || !data) {
        setByKey(new Map());
        setLoading(false);
        return;
      }
      const map = new Map<string, B2BTier[]>();
      for (const row of data as Array<{
        product_name: string;
        strength: string | null;
        tier_id: string;
        vial_quantity: number;
        market_price_cents: number;
        our_price_cents: number;
        discount_percent: number;
      }>) {
        if (!row.strength) continue;
        const k = keyFor(row.product_name, row.strength);
        const tier: B2BTier = {
          tierId: row.tier_id,
          vials: row.vial_quantity,
          priceCents: row.our_price_cents,
          marketPriceCents: row.market_price_cents,
          discountPercent: Number(row.discount_percent ?? 0),
        };
        const list = map.get(k) ?? [];
        list.push(tier);
        map.set(k, list);
      }
      for (const list of map.values()) list.sort((a, b) => a.vials - b.vials);
      setByKey(map);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isB2B, isLoading, isRoleLoading]);

  return { byKey, loading };
};

export const lookupB2BTiers = (
  map: Map<string, B2BTier[]>,
  productName: string,
  productDisplayName: string,
  strength: string,
): B2BTier[] | null => {
  return (
    map.get(keyFor(productName, strength)) ??
    map.get(keyFor(productDisplayName, strength)) ??
    null
  );
};
