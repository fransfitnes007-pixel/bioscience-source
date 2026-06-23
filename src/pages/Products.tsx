import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Search } from "lucide-react";
import { productCategories } from "@/lib/products-data";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetail } from "@/components/products/ProductDetail";
import { InquiryModal } from "@/components/products/InquiryModal";
import { Product, ProductVariation } from "@/lib/products-data";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return productCategories;

    const query = searchQuery.toLowerCase();
    return productCategories
      .map((category) => ({
        ...category,
        products: category.products.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.displayName.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.products.length > 0);
  }, [searchQuery]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariation(null);
  };

  const handleInquire = () => {
    if (selectedProduct && selectedVariation) {
      setShowInquiry(true);
    }
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
    setSelectedVariation(null);
  };

  return (
    <Layout>
      <div className="pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Research Products
            </h1>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Browse our catalog of reference-grade research peptides and compounds for in vitro laboratory use.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-16 animate-fade-up animation-delay-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search research compounds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all"
              />
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-16">
            {filteredCategories.map((category, categoryIndex) => (
              <section key={category.slug} className="animate-fade-up" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-8 text-foreground border-b border-border/50 pb-4">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      onViewDetails={() => handleViewDetails(product)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-muted-foreground">
                No products found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          selectedVariation={selectedVariation}
          onSelectVariation={setSelectedVariation}
          onInquire={handleInquire}
          onClose={handleCloseDetail}
        />
      )}

      {/* Inquiry Modal */}
      {showInquiry && selectedProduct && selectedVariation && (
        <InquiryModal
          product={selectedProduct}
          variation={selectedVariation}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </Layout>
  );
};

export default Products;
