import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Search, Tag, Plus, TrendingUp, DollarSign, Package } from "lucide-react";
import { productCategories } from "@/lib/products-data";
import pricingData from "@/lib/products-pricing.json";

interface PricingVariant {
  sku: string;
  size: string;
  cost: number;
  price: number;
  profit: number;
  margin: number;
}

interface Row {
  productName: string;
  displayName: string;
  slug: string;
  categoryName: string;
  sku: string;
  size: string;
  cost: number;
  price: number;
  profit: number;
  margin: number;
}

// Map our static catalog slug -> JSON product name
const slugToJsonName: Record<string, string> = {
  "glp1-sema": "Semaglutide", "glp1-triz": "Tirzepatide", "glp3-reta": "Retatrutide",
  "cagrilintide": "Cagrilintide", "mazdutide": "Mazdutide", "survodutide": "Survodutide",
  "bpc-157": "BPC-157", "tb500": "TB-500", "thymosin-alpha-1": "Thymosin Alpha-1",
  "ss-31": "SS-31", "thymalin": "Thymalin", "epithalon": "Epitalon", "aod": "AOD-9604",
  "bpc-157-tb500": "BPC + TB Blend", "semax": "Semax", "selank": "Selank", "dsip": "DSIP",
  "pinealon": "Pinealon", "tesamorelin": "Tesamorelin",
  "cjc-1295-ipa": "CJC-1295 Without DAC + Ipamorelin", "cjc-1295-no-dac": "CJC-1295 No DAC",
  "sermorelin": "Sermorelin", "ipamorelin": "Ipamorelin", "hexarelin": "Hexarelin Acetate",
  "ghrp-6": "GHRP-6 Acetate", "igf-1-lr3": "IGF-1LR3", "hgh-somatropin": "HGH 191AA Somatropin",
  "hcg": "HCG", "kisspeptin-10": "KissPeptin-10", "mt-2": "MT-2", "pt-141": "PT-141",
  "ghk-cu": "GHK-CU", "snap-8": "Snap-8", "kpv": "KPV", "ll-37": "LL37",
  "lemon-bottle": "Lemon Bottle", "l-carnitine": "L-Carnitine", "glutathione": "Glutathione",
  "nad": "NAD+", "5-amino-1mq": "5-amino-1mq", "mots-c": "MOTs-c", "slu-pp-322": "SLU-PP-322",
  "vip-5mg": "Vasoactive Intestinal Peptide", "glow-stack": "Glow Stack",
  "klow-stack": "CU50 + TB10 + BC10 + KPV10", "bac-water": "Bacteriostatic Water",
};

const norm = (s: string) => {
  const m = s.match(/([\d.]+)\s*(mg|iu|ml)/i);
  return m ? `${m[1]}${m[2].toLowerCase()}` : s.trim().toLowerCase();
};

const fmt = (n: number) => `$${n.toFixed(2)}`;

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const rows = useMemo<Row[]>(() => {
    const jsonByName = new Map<string, PricingVariant[]>(
      (pricingData as any).products.map((p: any) => [p.product, p.variants])
    );
    const out: Row[] = [];
    for (const cat of productCategories) {
      for (const p of cat.products) {
        const jsonName = slugToJsonName[p.slug];
        const variants = jsonName ? jsonByName.get(jsonName) || [] : [];
        p.variations.forEach((v, idx) => {
          const matched =
            variants.find((jv) => norm(jv.size) === norm(v.strength)) || variants[idx];
          const price = matched?.price ?? v.price ?? 0;
          const cost = matched?.cost ?? 0;
          const profit = matched?.profit ?? (price - cost);
          const margin = matched?.margin ?? (price > 0 ? (profit / price) * 100 : 0);
          out.push({
            productName: p.name,
            displayName: p.displayName,
            slug: p.slug,
            categoryName: cat.name,
            sku: matched?.sku ?? "—",
            size: v.strength,
            cost,
            price,
            profit,
            margin,
          });
        });
      }
    }
    return out;
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(rows.map((r) => r.categoryName))),
    [rows]
  );

  const filtered = rows.filter((r) => {
    if (categoryFilter !== "all" && r.categoryName !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.displayName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        r.size.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totals = useMemo(() => {
    const productSlugs = new Set(filtered.map((r) => r.slug));
    const totalRevenue = filtered.reduce((s, r) => s + r.price, 0);
    const totalCost = filtered.reduce((s, r) => s + r.cost, 0);
    const totalProfit = filtered.reduce((s, r) => s + r.profit, 0);
    const avgMargin =
      filtered.length > 0
        ? filtered.reduce((s, r) => s + r.margin, 0) / filtered.length
        : 0;
    return {
      products: productSlugs.size,
      variants: filtered.length,
      totalRevenue,
      totalCost,
      totalProfit,
      avgMargin,
    };
  }, [filtered]);

  const marginClass = (m: number) =>
    m >= 90
      ? "text-green-400"
      : m >= 80
      ? "text-green-300"
      : m >= 70
      ? "text-yellow-400"
      : m >= 60
      ? "text-orange-400"
      : "text-red-400";

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Products</h1>
            <span className="text-sm text-muted-foreground">
              · {rows.length} variants across {new Set(rows.map((r) => r.slug)).size} products
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-card border-border text-foreground hover:bg-secondary"
              onClick={() => {
                const csv = [
                  ["Product", "SKU", "Size", "Category", "Cost", "Price", "Profit", "Margin %"],
                  ...rows.map((r) => [
                    r.displayName,
                    r.sku,
                    r.size,
                    r.categoryName,
                    r.cost.toFixed(2),
                    r.price.toFixed(2),
                    r.profit.toFixed(2),
                    r.margin.toFixed(2),
                  ]),
                ]
                  .map((row) => row.map((c) => `"${c}"`).join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "products-pricing.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </Button>
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
              <Plus className="h-4 w-4 mr-1" /> Add product
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Package className="h-3.5 w-3.5" /> Products
            </div>
            <p className="text-lg font-semibold text-foreground">{totals.products}</p>
            <p className="text-xs text-muted-foreground">{totals.variants} variants</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <DollarSign className="h-3.5 w-3.5" /> Revenue (sum)
            </div>
            <p className="text-lg font-semibold text-foreground">{fmt(totals.totalRevenue)}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <DollarSign className="h-3.5 w-3.5" /> Cost (sum)
            </div>
            <p className="text-lg font-semibold text-foreground">{fmt(totals.totalCost)}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="h-3.5 w-3.5" /> Profit (sum)
            </div>
            <p className="text-lg font-semibold text-green-400">{fmt(totals.totalProfit)}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="h-3.5 w-3.5" /> Avg margin
            </div>
            <p className={`text-lg font-semibold ${marginClass(totals.avgMargin)}`}>
              {totals.avgMargin.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                categoryFilter === "all"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  categoryFilter === c
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, SKU, size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-8 pr-3 w-[260px] rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Tag className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left bg-secondary/30">
                    <th className="py-3 px-4 text-muted-foreground font-medium">Product</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">SKU</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">Size</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">Category</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium text-right">Cost</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium text-right">Price</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium text-right">Profit</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium text-right">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={`${r.slug}-${r.sku}-${i}`}
                      className="border-b border-border hover:bg-secondary/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground">{r.displayName}</div>
                        <div className="text-xs text-muted-foreground">{r.productName}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{r.sku}</td>
                      <td className="py-3 px-4 text-foreground">{r.size}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{r.categoryName}</td>
                      <td className="py-3 px-4 text-right text-muted-foreground">{fmt(r.cost)}</td>
                      <td className="py-3 px-4 text-right text-foreground font-medium">{fmt(r.price)}</td>
                      <td className="py-3 px-4 text-right text-green-400 font-medium">{fmt(r.profit)}</td>
                      <td className={`py-3 px-4 text-right font-semibold ${marginClass(r.margin)}`}>
                        {r.margin.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
