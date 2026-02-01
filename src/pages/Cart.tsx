import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { DealProgress } from "@/components/cart/DealProgress";
import { getProductImage } from "@/lib/product-images";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ImageIcon,
} from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    isLoading,
    subtotal,
    updateQuantity,
    removeFromCart,
    currentTier,
  } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate discount based on current tier
  const getDiscount = () => {
    if (!currentTier) return 0;
    
    if (currentTier.rewardType === "percent_off" && currentTier.rewardValue) {
      return subtotal * (currentTier.rewardValue / 100);
    }
    if (currentTier.rewardType === "fixed_off" && currentTier.rewardValue) {
      return currentTier.rewardValue;
    }
    return 0;
  };

  const discount = getDiscount();
  const discountedSubtotal = subtotal - discount;

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-24 lg:pt-32 pb-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading cart...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 lg:pt-32 pb-16 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <ShoppingCart className="w-8 h-8 text-foreground" />
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground">
              Your Cart
            </h1>
            <span className="font-body text-muted-foreground">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-medium text-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="font-body text-muted-foreground mb-6">
                Browse our products and add items to get started.
              </p>
              <Link to="/products">
                <Button variant="hero">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  // Use stored image or try to find product image by productId (which is the slug)
                  const productImage = item.image || getProductImage(item.productId);
                  
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-card border border-border rounded-xl"
                    >
                      {/* Image */}
                      <div className="w-24 h-24 bg-secondary/30 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.productName}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-medium text-foreground truncate">
                          {item.productName}
                        </h3>
                        <p className="font-body text-sm text-muted-foreground mb-2">
                          {item.variationName}
                        </p>
                        <p className="font-heading font-semibold text-foreground">
                          {formatCurrency(item.price)} / unit
                        </p>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 border border-border rounded hover:bg-secondary/50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-heading font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-border rounded hover:bg-secondary/50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-heading font-semibold text-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-6">
                  {/* Deal Progress */}
                  <DealProgress />

                  {/* Summary Card */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between font-body">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">{formatCurrency(subtotal)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between font-body text-green-500">
                          <span>{currentTier?.name} Discount</span>
                          <span>-{formatCurrency(discount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between font-body">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground">
                          {currentTier?.rewardType === "free_shipping" ? (
                            <span className="text-green-500">FREE</span>
                          ) : (
                            "Calculated at checkout"
                          )}
                        </span>
                      </div>

                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-heading font-semibold text-foreground">
                          Estimated Total
                        </span>
                        <span className="font-heading text-xl font-bold text-foreground">
                          {formatCurrency(discountedSubtotal)}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full gap-2"
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    <Link to="/products">
                      <Button variant="ghost" className="w-full mt-3">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;