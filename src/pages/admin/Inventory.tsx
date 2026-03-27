import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Package, ChevronLeft, ChevronRight } from "lucide-react";

interface InventoryRow {
  product_name: string;
  variant_name: string;
  image_url: string | null;
  sku: string;
  unavailable: number;
  committed: number;
  available: number;
  on_hand: number;
  variation_id: string;
}

const PAGE_SIZE = 50;

const Inventory = () => {
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      const { data } = await supabase
        .from("product_variations")
        .select("id, strength, moq, price, product_id, products(display_name, image_url)")
        .order("product_id", { ascending: true });

      if (data) {
        setItems(
          data.map((v: any) => ({
            product_name: v.products?.display_name || "Unknown",
            variant_name: v.strength,
            image_url: v.products?.image_url || null,
            sku: "No SKU",
            unavailable: 0,
            committed: 0,
            available: v.moq || 0,
            on_hand: v.moq || 0,
            variation_id: v.id,
          }))
        );
      }
      setIsLoading(false);
    };
    fetchInventory();
  }, []);

  const filtered = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.product_name.toLowerCase().includes(q) || item.variant_name.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Inventory</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
              Export
            </Button>
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
              Import
            </Button>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0 border-b border-border">
            <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-foreground text-foreground">All</button>
            <button className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">+</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 pr-3 w-[220px] rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading inventory...</div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-4 w-10"><Checkbox /></th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">Product</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">SKU</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium text-center">Unavailable</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium text-center">Committed</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">Available</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium">On hand</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item) => (
                    <tr key={item.variation_id} className="border-b border-border hover:bg-secondary transition-colors">
                      <td className="py-3 px-4"><Checkbox /></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-border bg-secondary overflow-hidden flex items-center justify-center shrink-0">
                            {item.image_url ? (
                              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.product_name}</p>
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-[#e4e5e7] text-xs text-foreground">{item.variant_name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{item.sku}</td>
                      <td className="py-3 px-4 text-center text-foreground">{item.unavailable}</td>
                      <td className="py-3 px-4 text-center text-foreground">{item.committed}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          defaultValue={item.available}
                          className="w-20 h-8 px-2 rounded border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          defaultValue={item.on_hand}
                          className="w-20 h-8 px-2 rounded border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Inventory;
