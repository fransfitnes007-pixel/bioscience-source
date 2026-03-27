import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Search, Package, Image as ImageIcon } from "lucide-react";

interface ProductData {
  id: string;
  display_name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean | null;
  scientific_purpose: string | null;
  studies_findings: string | null;
  nih_link: string | null;
  coa_url: string | null;
  category_id: string;
  category_name: string;
}

interface Variation {
  id: string;
  strength: string;
  price: number | null;
  moq: number;
  sort_order: number | null;
}

const ProductEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [variantSearch, setVariantSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data: p } = await supabase
        .from("products")
        .select("*, product_categories(name)")
        .eq("slug", slug!)
        .single();

      if (p) {
        setProduct({
          id: p.id,
          display_name: p.display_name,
          slug: p.slug,
          description: p.description,
          image_url: p.image_url,
          is_active: p.is_active,
          scientific_purpose: p.scientific_purpose,
          studies_findings: p.studies_findings,
          nih_link: p.nih_link,
          coa_url: p.coa_url,
          category_id: p.category_id,
          category_name: (p as any).product_categories?.name || "Uncategorized",
        });

        const { data: vars } = await supabase
          .from("product_variations")
          .select("*")
          .eq("product_id", p.id)
          .order("sort_order", { ascending: true });

        if (vars) {
          setVariations(vars);
          setSelectedVariant(vars[0] || null);
        }
      }
      setIsLoading(false);
    };
    fetch();
  }, [slug]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground">Loading product...</div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground">Product not found</div>
      </AdminLayout>
    );
  }

  const filteredVariants = variations.filter((v) =>
    !variantSearch || v.strength.toLowerCase().includes(variantSearch.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate("/admin/products")} className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Products
          </button>
          <span>›</span>
          <span className="text-foreground font-medium">{product.display_name}</span>
          {selectedVariant && (
            <>
              <span>›</span>
              <span className="text-foreground font-semibold">{selectedVariant.strength}</span>
            </>
          )}
        </div>

        {/* Top actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">{product.display_name}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
              Duplicate
            </Button>
            <Button variant="outline" size="sm" className="bg-card border-border text-foreground hover:bg-secondary">
              More actions
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left sidebar - variant list */}
          <div className="col-span-3">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Product header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-border bg-secondary overflow-hidden flex items-center justify-center shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{product.display_name}</p>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${product.is_active ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                    {product.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Search variants */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search variants"
                    value={variantSearch}
                    onChange={(e) => setVariantSearch(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Variant count */}
              <div className="px-4 py-2 text-xs text-muted-foreground">
                {variations.length} variant{variations.length !== 1 ? 's' : ''}
              </div>

              {/* Variant list */}
              <ul className="divide-y divide-[#e1e3e5]">
                {filteredVariants.map((v) => (
                  <li key={v.id}>
                    <button
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                        selectedVariant?.id === v.id ? 'bg-[#f1f1f1]' : 'hover:bg-secondary'
                      }`}
                    >
                      <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground">{v.strength}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right content - variant detail */}
          <div className="col-span-9 space-y-4">
            {selectedVariant ? (
              <>
                {/* Image + Option */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <span className="text-foreground font-medium">{selectedVariant.strength}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Variant name</label>
                    <input
                      type="text"
                      defaultValue={selectedVariant.strength}
                      className="w-full h-10 px-3 rounded-lg border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <h2 className="font-semibold text-foreground">Price</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">$</span>
                    <input
                      type="number"
                      defaultValue={selectedVariant.price ?? 0}
                      step="0.01"
                      className="w-40 h-10 px-3 rounded-lg border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground">Compare-at</span>
                    <span className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground">Unit price</span>
                    <span className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground">Charge tax <strong>Yes</strong></span>
                    <span className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground">Cost per item <strong>$0.00</strong></span>
                  </div>
                </div>

                {/* Inventory */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Inventory</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Inventory tracked</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 text-muted-foreground font-medium">Locations</th>
                        <th className="py-2 text-muted-foreground font-medium text-center">Unavailable</th>
                        <th className="py-2 text-muted-foreground font-medium text-center">Committed</th>
                        <th className="py-2 text-muted-foreground font-medium">Available</th>
                        <th className="py-2 text-muted-foreground font-medium">On hand</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-3 text-foreground">Warehouse</td>
                        <td className="py-3 text-center text-foreground">0</td>
                        <td className="py-3 text-center text-foreground">0</td>
                        <td className="py-3">
                          <input
                            type="number"
                            defaultValue={selectedVariant.moq}
                            className="w-20 h-8 px-2 rounded border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            defaultValue={selectedVariant.moq}
                            className="w-20 h-8 px-2 rounded border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <a href="#" className="text-sm text-primary hover:underline">View adjustment history</a>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <span className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground">SKU</span>
                    <span className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground">Barcode</span>
                    <span className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground">Sell when out of stock <strong>Off</strong></span>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Shipping</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Physical product</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Package</label>
                      <select className="w-full h-10 px-3 rounded-lg border border-border text-sm text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>Store default</option>
                        <option>Small box</option>
                        <option>Medium box</option>
                        <option>Large box</option>
                        <option>Envelope</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Product weight</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue="0.5"
                          step="0.1"
                          className="flex-1 h-10 px-3 rounded-lg border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <select className="h-10 px-2 rounded-lg border border-border text-sm text-foreground bg-card focus:outline-none">
                          <option>lb</option>
                          <option>oz</option>
                          <option>kg</option>
                          <option>g</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <span className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground">Country of origin</span>
                    <span className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground">HS Code</span>
                  </div>
                </div>

                {/* Category metafields */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Category metafields</h2>
                    <span className="text-sm text-muted-foreground">{product.category_name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">No category metafields configured.</p>
                </div>

                {/* Product metafields */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <h2 className="font-semibold text-foreground">Product metafields</h2>
                  <p className="text-sm text-muted-foreground text-center py-4">No metafields pinned. <a href="#" className="text-primary hover:underline">View all</a></p>
                </div>

                {/* SEO */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <h2 className="font-semibold text-foreground">Search engine listing</h2>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Resurrected</p>
                    <p className="text-xs text-muted-foreground">https://resurrectedlabs.com › products › {product.slug}</p>
                    <p className="text-base text-[#1a0dab] font-medium">{product.display_name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description || 'No description available.'}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground">
                Select a variant to edit
              </div>
            )}

            {/* Save bar */}
            <div className="flex justify-end">
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductEdit;
