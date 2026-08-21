import React from 'react';
import { Restaurant } from '../../types';
import { PartnerBadge } from '../brand/Badges';
import { Star, Clock, MapPin, Heart, ChevronRight, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  const { favoriteRestaurantIds, toggleFavoriteRestaurant } = useApp();
  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);

  return (
    <div
      id={`restaurant-card-${restaurant.id}`}
      onClick={onClick}
      className="group relative bg-[#121215] rounded-[28px] p-3.5 border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#FF6B00]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-16/10 rounded-2xl overflow-hidden mb-3.5 bg-zinc-900">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <PartnerBadge isPartner={restaurant.isPartner} size="sm" />
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteRestaurant(restaurant.id);
          }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-rose-500 transition-colors border border-white/10"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
        </button>

        {/* Bottom stats inside image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs font-black">
          <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] uppercase tracking-wider">
            <Clock className="w-3 h-3 text-[#FF6B00]" />
            <span>~{restaurant.avgDeliveryTimeMin} mins</span>
          </div>

          <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] uppercase tracking-wider">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{restaurant.rating}</span>
            <span className="text-zinc-400 font-normal">({restaurant.ratingCount})</span>
          </div>
        </div>
      </div>

      {/* Info Body */}
      <div className="space-y-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-black text-white line-clamp-1 group-hover:text-[#FF8500] transition-colors">
            {restaurant.name}
          </h3>
        </div>

        <p className="text-xs font-medium text-zinc-400 truncate">
          {restaurant.cuisines.join(' • ')}
        </p>

        <p className="text-[11px] text-zinc-400 flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 text-[#FF6B00] shrink-0" />
          <span>{restaurant.area} ({restaurant.distanceKm} km)</span>
        </p>

        {/* Featured Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {restaurant.featuredTags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 text-[9px] font-black uppercase tracking-wider border border-white/10"
            >
              {tag.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs">
        <span className="font-bold text-zinc-300">
          ₹{restaurant.priceForTwo} <span className="font-normal text-zinc-400 text-[11px]">for two</span>
        </span>

        {restaurant.isPartner ? (
          <span className="text-[#FF8500] font-black text-xs uppercase tracking-wider flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            <span>View Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="text-zinc-400 text-[10px] font-black uppercase tracking-wider">
            Discovered Landmark
          </span>
        )}
      </div>
    </div>
  );
};
