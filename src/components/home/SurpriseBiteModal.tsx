import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { pickSurpriseMeal } from '../../services/recommendation';
import { MenuItem } from '../../types';
import { Sparkles, X, Shuffle, ShoppingBag, Clock, Flame, CheckCircle, FlameKindling } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VegBadge, MatchScoreBadge } from '../brand/Badges';

export const SurpriseBiteModal: React.FC = () => {
  const { isSurpriseModalOpen, setIsSurpriseModalOpen, restaurants, userPreferences, addToCart } = useApp();

  const [isShuffling, setIsShuffling] = useState(false);
  const [revealedResult, setRevealedResult] = useState<{
    item: MenuItem;
    result: any;
    tagline: string;
  } | null>(null);

  // Collect all menu items
  const allItems: MenuItem[] = [];
  restaurants.forEach(r => {
    if (r.isOpen) allItems.push(...r.menu);
  });

  const handleShuffle = () => {
    setIsShuffling(true);
    setRevealedResult(null);

    // Shuffle cycle
    setTimeout(() => {
      const picked = pickSurpriseMeal(allItems, userPreferences);
      setRevealedResult(picked);
      setIsShuffling(false);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }
    }, 1200);
  };

  useEffect(() => {
    if (isSurpriseModalOpen) {
      handleShuffle();
    }
  }, [isSurpriseModalOpen]);

  if (!isSurpriseModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 text-zinc-100">
      <div
        id="surprise-bite-modal"
        className="w-full max-w-lg bg-[#121215] rounded-[32px] shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#FF6B00] via-amber-500 to-[#FF8500] text-black flex items-center justify-between font-black">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center text-black font-black">
              <Sparkles className="w-5 h-5 animate-spin stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl">Surprise Bite Matcher</h3>
              <p className="text-xs text-black/80 font-bold">Personalized delight based on your mood & time of day</p>
            </div>
          </div>
          <button
            onClick={() => setIsSurpriseModalOpen(false)}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {isShuffling ? (
            <div className="py-12 space-y-4 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-[#FF6B00] border-t-transparent animate-spin flex items-center justify-center">
                <Shuffle className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <div>
                <p className="text-base font-black text-white">Shuffling Trivandrum Kitchens...</p>
                <p className="text-xs text-zinc-400">Matching diet profile, corridor proximity & kitchen queues</p>
              </div>
            </div>
          ) : revealedResult ? (
            <div className="space-y-5 animate-in fade-in zoom-in-90 duration-300">
              
              {/* Badge & Tagline */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF6B00]/15 text-[#FF8500] border border-[#FF6B00]/30 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>{revealedResult.tagline}</span>
              </div>

              {/* Dish Visual & Card */}
              <div className="relative rounded-[28px] overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02] p-4 text-left">
                <div className="aspect-video rounded-2xl overflow-hidden mb-3 relative bg-zinc-900">
                  <img
                    src={revealedResult.item.image}
                    alt={revealedResult.item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <VegBadge isVeg={revealedResult.item.isVeg} />
                    <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-black flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF6B00]" />
                      {revealedResult.item.prepTimeMinutes} mins
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <MatchScoreBadge
                      score={revealedResult.result.overallScore}
                      result={revealedResult.result}
                      size="md"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-black uppercase tracking-wider text-zinc-400">{revealedResult.item.restaurantName}</p>
                  <h4 className="text-lg font-black text-white">{revealedResult.item.name}</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{revealedResult.item.description}</p>
                </div>

                {/* Nutrition and Quick Tags */}
                <div className="flex flex-wrap gap-2 pt-3">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                    💪 {revealedResult.item.nutrition?.proteinGrams || 24}g Protein
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-black">
                    🔥 {revealedResult.item.nutrition?.calories || 380} kcal
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-white/[0.04] text-zinc-300 border border-white/10 text-xs font-bold">
                    🌶️ Spice Level {revealedResult.item.spiceLevel}/4
                  </span>
                </div>

                {/* Transparent Selection Reasons */}
                {revealedResult.result.reasons.length > 0 && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-xs text-zinc-300 space-y-1">
                    <p className="font-black text-[#FF8500] uppercase tracking-wider text-[11px]">Why Quick Bite matched this for you:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-zinc-300">
                      {revealedResult.result.reasons.map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price and Add CTA */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
                  <div>
                    <span className="text-2xl font-black text-white">₹{revealedResult.item.price}</span>
                    {revealedResult.item.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through ml-2">₹{revealedResult.item.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShuffle}
                      className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 font-bold transition-all cursor-pointer"
                      title="Shuffle again"
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>
                    <button
                      id="surprise-add-to-cart-btn"
                      onClick={() => {
                        addToCart(revealedResult.item, 1);
                        setIsSurpriseModalOpen(false);
                      }}
                      className="px-5 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span>Order This Bite</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <p className="text-xs text-zinc-500">No matching dishes available right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};
