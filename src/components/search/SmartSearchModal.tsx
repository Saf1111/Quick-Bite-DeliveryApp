import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, Restaurant } from '../../types';
import { VegBadge, MatchScoreBadge } from '../brand/Badges';
import { Search, X, Clock, Star, Sparkles, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
import { computeQuickMatch } from '../../services/recommendation';

export const SmartSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    restaurants,
    userPreferences,
    addToCart,
    setSelectedRestaurantId,
    setActiveView
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'dishes' | 'restaurants'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  // Flatten all items
  const allDishes: { item: MenuItem; restaurant: Restaurant }[] = [];
  restaurants.forEach(rest => {
    rest.menu.forEach(item => {
      allDishes.push({ item, restaurant: rest });
    });
  });

  // Filter items
  const q = query.trim().toLowerCase();
  const matchedDishes = q
    ? allDishes.filter(
        d =>
          d.item.name.toLowerCase().includes(q) ||
          d.item.description.toLowerCase().includes(q) ||
          d.item.cuisine.toLowerCase().includes(q) ||
          d.item.tags.some(t => t.toLowerCase().includes(q))
      )
    : allDishes.slice(0, 4);

  const matchedRestaurants = q
    ? restaurants.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.cuisines.some(c => c.toLowerCase().includes(q))
      )
    : restaurants.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 text-zinc-100">
      <div
        id="smart-search-modal-container"
        className="w-full max-w-2xl bg-[#121215] rounded-[32px] shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Box */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-black/40">
          <Search className="w-5 h-5 text-[#FF6B00] shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search high protein meals, biryani, salads, Kowdiar kitchens..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base font-bold text-white placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2.5 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Filter Subtabs */}
        <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/10 flex items-center gap-2 text-xs font-bold">
          <span className="text-zinc-500 uppercase text-[10px] tracking-wider mr-1">Filter:</span>
          {(['all', 'dishes', 'restaurants'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-xl uppercase tracking-wider text-[10px] font-black transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-[#FF6B00] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Quick Suggestions when empty query */}
          {!q && (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                Trending Discoveries in Trivandrum
              </p>
              <div className="flex flex-wrap gap-2">
                {['High Protein', 'Less Oil', 'Quick 15', 'Kerala Biryani', 'Kowdiar', 'Technopark'].map(chip => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#FF6B00]/20 hover:text-[#FF8500] text-zinc-300 border border-white/10 text-xs font-bold transition-colors cursor-pointer"
                  >
                    🔥 {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dishes Section */}
          {(filterType === 'all' || filterType === 'dishes') && matchedDishes.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                Matching Dishes ({matchedDishes.length})
              </p>
              <div className="space-y-2">
                {matchedDishes.map(({ item, restaurant }) => {
                  const match = computeQuickMatch(item, userPreferences);
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <VegBadge isVeg={item.isVeg} size="sm" />
                            <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {restaurant.name} • {item.cuisine}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MatchScoreBadge score={match.overallScore} result={match} size="sm" />
                        <span className="text-xs font-black text-white">₹{item.price}</span>
                        <button
                          onClick={() => {
                            addToCart(item, 1);
                            setIsSearchModalOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8500] text-black text-xs font-black uppercase tracking-wider transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 stroke-[2.5]" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Restaurants Section */}
          {(filterType === 'all' || filterType === 'restaurants') && matchedRestaurants.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                Matching Kitchens & Places ({matchedRestaurants.length})
              </p>
              <div className="space-y-2">
                {matchedRestaurants.map(r => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRestaurantId(r.id);
                      setActiveView('restaurant');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={r.coverImage}
                        alt={r.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-white truncate">{r.name}</h4>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {r.cuisines.join(', ')} • {r.area}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 font-black text-[#FFA000]">
                        <Star className="w-3.5 h-3.5 fill-[#FFA000] text-[#FFA000]" />
                        {r.rating}
                      </span>
                      <ArrowRight className="w-4 h-4 text-zinc-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q && matchedDishes.length === 0 && matchedRestaurants.length === 0 && (
            <div className="py-12 text-center text-zinc-500 text-xs">
              No dishes or restaurants found for "{query}". Try searching for another item or area.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
