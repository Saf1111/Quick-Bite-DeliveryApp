import React, { useState } from 'react';
import { BUDGET_TIERS } from '../../constants/categories';
import { MenuItem, Restaurant } from '../../types';
import { useApp } from '../../context/AppContext';
import { computeQuickMatch } from '../../services/recommendation';
import { VegBadge, MatchScoreBadge } from '../brand/Badges';
import { Wallet, ArrowUpDown, ShoppingBag, Clock, Star } from 'lucide-react';

interface BiteBudgetSectionProps {
  onSelectItem: (item: MenuItem) => void;
}

export const BiteBudgetSection: React.FC<BiteBudgetSectionProps> = ({ onSelectItem }) => {
  const { restaurants, userPreferences, addToCart } = useApp();
  const [selectedTier, setSelectedTier] = useState<string>('under-200');
  const [sortBy, setSortBy] = useState<'match' | 'cheapest' | 'fastest' | 'rating'>('match');

  const currentTier = BUDGET_TIERS.find(t => t.id === selectedTier) || BUDGET_TIERS[2];

  // Collect all menu items
  const allItems: { item: MenuItem; restaurant: Restaurant }[] = [];
  restaurants.forEach(rest => {
    if (rest.isOpen) {
      rest.menu.forEach(item => {
        allItems.push({ item, restaurant: rest });
      });
    }
  });

  // Filter by price tier
  const filtered = allItems.filter(({ item }) => {
    if (currentTier.id === 'under-100') return item.price <= 100;
    if (currentTier.id === 'under-150') return item.price <= 150;
    if (currentTier.id === 'under-200') return item.price <= 200;
    if (currentTier.id === 'under-300') return item.price <= 300;
    if (currentTier.id === 'under-500') return item.price <= 500;
    if (currentTier.id === 'above-500') return item.price > 500;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'cheapest') return a.item.price - b.item.price;
    if (sortBy === 'fastest') return a.item.prepTimeMinutes - b.item.prepTimeMinutes;
    if (sortBy === 'rating') return b.item.rating - a.item.rating;
    
    // Default: Best Match
    const matchA = computeQuickMatch(a.item, userPreferences).overallScore;
    const matchB = computeQuickMatch(b.item, userPreferences).overallScore;
    return matchB - matchA;
  });

  return (
    <section className="py-10 bg-[#0A0A0B] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFA000] text-black flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Wallet className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                BITE BUDGET DISCOVERY
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                Filter dishes by your target wallet limit with dynamic match scoring
              </p>
            </div>
          </div>

          {/* Sort Pill Buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white/[0.04] p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 ml-1.5" />
            <button
              onClick={() => setSortBy('match')}
              className={`px-3 py-1.5 rounded-xl uppercase text-[10px] font-black tracking-wider transition-all ${
                sortBy === 'match' ? 'bg-[#FF6B00] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Best Match
            </button>
            <button
              onClick={() => setSortBy('cheapest')}
              className={`px-3 py-1.5 rounded-xl uppercase text-[10px] font-black tracking-wider transition-all ${
                sortBy === 'cheapest' ? 'bg-[#FF6B00] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cheapest
            </button>
            <button
              onClick={() => setSortBy('fastest')}
              className={`px-3 py-1.5 rounded-xl uppercase text-[10px] font-black tracking-wider transition-all ${
                sortBy === 'fastest' ? 'bg-[#FF6B00] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Fastest
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1.5 rounded-xl uppercase text-[10px] font-black tracking-wider transition-all ${
                sortBy === 'rating' ? 'bg-[#FF6B00] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* Budget Tiers Scroller */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {BUDGET_TIERS.map(tier => {
            const isSelected = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border flex flex-col items-center gap-0.5 ${
                  isSelected
                    ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-lg shadow-orange-500/25 scale-105'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10 hover:border-[#FF6B00]/40'
                }`}
              >
                <span className="text-sm font-black">{tier.label}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-black/80' : 'text-zinc-500'}`}>
                  {tier.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {sorted.slice(0, 6).map(({ item, restaurant }) => {
              const match = computeQuickMatch(item, userPreferences);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="group bg-[#121215] rounded-[28px] p-3.5 border border-white/10 hover:border-[#FF6B00]/50 hover:shadow-2xl transition-all duration-300 flex items-center justify-between gap-3.5 cursor-pointer"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-zinc-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <VegBadge isVeg={item.isVeg} size="sm" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate">{restaurant.name}</span>
                      <MatchScoreBadge score={match.overallScore} result={match} size="sm" />
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-white truncate group-hover:text-[#FF8500] transition-colors">
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-0.5 text-amber-400 font-black">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {item.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 font-medium">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {item.prepTimeMinutes}m
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5">
                      <span className="text-sm font-black text-white">₹{item.price}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1);
                        }}
                        className="px-3 py-1 rounded-xl bg-[#FF6B00] hover:bg-[#FF8500] text-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-md shadow-orange-500/20 active:scale-95"
                      >
                        <ShoppingBag className="w-3 h-3 stroke-[2.5]" />
                        <span>ADD</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center bg-white/[0.02] rounded-3xl border border-white/10">
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">No dishes found in this specific budget tier.</p>
          </div>
        )}

      </div>
    </section>
  );
};
