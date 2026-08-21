import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { VegBadge, MatchScoreBadge, SpiceLevelBadge } from '../brand/Badges';
import { useApp } from '../../context/AppContext';
import { computeQuickMatch } from '../../services/recommendation';
import { ShoppingBag, Star, Clock, Heart, SlidersHorizontal, Plus, Minus } from 'lucide-react';
import { FoodCustomizeModal } from './FoodCustomizeModal';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const {
    userPreferences,
    cart,
    addToCart,
    updateCartQuantity,
    favoriteItemIds,
    toggleFavoriteItem
  } = useApp();
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const match = computeQuickMatch(item, userPreferences);
  const isFavorite = favoriteItemIds.includes(item.id);

  // Find matching cart item
  const matchingCartItems = cart.filter(c => c.menuItem.id === item.id);
  const totalQuantityInCart = matchingCartItems.reduce((sum, c) => sum + c.quantity, 0);
  const isAvailable = item.available !== false;

  return (
    <>
      <div
        id={`food-card-${item.id}`}
        className={`group bg-[#121215] rounded-[28px] p-3.5 border shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${
          !isAvailable
            ? 'opacity-65 border-white/5'
            : 'border-white/10 hover:border-[#FF6B00]/50'
        }`}
      >
        {/* Top Image Box */}
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-zinc-900">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <VegBadge isVeg={item.isVeg} size="sm" />
            {item.isBestseller && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00] text-black text-[9px] font-black uppercase tracking-wider shadow-md">
                Bestseller
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                Sold Out for Today
              </span>
            </div>
          )}

          {/* Favorite Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteItem(item.id);
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-rose-500 transition-colors border border-white/10 shadow-sm z-10 cursor-pointer"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>

          {/* Quick Match Badge */}
          {isAvailable && (
            <div className="absolute bottom-2.5 right-2.5 z-10">
              <MatchScoreBadge score={match.overallScore} result={match} size="sm" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate">{item.restaurantName}</p>
            <div className="flex items-center gap-1">
              <SpiceLevelBadge level={item.spiceLevel} />
            </div>
          </div>

          <h4 className="text-sm font-black text-white line-clamp-1 group-hover:text-[#FF8500] transition-colors">
            {item.name}
          </h4>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Dietary & Macro Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {item.nutrition && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                {item.nutrition.proteinGrams}g Protein
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-white/10">
              <Clock className="w-2.5 h-2.5 text-[#FF6B00]" />
              {item.prepTimeMinutes}m
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
          <div>
            <span className="text-base font-black text-white">₹{item.price}</span>
            {item.originalPrice && (
              <span className="text-xs text-zinc-500 line-through ml-1.5 font-semibold">₹{item.originalPrice}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isAvailable && item.optionGroups && item.optionGroups.length > 0 && (
              <button
                onClick={() => setIsCustomizeOpen(true)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold cursor-pointer"
                title="Customize portion & add-ons"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            )}

            {!isAvailable ? (
              <span className="text-[10px] font-black uppercase text-zinc-500 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                Unavailable
              </span>
            ) : totalQuantityInCart > 0 && (!item.optionGroups || item.optionGroups.length === 0) ? (
              <div className="flex items-center gap-2 bg-[#FF6B00] rounded-xl px-2 py-1 shadow-md shadow-orange-500/20 text-black">
                <button
                  onClick={() => {
                    const firstCartItem = matchingCartItems[0];
                    if (firstCartItem) updateCartQuantity(firstCartItem.cartItemId, -1);
                  }}
                  className="p-0.5 hover:bg-black/10 rounded cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <span className="text-xs font-black px-1">{totalQuantityInCart}</span>
                <button
                  onClick={() => {
                    const firstCartItem = matchingCartItems[0];
                    if (firstCartItem) updateCartQuantity(firstCartItem.cartItemId, 1);
                  }}
                  className="p-0.5 hover:bg-black/10 rounded cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (item.optionGroups && item.optionGroups.length > 0) {
                    setIsCustomizeOpen(true);
                  } else {
                    addToCart(item, 1);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8500] text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{item.optionGroups && item.optionGroups.length > 0 ? 'CUSTOMIZE' : 'ADD'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isCustomizeOpen && (
        <FoodCustomizeModal item={item} onClose={() => setIsCustomizeOpen(false)} />
      )}
    </>
  );
};

