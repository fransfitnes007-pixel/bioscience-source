import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  const [lastUnlockedTier, setLastUnlockedTier] = useState<number>(0);
  const { user } = useAuth();
  const userId = user?.id || null;

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

  const GUEST_KEY = "guest-cart";

  const loadGuestCart = (): CartItem[] => {
    try {
      const raw = localStorage.getItem(GUEST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveGuestCart = (next: CartItem[]) => {
    localStorage.setItem(GUEST_KEY, JSON.stringify(next));
  };

  const clearGuestCart = () => {
    localStorage.removeItem(GUEST_KEY);
  };

  // Fetch cart when user changes
  useEffect(() => {
    if (userId) {
      const guestItems = loadGuestCart();
      if (guestItems.length) {
        setItems(guestItems);
      }
      refreshCart({ mergeGuest: guestItems });
    } else {
      setItems(loadGuestCart());
      setIsLoading(false);
    }
  }, [userId]);

  const refreshCart = async (options?: { mergeGuest?: CartItem[] }) => {
    if (!userId) {
      setItems(loadGuestCart());
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const guestItems = options?.mergeGuest || [];
    if (guestItems.length) {
      await supabase.from("cart_items").insert(
        guestItems.map((item) => ({
          user_id: userId,
          product_id: null,
          variation_id: null,
          product_name: item.productName,
          variation_name: item.variationName,
          unit_price: item.price,
          image_url: item.image || null,
          quantity: item.quantity,
        }))
      );
      clearGuestCart();
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        product_id,
        variation_id,
        product_name,
        variation_name,
        unit_price,
        image_url
      `)
      .eq("user_id", userId);

    if (!error && data) {
      setItems(
        data.map((item: any) => ({
          id: item.id,
          productId: item.product_id || "",
          variationId: item.variation_id || "",
          productName: item.product_name || "Unknown",
          variationName: item.variation_name || "",
          quantity: item.quantity,
          price: Number(item.unit_price || 0),
          image: item.image_url,
        }))
      );
    } else if (error) {
      console.error("Cart load error:", error);
    }
    setIsLoading(false);
  };

  const addToCart = async (item: Omit<CartItem, "id">) => {
    if (!userId) {
      // Guest cart: store in localStorage
      const current = loadGuestCart();
      const existing = current.find(
        (i) => i.productName === item.productName && i.variationName === item.variationName
      );
      let next: CartItem[];
      if (existing) {
        next = current.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        next = [...current, { ...item, id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }];
      }
      saveGuestCart(next);
      setItems(next);
      toast.success("Added to cart!");
      return;
    }

    // Check if item already exists by matching product name and variation
    const existingItem = items.find(
      (i) => i.productName === item.productName && i.variationName === item.variationName
    );

    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + item.quantity);
    } else {
      const { error } = await supabase.from("cart_items").insert({
        user_id: userId,
        product_id: null,
        variation_id: null,
        product_name: item.productName,
        variation_name: item.variationName,
        unit_price: item.price,
        image_url: item.image,
        quantity: item.quantity,
      });

      if (error) {
        console.error("Cart insert error:", error);
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

    if (!userId) {
      const next = loadGuestCart().map((i) => (i.id === itemId ? { ...i, quantity } : i));
      saveGuestCart(next);
      setItems(next);
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
    if (!userId) {
      const next = loadGuestCart().filter((i) => i.id !== itemId);
      saveGuestCart(next);
      setItems(next);
      toast.success("Removed from cart");
      return;
    }

    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Removed from cart");
    }
  };

  const clearCart = async () => {
    if (!userId) {
      saveGuestCart([]);
      setItems([]);
      return;
    }

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