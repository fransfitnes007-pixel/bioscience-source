import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Search, Tag, Plus } from "lucide-react";

interface ProductRow {
  id: string;
  display_name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  category_name: string;
  variations_count: number;
}

const TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*, product_categories(name), product_variations(id)")
        .order("sort_order", { ascending: true });

      if (data) {
        setProducts(data.map((p: any) => ({
          id: p.id,
          display_name: p.display_name,
          slug: p.slug,
          image_url: p.image_url,
          is_active: p.is_active ?? true,
          category_name: p.product_categories?.name || "Uncategorized",
          variations_count: p.product_variations?.length || 0,
        })));
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p => {
    if (activeTab === "active" && !p.is_active) return false;
    if (activeTab === "draft" && p.is_active) return false;
    if (searchQuery) return p.display_name.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Products</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
              Export
            </Button>
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
              Import
            </Button>
            <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" /> Add product
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex divide-x divide-[#e1e3e5]">
            <div className="px-5 py-4 flex items-center gap-3">
              <span className="text-sm text-foreground">📅 30 days</span>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-muted-foreground">Total products</p>
              <p className="text-lg font-semibold text-foreground">{products.length}</p>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-lg font-semibold text-foreground">{products.filter(p => p.is_active).length}</p>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="text-sm text-muted-foreground">Draft</p>
              <p className="text-lg font-semibold text-foreground">{products.filter(p => !p.is_active).length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0 border-b border-border">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? "border-[#202223] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">+</button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-9 pl-8 pr-3 w-[220px] rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Tag className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No products found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 w-10"><Checkbox /></th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Product</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Variants</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr
                    key={product.id}
                    className="border-b border-border hover:bg-secondary cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/products/${product.slug}`)}
                  >
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                      <Checkbox />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-border bg-secondary overflow-hidden flex items-center justify-center shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Tag className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-medium text-foreground">{product.display_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {product.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {product.variations_count} variant{product.variations_count !== 1 ? "s" : ""}
                    </td>
                    <td className="py-3 px-4 text-foreground">{product.category_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
