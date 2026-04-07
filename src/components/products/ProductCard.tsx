import { Link } from "react-router-dom";
import { Product } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetails?: () => void;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group p-6 border border-border/50 rounded-lg bg-card/30 hover-lift transition-all duration-300 block"
    >
      {/* Minimal icon placeholder */}
      <div className="aspect-square mb-4 bg-secondary/20 rounded-lg flex items-center justify-center overflow-hidden">
        <FlaskConical
          className="w-14 h-14 text-muted-foreground/20 group-hover:text-muted-foreground/35 transition-colors duration-300"
          strokeWidth={1}
        />
      </div>

      {/* Product name */}
      <h3 className="font-heading text-lg font-medium text-foreground mb-4 truncate">
        {product.displayName}
      </h3>

      {/* View Details button */}
      <Button variant="heroOutline" size="sm" className="w-full">
        View Details
      </Button>
    </Link>
  );
};
