import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Row = {
  id: string;
  sku: string;
  product_name: string;
  display_name: string;
  specification: string | null;
  strength: string | null;
  vials_per_kit: number;
  internal_buy_cost_cents: number;
  is_active: boolean;
  b2b_enabled: boolean;
  sort_order: number;
  tier_id: string | null;
  vial_quantity: number | null;
  market_price_cents: number | null;
  our_price_cents: number | null;
  discount_percent: number | null;
  internal_profit_cents: number | null;
  profit_margin_percent: number | null;
};

const dollars = (cents: number | null) =>
  cents == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

const B2BPricing = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("admin_get_b2b_catalog");
      if (error) {
        toast({ title: "Could not load", description: error.message, variant: "destructive" });
        setRows([]);
      } else {
        setRows((data as Row[]) ?? []);
      }
      setLoading(false);
    })();
  }, [toast]);

  const grouped = useMemo(() => {
    if (!rows) return [];
    const map = new Map<string, { product: Row; tiers: Row[] }>();
    for (const r of rows) {
      let g = map.get(r.id);
      if (!g) {
        g = { product: r, tiers: [] };
        map.set(r.id, g);
      }
      if (r.tier_id) g.tiers.push(r);
    }
    const list = Array.from(map.values());
    if (!q.trim()) return list;
    const needle = q.toLowerCase();
    return list.filter(
      (g) =>
        g.product.display_name.toLowerCase().includes(needle) ||
        g.product.product_name.toLowerCase().includes(needle) ||
        g.product.sku.toLowerCase().includes(needle)
    );
  }, [rows, q]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">B2B Wholesale Pricing</h1>
          <p className="text-muted-foreground text-sm">
            Internal cost &amp; profit data — admin only. Customers never see these numbers.
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or SKU…"
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : (
          <div className="grid gap-4">
            {grouped.map(({ product, tiers }) => (
              <Card key={product.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{product.display_name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{product.specification}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline">{product.sku}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Buy cost (10v): <strong className="text-foreground">{dollars(product.internal_buy_cost_cents)}</strong>
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {[10, 20, 30].map((v) => {
                      const t = tiers.find((x) => x.vial_quantity === v);
                      return (
                        <div key={v} className="rounded-md border border-border p-3">
                          <div className="font-semibold mb-2">{v} vials</div>
                          <dl className="space-y-1">
                            <div className="flex justify-between"><dt className="text-muted-foreground">Market</dt><dd>{dollars(t?.market_price_cents ?? null)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Our price</dt><dd className="font-medium">{dollars(t?.our_price_cents ?? null)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Profit</dt><dd className="text-emerald-500">{dollars(t?.internal_profit_cents ?? null)}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Margin</dt><dd>{t?.profit_margin_percent != null ? `${Number(t.profit_margin_percent).toFixed(1)}%` : "—"}</dd></div>
                          </dl>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default B2BPricing;
