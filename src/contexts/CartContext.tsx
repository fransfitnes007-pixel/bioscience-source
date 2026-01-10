import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  productId: string;
  variationId: string;
  productName: string;
  variationName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface DealTier {
  id: string;
  tierNumber: number;
  name: string;
  minSpend: number;
  rewardType: string;
  rewardValue: number | null;
  rewardDescription: string;
  celebrationText: string;
}

interface CartContextType {
  items: CartItem[];
  dealTiers: DealTier[];
  isLoading: boolean;
  subtotal: number;
  currentTier: DealTier | null;
  nextTier: DealTier | null;
  progressToNextTier: number;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [dealTiers, setDealTiers] = useState<DealTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastUnlockedTier, setLastUnlockedTier] = useState<number>(0);

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Find current and next tier
  const currentTier = dealTiers
    .filter((tier) => subtotal >= tier.minSpend)
    .sort((a, b) => b.minSpend - a.minSpend)[0] || null;

  const nextTier = dealTiers
    .filter((tier) => subtotal < tier.minSpend)
    .sort((a, b) => a.minSpend - b.minSpend)[0] || null;

  // Progress to next tier (0-100)
  const progressToNextTier = nextTier
    ? Math.min(100, (subtotal / nextTier.minSpend) * 100)
    : 100;

  // Check for tier unlocks and show celebration
  useEffect(() => {
    if (currentTier && currentTier.tierNumber > lastUnlockedTier) {
      setLastUnlockedTier(currentTier.tierNumber);
      // Trigger celebration (handled by component)
    }
  }, [currentTier, lastUnlockedTier]);

  // Fetch deal tiers
  useEffect(() => {
    const fetchDealTiers = async () => {
      const { data, error } = await supabase
        .from("deal_tiers")
        .select("*")
        .eq("is_active", true)
        .order("tier_number");

      if (!error && data) {
        setDealTiers(
          data.map((tier) => ({
            id: tier.id,
            tierNumber: tier.tier_number,
            name: tier.name,
            minSpend: Number(tier.min_spend),
            rewardType: tier.reward_type,
            rewardValue: tier.reward_value ? Number(tier.reward_value) : null,
            rewardDescription: tier.reward_description,
            celebrationText: tier.celebration_text,
          }))
        );
      }
    };
    fetchDealTiers();
  }, []);

  // Auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch cart when user changes
  useEffect(() => {
    if (userId) {
      refreshCart();
    } else {
      setItems([]);
      setIsLoading(false);
    }
  }, [userId]);

  const refreshCart = async () => {
    if (!userId) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        product_id,
        variation_id,
        products (name, display_name, slug, image_url),
        product_variations (strength, price)
      `)
      .eq("user_id", userId);

    if (!error && data) {
      setItems(
        data.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          variationId: item.variation_id,
          productName: item.products?.display_name || item.products?.name || "Unknown",
          variationName: item.product_variations?.strength || "",
          quantity: item.quantity,
          price: Number(item.product_variations?.price || 0),
          image: item.products?.image_url,
        }))
      );
    }
    setIsLoading(false);
  };

  const addToCart = async (item: Omit<CartItem, "id">) => {
    if (!userId) {
      toast.error("Please log in to add items to cart");
      return;
    }

    // Check if item already exists
    const existingItem = items.find(
      (i) => i.productId === item.productId && i.variationId === item.variationId
    );

    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + item.quantity);
    } else {
      const { error } = await supabase.from("cart_items").insert({
        user_id: userId,
        product_id: item.productId,
        variation_id: item.variationId,
        quantity: item.quantity,
      });

      if (error) {
        toast.error("Failed to add to cart");
      } else {
        toast.success("Added to cart!");
        await refreshCart();
      }
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", itemId);

    if (!error) {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Removed from cart");
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);

    if (!error) {
      setItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        dealTiers,
        isLoading,
        subtotal,
        currentTier,
        nextTier,
        progressToNextTier,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};