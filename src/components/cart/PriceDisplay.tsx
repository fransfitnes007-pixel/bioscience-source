import { motion } from "framer-motion";

interface PriceDisplayProps {
  price: number;
  size?: "sm" | "md" | "lg" | "xl";
  showCurrency?: boolean;
  className?: string;
}

export const PriceDisplay = ({
  price,
  size = "md",
  showCurrency = true,
  className = "",
}: PriceDisplayProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  const hexagonSizes = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36",
    xl: "w-44 h-44",
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* Hexagon container */}
      <div
        className={`${hexagonSizes[size]} relative flex items-center justify-center`}
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80" />
        
        {/* Inner glow */}
        <div 
          className="absolute inset-[2px] bg-gradient-to-br from-foreground/95 to-foreground flex items-center justify-center"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <div className="text-center text-background">
            {showCurrency && (
              <motion.span
                className="text-xs font-heading font-bold opacity-80 block -mb-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                USD
              </motion.span>
            )}
            <motion.div
              className={`font-heading font-bold ${sizeClasses[size]} flex items-start justify-center`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <span className="text-[0.6em] mt-1 mr-0.5">$</span>
              <span>{formatPrice(price)}</span>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Decorative ring */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: "linear-gradient(135deg, transparent 40%, hsl(var(--foreground) / 0.2) 50%, transparent 60%)",
        }}
      />
    </motion.div>
  );
};