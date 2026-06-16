import { Link } from "react-router-dom";
import { Product } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { getLabelImage } from "@/lib/product-label-images";

interface ProductCardProps {
  product: Product;
  onViewDetails?: () => void;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const labelSrc = getLabelImage(product.slug);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex min-h-[180px] flex-col justify-between rounded-lg border border-border/50 bg-card/30 p-6 transition-all duration-300 hover-lift"
    >
      <div className="mb-8 space-y-3">
        {labelSrc && (
          <div className="mb-4 overflow-hidden rounded-md border border-border/60 bg-white">
            <img
              src={labelSrc}
              alt={`${product.displayName} label`}
              loading="lazy"
              className="w-full h-auto object-contain"
            />
          </div>
        )}
        <p className="font-body text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Research compound · For in vitro use only
        </p>
        <h3 className="font-heading text-xl font-medium leading-tight text-foreground">
          {product.displayName}
        </h3>
      </div>

      <Button variant="heroOutline" size="sm" className="w-full">
        View Research Details
      </Button>
    </Link>
  );
};
