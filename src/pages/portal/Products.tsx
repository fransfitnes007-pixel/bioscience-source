import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Info, Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type CatalogRow = {
  id: string;
  sku: string;
  product_name: string;
  display_name: string;
  specification: string | null;
  strength: string | null;
  vials_per_kit: number;
  sort_order: number;
  tier_id: string;
  vial_quantity: number;
  market_price_cents: number;
  our_price_cents: number;
  discount_percent: number;
};

type Product = {
  id: string;
  sku: string;
  productName: string;
  displayName: string;
  specification: string | null;
  strength: string | null;
  tiers: {
    tierId: string;
    vials: number;
    marketPrice: number;
    ourPrice: number;
    discount: number;
  }[];
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const PortalProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isB2B, isAdmin, isLoading: authLoading } = useAuth();

  const [rows, setRows] = useState<CatalogRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_b2b_catalog");
      if (cancelled) return;
      if (error) {
        toast({ title: "Could not load catalog", description: error.message, variant: "destructive" });
        setRows([]);
      } else {
        setRows((data as CatalogRow[]) ?? []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [toast]);

  const products: Product[] = useMemo(() => {
    if (!rows) return [];
    const map = new Map<string, Product>();
    for (const r of rows) {
      let p = map.get(r.id);
      if (!p) {
        p = {
          id: r.id,
          sku: r.sku,
          productName: r.product_name,
          displayName: r.display_name,
          specification: r.specification,
          strength: r.strength,
          tiers: [],
        };
        map.set(r.id, p);
      }
      p.tiers.push({
        tierId: r.tier_id,
        vials: r.vial_quantity,
        marketPrice: r.market_price_cents / 100,
        ourPrice: r.our_price_cents / 100,
        discount: Number(r.discount_percent),
      });
    }
    for (const p of map.values()) p.tiers.sort((a, b) => a.vials - b.vials);
    return Array.from(map.values());
  }, [rows]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.productName.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleAdd = async (p: Product) => {
    const vials = selectedTier[p.id] ?? p.tiers[0]?.vials ?? 10;
    if (vials < 10) {
      toast({
        title: "Minimum 10 vials",
        description: "B2B wholesale orders require a minimum of 10 vials. For smaller orders, please use a regular B2C customer account.",
        variant: "destructive",
      });
      return;
    }
    const tier = p.tiers.find((t) => t.vials === vials);
    if (!tier) return;
    await addToCart({
      productId: p.id,
      productName: p.displayName,
      variationId: tier.tierId,
      variationName: `${tier.vials} vials · wholesale`,
      quantity: 1,
      price: tier.ourPrice,
    });
    toast({ title: "Added to cart", description: `${p.displayName} — ${tier.vials} vial kit` });
  };

  if (authLoading) {
    return <PortalLayout><div className="p-8 text-muted-foreground">Loading…</div></PortalLayout>;
  }

  if (!isB2B && !isAdmin) {
    return (
      <PortalLayout>
        <Card className="max-w-xl mx-auto mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Wholesale access required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>The wholesale catalog is only available to approved B2B accounts.</p>
            <p>For retail orders under 10 vials, please use a standard customer account.</p>
            <Button onClick={() => navigate("/products")}>Browse retail products</Button>
          </CardContent>
        </Card>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Wholesale Catalog</h1>
            <p className="text-muted-foreground">
              Partner pricing · 20% below market · 10 vial minimum per product
            </p>
          </div>
          <Button onClick={() => navigate("/cart")}>
            <ShoppingCart className="mr-2 h-4 w-4" /> View Cart
          </Button>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0" />
          <p>
            Minimum order quantity: <strong className="text-foreground">10 vials per product</strong>. Each price shown is the
            <strong className="text-foreground"> total</strong> for that vial kit — not per vial.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, peptide, or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading wholesale catalog…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No products found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => {
              const chosen = selectedTier[p.id] ?? p.tiers[0]?.vials ?? 10;
              const tier = p.tiers.find((t) => t.vials === chosen) ?? p.tiers[0];
              return (
                <Card key={p.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-tight">{p.displayName}</CardTitle>
                      <Badge variant="outline" className="text-[10px]">{p.sku}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.specification}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {p.tiers.map((t) => (
                        <button
                          key={t.tierId}
                          onClick={() => setSelectedTier((s) => ({ ...s, [p.id]: t.vials }))}
                          className={`rounded-md border p-2 text-center text-xs transition ${
                            chosen === t.vials
                              ? "border-foreground bg-foreground/5"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <div className="font-medium">{t.vials} vials</div>
                          <div className="text-muted-foreground">{formatPrice(t.ourPrice)}</div>
                        </button>
                      ))}
                    </div>

                    {tier && (
                      <div className="flex items-baseline justify-between border-t border-border pt-3">
                        <div>
                          <div className="text-2xl font-bold">{formatPrice(tier.ourPrice)}</div>
                          <div className="text-xs text-muted-foreground">
                            <span className="line-through">{formatPrice(tier.marketPrice)}</span>
                            <span className="ml-2 text-foreground">20% off market</span>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleAdd(p)}>
                          <ShoppingCart className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default PortalProducts;
