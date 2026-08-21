import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { CategoryPills } from './CategoryPills';
import { Quick15Section } from './Quick15Section';
import { BiteBudgetSection } from './BiteBudgetSection';
import { HowToUseSection } from './HowToUseSection';
import { FoodCard } from '../restaurant/FoodCard';
import { RestaurantCard } from '../restaurant/RestaurantCard';
import { FoodCustomizeModal } from '../restaurant/FoodCustomizeModal';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';
import { Sparkles, Utensils, Store, Compass, ArrowRight } from 'lucide-react';
import { computeQuickMatch } from '../../services/recommendation';

export const HomeView: React.FC = () => {
  const {
    restaurants,
    locationZone,
    userPreferences,
    setSelectedRestaurantId,
    setActiveView
  } = useApp();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);

  // Flatten all menu items
  const allItems: MenuItem[] = [];
  restaurants.forEach(rest => {
    if (rest.isOpen) {
      allItems.push(...rest.menu);
    }
  });

  // Filter items by tag
  const filteredItems = selectedTag
    ? allItems.filter(item =>
        item.tags.includes(selectedTag) ||
        (selectedTag === 'vegetarian' && item.isVeg) ||
        (selectedTag === 'non-vegetarian' && !item.isVeg) ||
        item.category.toLowerCase().includes(selectedTag.toLowerCase())
      )
    : allItems;

  // Sort by Quick Match score
  const matchedItems = [...filteredItems].sort((a, b) => {
    const scoreA = computeQuickMatch(a, userPreferences).overallScore;
    const scoreB = computeQuickMatch(b, userPreferences).overallScore;
    return scoreB - scoreA;
  });

  return (
    <div className="bg-[#0A0A0B] text-[#F9FAFB] min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Category & Diet Pill Filter Bar */}
      <CategoryPills selectedTag={selectedTag} onSelectTag={setSelectedTag} />

      {/* 3. Quick 15 Express Priority Row */}
      <Quick15Section onSelectItem={item => setSelectedDishForModal(item)} />

      {/* 4. Bite Budget Discovery Engine */}
      <BiteBudgetSection onSelectItem={item => setSelectedDishForModal(item)} />

      {/* 5. Personalized Quick Match Top Recommendations */}
      <section className="py-12 bg-[#0A0A0B] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] text-black flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Sparkles className="w-5 h-5 fill-black stroke-black" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    PERSONALIZED QUICK MATCH
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">
                    Tailored food recommendations for {userPreferences.dietType} diet in {locationZone.name}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveView('map')}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FF8500] hover:text-[#FFA000] bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border border-[#FF6B00]/30 px-3.5 py-2 rounded-2xl transition-colors self-start sm:self-auto"
            >
              <span>Explore district map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {matchedItems.slice(0, 8).map(item => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>

        </div>
      </section>

      {/* 6. Partner Kitchens & Local Establishments in Thiruvananthapuram */}
      <section id="kitchens-section" className="py-14 bg-[#0D0E12] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Store className="w-5 h-5 fill-black stroke-black" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  KITCHENS & LOCAL ESTABLISHMENTS
                </h2>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">
                  Delivering across Technopark, Kowdiar, Kazhakkoottam, Sreekaryam & greater Trivandrum
                </p>
              </div>
            </div>
          </div>

          {/* Restaurant Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(rest => (
              <RestaurantCard
                key={rest.id}
                restaurant={rest}
                onClick={() => {
                  setSelectedRestaurantId(rest.id);
                  setActiveView('restaurant');
                }}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 7. How To Use Quick Bite - Interactive Tutorial Section */}
      <HowToUseSection />

      {/* Customization modal trigger if dish clicked */}
      {selectedDishForModal && (
        <FoodCustomizeModal
          item={selectedDishForModal}
          onClose={() => setSelectedDishForModal(null)}
        />
      )}
    </div>
  );
};
