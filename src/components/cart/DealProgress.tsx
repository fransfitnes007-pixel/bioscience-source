import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Truck, Percent, Star, Crown, Trophy } from "lucide-react";

const tierIcons: Record<string, any> = {
  Bronze: Gift,
  Silver: Truck,
  Gold: Percent,
  Platinum: Star,
  Diamond: Crown,
  Elite: Trophy,
};

export const DealProgress = () => {
  const { subtotal, dealTiers, currentTier, nextTier, progressToNextTier } = useCart();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState("");
  const [lastTierNumber, setLastTierNumber] = useState(0);

  // Watch for tier changes
  useEffect(() => {
    if (currentTier && currentTier.tierNumber > lastTierNumber) {
      setCelebrationText(currentTier.celebrationText);
      setShowCelebration(true);
      setLastTierNumber(currentTier.tierNumber);
      
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [currentTier, lastTierNumber]);

  if (dealTiers.length === 0) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-br from-foreground to-foreground/80 text-background px-12 py-8 rounded-2xl shadow-2xl text-center"
            >
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-2xl font-bold mb-2"
              >
                {currentTier?.name} Tier Unlocked!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-body text-lg opacity-90"
              >
                {celebrationText}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar Component */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading text-sm font-medium text-foreground">
            {currentTier ? `${currentTier.name} Status` : "Unlock Rewards"}
          </span>
          <span className="font-body text-sm text-muted-foreground">
            Cart: {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden mb-3">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-foreground/70 to-foreground rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextTier}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          {/* Tier markers */}
          {dealTiers.map((tier) => {
            const maxSpend = dealTiers[dealTiers.length - 1]?.minSpend || 10000;
            const position = (tier.minSpend / maxSpend) * 100;
            const Icon = tierIcons[tier.name] || Gift;
            const isUnlocked = subtotal >= tier.minSpend;
            
            return (
              <div
                key={tier.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${Math.min(position, 98)}%` }}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isUnlocked
                      ? "bg-foreground text-background"
                      : "bg-secondary border border-border text-muted-foreground"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Next tier info */}
        {nextTier && (
          <div className="flex items-center justify-between text-sm">
            <span className="font-body text-muted-foreground">
              {formatCurrency(nextTier.minSpend - subtotal)} to {nextTier.name}
            </span>
            <span className="font-heading text-foreground font-medium">
              {nextTier.rewardDescription}
            </span>
          </div>
        )}

        {!nextTier && currentTier && (
          <div className="text-center">
            <span className="font-heading text-sm font-medium text-foreground">
              🏆 Elite Status Achieved! Maximum rewards unlocked.
            </span>
          </div>
        )}
      </div>
    </>
  );
};