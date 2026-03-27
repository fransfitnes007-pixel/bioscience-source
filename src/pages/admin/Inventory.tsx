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
            <Package className="h-5 w-5 text-[#202223]" />
            <h1 className="text-xl font-semibold text-[#202223]">Inventory</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
              Export
            </Button>
            <Button variant="outline" size="sm" className="bg-white border-[#c9cccf] text-[#202223] hover:bg-[#f6f6f7]">
              Import
            </Button>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0 border-b border-[#e1e3e5]">
            <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-[#202223] text-[#202223]">All</button>
            <button className="px-3 py-2.5 text-sm text-[#6d7175] hover:text-[#202223]">+</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6d7175]" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 pr-3 w-[220px] rounded-lg border border-[#c9cccf] bg-white text-sm text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e1e3e5] overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-[#6d7175]">Loading inventory...</div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e1e3e5] text-left">
                    <th className="py-3 px-4 w-10"><Checkbox /></th>
                    <th className="py-3 px-4 text-[#6d7175] font-medium">Product</th>
                    <th className="py-3 px-4 text-[#6d7175] font-medium">SKU</th>
                    <th className="py-3 px-4 text-[#6d7175] font-medium text-center">Unavailable</th>
                    <th className="py-3 px-4 text-[#6d7175] font-medium text-center">Committed</th>
                    <th className="py-3 px-4 text-[#6d7175] font-medium">Available</th>
                    <th className="py-3 px-4 text-[#6d7175] font-medium">On hand</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item) => (
                    <tr key={item.variation_id} className="border-b border-[#e1e3e5] hover:bg-[#f6f6f7] transition-colors">
                      <td className="py-3 px-4"><Checkbox /></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-[#e1e3e5] bg-[#f6f6f7] overflow-hidden flex items-center justify-center shrink-0">
                            {item.image_url ? (
                              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="h-4 w-4 text-[#b5b5b5]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#202223]">{item.product_name}</p>
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-[#e4e5e7] text-xs text-[#202223]">{item.variant_name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#6d7175]">{item.sku}</td>
                      <td className="py-3 px-4 text-center text-[#202223]">{item.unavailable}</td>
                      <td className="py-3 px-4 text-center text-[#202223]">{item.committed}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          defaultValue={item.available}
                          className="w-20 h-8 px-2 rounded border border-[#c9cccf] text-sm text-[#202223] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          defaultValue={item.on_hand}
                          className="w-20 h-8 px-2 rounded border border-[#c9cccf] text-sm text-[#202223] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#e1e3e5]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="p-1 rounded hover:bg-[#f1f1f1] disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="p-1 rounded hover:bg-[#f1f1f1] disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-[#6d7175]">
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
