import { Product } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { getProductImage } from "@/lib/product-images";

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const productImage = getProductImage(product.slug);

  return (
    <div className="group p-6 border border-border/50 rounded-lg bg-card/30 hover-lift transition-all duration-300">
      {/* Product image */}
      <div className="aspect-square mb-4 bg-secondary/30 rounded-lg flex items-center justify-center overflow-hidden">
        {productImage ? (
          <img
            src={productImage}
            alt={product.displayName}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <ImageIcon className="w-12 h-12 text-muted-foreground/30" strokeWidth={1} />
        )}
      </div>

      {/* Product name */}
      <h3 className="font-heading text-lg font-medium text-foreground mb-4 truncate">
        {product.displayName}
      </h3>

      {/* View Details button */}
      <Button
        variant="heroOutline"
        size="sm"
        className="w-full"
        onClick={onViewDetails}
      >
        View Details
      </Button>
    </div>
  );
};
