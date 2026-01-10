import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export const CartIcon = () => {
  const { items } = useCart();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      to="/cart"
      className="relative p-2 hover:bg-secondary/50 rounded-lg transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-5 h-5 text-foreground" />
      
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs font-heading font-bold rounded-full flex items-center justify-center"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};
