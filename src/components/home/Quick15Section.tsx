import React from 'react';
import { Zap, Clock, Sparkles, ChevronRight, ShoppingBag } from 'lucide-react';
import { MenuItem, Restaurant } from '../../types';
import { useApp } from '../../context/AppContext';
import { VegBadge, MatchScoreBadge } from '../brand/Badges';
import { computeQuickMatch } from '../../services/recommendation';

interface Quick15SectionProps {
  onSelectItem: (item: MenuItem) => void;
}

export const Quick15Section: React.FC<Quick15SectionProps> = ({ onSelectItem }) => {
  const { restaurants, userPreferences, locationZone, addToCart } = useApp();

  // Gather all Quick 15 eligible items from partner restaurants
  const quick15Items: { item: MenuItem; restaurant: Restaurant }[] = [];
  restaurants.forEach(rest => {
    if (rest.isPartner && rest.isOpen) {
      rest.menu.forEach(item => {
        if (item.isQuick15 || item.prepTimeMinutes <= 12) {
          quick15Items.push({ item, restaurant: rest });
        }
      });
    }
  });

  if (quick15Items.length === 0) return null;

  return (
    <section className="py-10 bg-[#0D0E12] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with High-contrast Bold Typography */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] text-black flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Zap className="w-5 h-5 fill-black stroke-black" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  QUICK 15 EXPRESS
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FF8500] text-[9px] font-black uppercase tracking-widest">
                  ~15-20 MIN TOTAL
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                Freshly prepped & dispatched on priority across {locationZone.name}
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quick15Items.slice(0, 4).map(({ item, restaurant }) => {
            const match = computeQuickMatch(item, userPreferences);

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group relative bg-[#121215] rounded-[28px] p-3.5 border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#FF6B00]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Food Image */}
                <div className="relative aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden mb-3 bg-zinc-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <VegBadge isVeg={item.isVeg} size="sm" />
                    <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border border-white/10">
                      <Clock className="w-2.5 h-2.5 text-[#FF6B00]" />
                      {item.prepTimeMinutes}m prep
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5">
                    <MatchScoreBadge score={match.overallScore} result={match} size="sm" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider truncate">{restaurant.name}</p>
                  <h4 className="text-sm font-black text-white line-clamp-1 group-hover:text-[#FF8500] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                  <div>
                    <span className="text-base font-black text-white">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through ml-1.5 font-semibold">₹{item.originalPrice}</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item, 1);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8500] text-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
