import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Plus, Minus } from "lucide-react";
import { productCategories, ProductVariation } from "@/lib/products-data";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const PortalProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const allProducts = useMemo(() => {
    return productCategories.flatMap((category) =>
      category.products.map((product) => ({
        ...product,
        category: category.slug,
        categoryName: category.name,
      }))
    );
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchQuery, selectedCategory]);

  const getQuantity = (productSlug: string, strength: string) => {
    const key = `${productSlug}-${strength}`;
    return quantities[key] || 1;
  };

  const setQuantity = (productSlug: string, strength: string, qty: number) => {
    const key = `${productSlug}-${strength}`;
    setQuantities((prev) => ({ ...prev, [key]: Math.max(1, qty) }));
  };

  const getPrice = (variation: ProductVariation): number => {
    if (variation.price && variation.price > 0) return variation.price;
    if (variation.price10 && variation.price10 > 0) return variation.price10 / 10;
    return 0;
  };

  const handleAddToCart = async (product: typeof allProducts[0], variation: ProductVariation) => {
    const qty = getQuantity(product.slug, variation.strength);
    const price = getPrice(variation);

    await addToCart({
      productId: product.slug,
      productName: product.displayName,
      variationId: variation.strength,
      variationName: variation.strength,
      quantity: qty,
      price,
    });

    toast({
      title: "Added to cart",
      description: `${qty}x ${product.displayName} (${variation.strength})`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Browse and order from our catalog
            </p>
          </div>
          <Button onClick={() => navigate("/cart")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            View Cart
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Badge>
            {productCategories.map((category) => (
              <Badge
                key={category.slug}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.slug}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.displayName}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.variations.slice(0, 3).map((variation) => {
                  const qty = getQuantity(product.slug, variation.strength);
                  const unit = getPrice(variation);
                  const price = unit * qty;
                  
                  return (
                    <div
                      key={variation.strength}
                      className="flex items-center justify-between gap-2 p-3 rounded-lg border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{variation.strength}</p>
                        <p className="text-primary font-bold">
                          {formatPrice(price)}
                          <span className="text-xs text-muted-foreground ml-1">
                            /{qty} vial{qty > 1 ? "s" : ""}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setQuantity(product.slug, variation.strength, qty - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{qty}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setQuantity(product.slug, variation.strength, qty + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product, variation)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {product.variations.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/products/${product.slug}`)}
                  >
                    View all {product.variations.length} options
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default PortalProducts;
