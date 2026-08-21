import React, { useState } from 'react';
import { Restaurant, MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { PartnerBadge, VegBadge, MatchScoreBadge } from '../brand/Badges';
import { FoodCard } from './FoodCard';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
  Share2,
  Heart,
  Phone,
  ShieldCheck,
  Sparkles,
  MessageSquarePlus,
  ThumbsUp
} from 'lucide-react';
import { computeQuickMatch } from '../../services/recommendation';

interface RestaurantDetailViewProps {
  restaurantId: string;
  onBack: () => void;
}

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({
  restaurantId,
  onBack
}) => {
  const { restaurants, userPreferences, favoriteRestaurantIds, toggleFavoriteRestaurant, showToast } = useApp();

  const restaurant = restaurants.find(r => r.id === restaurantId);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewInput, setShowReviewInput] = useState(false);

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4 text-zinc-100">
        <h3 className="text-xl font-bold text-white">Restaurant not found</h3>
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-[#FF6B00] text-black text-xs font-black uppercase tracking-wider"
        >
          Return to Discovery
        </button>
      </div>
    );
  }

  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);

  // Compute average Quick Match score across restaurant's menu items
  const menuItems = restaurant.menu || [];
  const avgMatchScore =
    menuItems.length > 0
      ? Math.round(
          menuItems.reduce(
            (sum, item) => sum + computeQuickMatch(item, userPreferences).overallScore,
            0
          ) / menuItems.length
        )
      : 88;

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTag = item.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Restaurant link copied to clipboard!');
    }
  };

  const handleAddReview = () => {
    if (!newReviewText.trim()) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      restaurantId: restaurant.id,
      userName: 'Alex Thomas (You)',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewText,
      helpfulCount: 0
    };
    restaurant.reviews = [newRev, ...(restaurant.reviews || [])];
    setNewReviewText('');
    setShowReviewInput(false);
    showToast('Your review was published!');
  };

  return (
    <div className="bg-[#0A0A0B] min-h-screen pb-16 text-zinc-100 selection:bg-[#FF6B00] selection:text-black">
      {/* Top Floating Back Bar */}
      <div className="bg-[#121215]/90 backdrop-blur-xl border-b border-white/10 sticky top-20 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-black text-zinc-400 hover:text-[#FF6B00] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-2xl text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavoriteRestaurant(restaurant.id)}
              className="p-2 rounded-2xl text-zinc-400 hover:text-rose-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Cover & Brand Info Header */}
        <div className="relative bg-[#121215] rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 bg-gradient-to-l from-[#FF6B00] to-transparent pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Logo / Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#FF6B00]/30 shadow-lg shrink-0 bg-zinc-900">
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <PartnerBadge isPartner={restaurant.isPartner} size="sm" />
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                    {restaurant.openingHours}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {restaurant.name}
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                  {restaurant.cuisines.join(' • ')}
                </p>

                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>{restaurant.address}</span>
                </p>
              </div>
            </div>

            {/* Right Metric Cluster */}
            <div className="flex flex-wrap md:flex-col items-center md:items-end gap-3 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 bg-[#FF6B00]/15 px-3 py-1.5 rounded-xl border border-[#FF6B00]/30 shadow-sm">
                <Star className="w-4 h-4 fill-[#FFA000] text-[#FFA000]" />
                <span className="text-sm font-black text-white">{restaurant.rating}</span>
                <span className="text-[11px] text-zinc-400">({restaurant.ratingCount} reviews)</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>~{restaurant.avgDeliveryTimeMin} min delivery</span>
                <span>•</span>
                <span>₹{restaurant.priceForTwo} for two</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-black text-[#FF8500] bg-[#FF6B00]/15 px-3 py-1 rounded-xl border border-[#FF6B00]/30 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{avgMatchScore}% Overall Diet Match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Search & Category Filter Bar */}
        {restaurant.isPartner && (
          <div className="bg-[#121215] rounded-2xl p-4 border border-white/10 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search menu */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes, ingredients or diet tags in menu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            {/* Quick Veg Filter Switch */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer ${
                vegOnly
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                  : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white'
              }`}
            >
              <VegBadge isVeg={true} size="sm" />
              <span>Veg Only</span>
            </button>
          </div>
        )}

        {/* Category Navigation Pills */}
        {restaurant.isPartner && restaurant.menuCategories && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#FF6B00] text-black shadow-lg shadow-orange-500/20'
                  : 'bg-[#121215] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              All Items ({menuItems.length})
            </button>

            {restaurant.menuCategories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#FF6B00] text-black shadow-lg shadow-orange-500/20'
                    : 'bg-[#121215] text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items Grid */}
        {restaurant.isPartner ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                {activeCategory === 'all' ? 'Recommended Menu' : activeCategory} ({filteredItems.length})
              </h3>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-[#121215] rounded-3xl border border-white/10">
                <p className="text-xs text-zinc-500 font-medium">
                  No food items matching your current search or diet filters.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Discovered Nearby Place Notice */
          <div className="bg-[#121215] rounded-[32px] p-8 border border-white/10 text-center space-y-4 max-w-2xl mx-auto shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-white/10 text-[#FF6B00] flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Discovered Nearby Establishment</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This is a discovered local landmark in {restaurant.area}, Thiruvananthapuram. Quick Bite order delivery integration is currently in onboarding for this location. You can visit in person or contact them directly at {restaurant.phone}.
            </p>
          </div>
        )}

        {/* Reviews & Community Feedback */}
        <div className="bg-[#121215] rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">Ratings & Customer Reviews</h3>
              <p className="text-xs text-zinc-400">Authentic feedback from food lovers in Trivandrum</p>
            </div>

            <button
              onClick={() => setShowReviewInput(!showReviewInput)}
              className="px-3.5 py-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-[#FF8500] border border-white/10 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Write Review Drawer / Form */}
          {showReviewInput && (
            <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/10 space-y-3 animate-in fade-in">
              <p className="text-xs font-black text-white uppercase tracking-wider">Share your dining experience:</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">Your Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 text-zinc-600 hover:text-amber-400 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={3}
                placeholder="What did you like about the flavor, spice balance, or delivery speed?"
                value={newReviewText}
                onChange={e => setNewReviewText(e.target.value)}
                className="w-full p-3 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF6B00] bg-white/[0.04]"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReviewInput(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReview}
                  className="px-4 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8500] text-black text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              restaurant.reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{rev.userName}</span>
                    <span className="text-[11px] text-zinc-500">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rev.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-700'
                        }`}
                      />
                    ))}
                    {rev.foodItemName && (
                      <span className="text-[10px] text-[#FF8500] bg-[#FF6B00]/15 px-2 py-0.5 rounded-full font-bold ml-2 border border-[#FF6B00]/30">
                        {rev.foodItemName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic">No reviews yet. Be the first to share feedback!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
