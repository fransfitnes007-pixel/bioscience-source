import { Link } from "react-router-dom";
import { Product } from "@/lib/products-data";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onViewDetails?: () => void;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex min-h-[180px] flex-col justify-between rounded-lg border border-border/50 bg-card/30 p-6 transition-all duration-300 hover-lift"
    >
      <div className="mb-8 space-y-3">
        <p className="font-body text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Research peptide
        </p>
        <h3 className="font-heading text-xl font-medium leading-tight text-foreground">
          {product.displayName}
        </h3>
      </div>

      <Button variant="heroOutline" size="sm" className="w-full">
        View Details
      </Button>
    </Link>
  );
};
