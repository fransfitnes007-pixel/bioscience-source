import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/cart/PriceDisplay";
import { useCart } from "@/contexts/CartContext";
import { getProductBySlug, Product, ProductVariation } from "@/lib/products-data";
import { toast } from "sonner";
import { getProductImage } from "@/lib/product-images";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  ExternalLink,
  ImageIcon,
  Check,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (!slug) {
      navigate("/products");
      return;
    }

    const foundProduct = getProductBySlug(slug);
    if (!foundProduct) {
      navigate("/products");
      return;
    }

    setProduct(foundProduct);
    if (foundProduct.variations.length > 0) {
      setSelectedVariation(foundProduct.variations[0]);
      setQuantity(foundProduct.variations[0].moq);
    }
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariation) {
      toast.error("Please select a variation");
      return;
    }

    // Check if price exists (it may be 0 or undefined for now)
    const price = selectedVariation.price ?? 0;
    if (price === 0) {
      toast.info("Price coming soon - contact us for pricing");
      return;
    }

    setIsAddingToCart(true);
    await addToCart({
      productId: product.slug, // Using slug as ID for local data
      variationId: `${product.slug}-${selectedVariation.strength}`,
      productName: product.displayName,
      variationName: selectedVariation.strength,
      quantity,
      price,
    });
    setIsAddingToCart(false);
  };

  const productImage = product ? getProductImage(product.slug) : null;

  if (!product) {
    return (
      <Layout>
        <div className="pt-24 lg:pt-32 pb-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  const currentPrice = selectedVariation?.price ?? 0;

  return (
    <Layout>
      <div className="pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm">Back to Products</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-card border border-border rounded-2xl flex items-center justify-center overflow-hidden sticky top-32">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product.displayName}
                    className="w-full h-full object-contain p-8"
                  />
                ) : (
                  <ImageIcon className="w-24 h-24 text-muted-foreground/30" strokeWidth={1} />
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {product.displayName}
              </h1>

              {product.description && (
                <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Variations */}
              <div className="mb-8">
                <h3 className="font-heading text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  Select Variation
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.variations.map((variation, index) => (
                    <button
                      key={`${product.slug}-${variation.strength}-${index}`}
                      onClick={() => {
                        setSelectedVariation(variation);
                        setQuantity(variation.moq);
                      }}
                      className={`relative p-4 border rounded-xl text-left transition-all ${
                        selectedVariation?.strength === variation.strength
                          ? "border-foreground bg-foreground/5 ring-2 ring-foreground/20"
                          : "border-border hover:border-foreground/50"
                      }`}
                    >
                      {selectedVariation?.strength === variation.strength && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-background" />
                        </div>
                      )}
                      <span className="font-heading font-semibold text-foreground block mb-1">
                        {variation.strength}
                      </span>
                      <span className="font-body text-xs text-muted-foreground">
                        Min: {variation.moq} units
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-center gap-8 mb-8">
                <PriceDisplay price={currentPrice} size="lg" />
                <div>
                  <span className="font-body text-sm text-muted-foreground block">
                    {currentPrice > 0 ? "per unit" : "Price coming soon"}
                  </span>
                  <span className="font-heading text-lg font-medium text-foreground">
                    {selectedVariation?.strength}
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="font-heading text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(selectedVariation?.moq || 1, quantity - 1))}
                      className="p-3 hover:bg-secondary/50 transition-colors"
                      disabled={quantity <= (selectedVariation?.moq || 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || selectedVariation?.moq || 1;
                        setQuantity(Math.max(selectedVariation?.moq || 1, val));
                      }}
                      className="w-20 text-center font-heading font-medium text-foreground bg-transparent border-x border-border py-3"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-secondary/50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-body text-muted-foreground">
                    Total:{" "}
                    <span className="font-heading font-semibold text-foreground">
                      ${(currentPrice * quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                variant="hero"
                size="lg"
                className="w-full gap-3 text-lg py-6"
                onClick={handleAddToCart}
                disabled={currentPrice === 0 || isAddingToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? "Adding..." : currentPrice > 0 ? "Add to Cart" : "Contact for Pricing"}
              </Button>

              {/* Product Details Accordion */}
              <div className="mt-12 border-t border-border pt-8">
                <Accordion type="multiple" className="w-full">
                  {product.scientificPurpose && (
                    <AccordionItem value="purpose" className="border-border/50">
                      <AccordionTrigger className="font-heading text-lg font-medium text-foreground hover:no-underline">
                        Scientific Research Purpose
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-muted-foreground leading-relaxed text-base">
                        {product.scientificPurpose}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {product.studiesFindings && (
                    <AccordionItem value="studies" className="border-border/50">
                      <AccordionTrigger className="font-heading text-lg font-medium text-foreground hover:no-underline">
                        Studies Have Proven To Show
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-muted-foreground leading-relaxed text-base">
                        {product.studiesFindings}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {product.nihLink && (
                    <AccordionItem value="nih" className="border-border/50">
                      <AccordionTrigger className="font-heading text-lg font-medium text-foreground hover:no-underline">
                        NIH Research Link
                      </AccordionTrigger>
                      <AccordionContent>
                        <a
                          href={product.nihLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 font-body text-foreground hover:text-foreground/80 transition-colors text-base underline"
                        >
                          View on PubMed
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  <AccordionItem value="coa" className="border-border/50">
                    <AccordionTrigger className="font-heading text-lg font-medium text-foreground hover:no-underline">
                      COA Photo & Lab Testing
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground text-base">
                      <p className="italic">COA documentation available for approved B2B partners.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Terms disclaimer */}
              <div className="mt-12 p-4 bg-secondary/30 rounded-lg border border-border/50">
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  <strong>DISCLAIMER:</strong> This product is intended for research purposes only. 
                  NOT FOR HUMAN CONSUMPTION. NOT FOR ANIMAL TESTING OR CONSUMPTION. 
                  By purchasing this product, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-foreground">
                    Terms of Service
                  </Link>{" "}
                  and confirm you are a qualified research professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
