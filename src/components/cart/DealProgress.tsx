import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ChevronRight, Gift, Check, X, Copy } from "lucide-react";

const tierEmojis: Record<string, string> = {
  Starter: "🎖️",
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
  Platinum: "🏆",
  Diamond: "💎",
};

const tierColors: Record<string, string> = {
  Starter: "from-amber-600 to-amber-400",
  Bronze: "from-orange-700 to-orange-500",
  Silver: "from-slate-400 to-slate-300",
  Gold: "from-yellow-500 to-yellow-300",
  Platinum: "from-purple-600 to-purple-400",
  Diamond: "from-cyan-400 to-blue-500",
};

export const DealProgress = () => {
  const { subtotal, dealTiers, currentTier, nextTier, progressToNextTier } = useCart();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationTier, setCelebrationTier] = useState<typeof currentTier>(null);
  const [lastTierNumber, setLastTierNumber] = useState(0);

  const fireConfetti = useCallback((isBogo: boolean = false) => {
    const duration = isBogo ? 5000 : 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    // BOGO celebration - extra intense with gold/green colors
    const bogoColors = ['#FFD700', '#32CD32', '#FFD700', '#00FF00', '#FFDF00'];
    const regularColors = ['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#9370DB'];

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = (isBogo ? 80 : 50) * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: isBogo ? bogoColors : regularColors,
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: isBogo ? bogoColors : regularColors,
      });

      // Extra center burst for BOGO
      if (isBogo) {
        confetti({
          ...defaults,
          particleCount: particleCount / 2,
          origin: { x: 0.5, y: 0.5 },
          colors: bogoColors,
          shapes: ['star'],
        });
      }
    }, isBogo ? 150 : 250);
  }, []);

  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  // Watch for tier changes
  useEffect(() => {
    if (currentTier && currentTier.tierNumber > lastTierNumber) {
      setCelebrationTier(currentTier);
      setShowCelebration(true);
      setLastTierNumber(currentTier.tierNumber);
      
      // Check if this is a BOGO tier (Platinum = $50k)
      const isBogo = currentTier.name === "Platinum" || currentTier.name === "Diamond";
      fireConfetti(isBogo);
      
      // Auto-hide after delay (but user can close early with X)
      setTimeout(() => setShowCelebration(false), isBogo ? 6000 : 4000);
    }
  }, [currentTier, lastTierNumber, fireConfetti]);

  if (dealTiers.length === 0) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const unlockedTiers = dealTiers.filter((tier) => subtotal >= tier.minSpend);
  const lockedTiers = dealTiers.filter((tier) => subtotal < tier.minSpend);

  return (
    <>
      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && celebrationTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeCelebration}
          >
            <motion.div
              initial={{ y: 50, scale: 0.8, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -50, scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className={`relative bg-gradient-to-br ${tierColors[celebrationTier.name] || "from-foreground to-foreground/80"} text-white px-12 py-8 rounded-2xl shadow-2xl text-center max-w-md mx-4 pointer-events-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - always visible */}
              <button
                onClick={closeCelebration}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Close celebration"
              >
                <X className="w-5 h-5" />
              </button>

              {/* BOGO Special Animation */}
              {(celebrationTier.name === "Platinum" || celebrationTier.name === "Diamond") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  BOGO FREE!
                </motion.div>
              )}

              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-7xl mb-4"
              >
                {tierEmojis[celebrationTier.name] || "🎉"}
              </motion.div>

              {/* BOGO Double Icon Animation */}
              {(celebrationTier.name === "Platinum" || celebrationTier.name === "Diamond") && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="flex justify-center gap-4 mb-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="bg-white/20 rounded-lg p-3"
                  >
                    <span className="text-2xl">📦</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center text-3xl font-bold"
                  >
                    ×2
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                    className="relative bg-green-500/30 rounded-lg p-3 border-2 border-green-400"
                  >
                    <span className="text-2xl">📦</span>
                    <span className="absolute -top-1 -right-1 text-xs bg-green-500 rounded-full px-1">FREE</span>
                  </motion.div>
                </motion.div>
              )}

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-2xl font-bold mb-2 drop-shadow-lg"
              >
                {celebrationTier.name} Unlocked!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-body text-lg opacity-95 mb-4"
              >
                {celebrationTier.celebrationText}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block"
              >
                <span className="font-heading font-bold">
                  {celebrationTier.rewardDescription}
                </span>
              </motion.div>

              {/* BOGO Highlight Text */}
              {(celebrationTier.name === "Platinum" || celebrationTier.name === "Diamond") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-4 text-sm bg-green-500/30 border border-green-400 rounded-lg px-4 py-2"
                >
                  🎁 Every item in your cart will be <strong>DOUBLED</strong> at checkout — FREE!
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar Component */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-medium text-foreground">
              {currentTier ? (
                <span className="flex items-center gap-1">
                  {tierEmojis[currentTier.name]} {currentTier.name} Status
                </span>
              ) : (
                "Unlock Rewards"
              )}
            </span>
            
            {/* Unlocked Rewards Hover */}
            {unlockedTiers.length > 0 && (
              <HoverCard openDelay={100}>
                <HoverCardTrigger asChild>
                  <button className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    {unlockedTiers.length} reward{unlockedTiers.length > 1 ? "s" : ""}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0" align="start">
                  <div className="p-3 border-b border-border bg-muted/50">
                    <h4 className="font-heading font-semibold text-sm flex items-center gap-2">
                      <Gift className="w-4 h-4 text-primary" />
                      Your Unlocked Rewards
                    </h4>
                  </div>
                  <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                    {unlockedTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className={`flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r ${tierColors[tier.name]} bg-opacity-10`}
                      >
                        <span className="text-xl">{tierEmojis[tier.name]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-heading text-sm font-semibold text-foreground">
                            {tier.name}
                          </div>
                          <div className="font-body text-xs text-muted-foreground truncate">
                            {tier.rewardDescription}
                          </div>
                        </div>
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                  {lockedTiers.length > 0 && (
                    <>
                      <div className="p-3 border-t border-border bg-muted/30">
                        <h4 className="font-heading font-semibold text-xs text-muted-foreground">
                          Next Rewards
                        </h4>
                      </div>
                      <div className="p-2 space-y-1">
                        {lockedTiers.slice(0, 2).map((tier) => (
                          <div
                            key={tier.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 opacity-60"
                          >
                            <span className="text-xl grayscale">{tierEmojis[tier.name]}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-heading text-sm font-medium text-foreground">
                                {tier.name} — {formatCurrency(tier.minSpend)}
                              </div>
                              <div className="font-body text-xs text-muted-foreground truncate">
                                {tier.rewardDescription}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
          
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
            const maxSpend = dealTiers[dealTiers.length - 1]?.minSpend || 100000;
            const position = (tier.minSpend / maxSpend) * 100;
            const isUnlocked = subtotal >= tier.minSpend;
            
            return (
              <HoverCard key={tier.id} openDelay={200}>
                <HoverCardTrigger asChild>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer"
                    style={{ left: `${Math.min(position, 98)}%` }}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: isUnlocked ? 1.1 : 1 }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all text-xs ${
                        isUnlocked
                          ? `bg-gradient-to-br ${tierColors[tier.name]} shadow-lg`
                          : "bg-secondary border border-border"
                      }`}
                    >
                      {isUnlocked ? tierEmojis[tier.name] : ""}
                    </motion.div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-56 p-3" side="top">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{tierEmojis[tier.name]}</span>
                    <div>
                      <h4 className="font-heading font-semibold">{tier.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(tier.minSpend)} spend
                      </p>
                    </div>
                  </div>
                  <p className="font-body text-sm">{tier.rewardDescription}</p>
                  {!isUnlocked && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatCurrency(tier.minSpend - subtotal)} more to unlock
                    </p>
                  )}
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>

        {/* Next tier info */}
        {nextTier && (
          <div className="flex items-center justify-between text-sm">
            <span className="font-body text-muted-foreground">
              <span className="text-foreground font-medium">
                {formatCurrency(nextTier.minSpend - subtotal)}
              </span>{" "}
              to unlock {tierEmojis[nextTier.name]} {nextTier.name}
            </span>
            <span className="font-heading text-foreground font-medium text-xs bg-muted px-2 py-1 rounded">
              {nextTier.rewardDescription}
            </span>
          </div>
        )}

        {!nextTier && currentTier && (
          <div className="text-center">
            <span className="font-heading text-sm font-medium text-foreground">
              💎 Diamond Status! You've unlocked ALL rewards!
            </span>
          </div>
        )}
      </div>
    </>
  );
};
