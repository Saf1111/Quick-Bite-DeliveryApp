import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPreferences } from '../../types';
import { Sparkles, SlidersHorizontal, Check, X, Flame, Shield, Award } from 'lucide-react';
import { HEALTH_CONSCIOUS_TAGS, LIFESTYLE_CATEGORIES } from '../../constants/categories';

export const QuickProfileModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, userPreferences, updateUserPreferences } = useApp();

  const [dietType, setDietType] = useState<UserPreferences['dietType']>(userPreferences.dietType);
  const [lifestyle, setLifestyle] = useState<string[]>(userPreferences.lifestyle);
  const [healthConcerns, setHealthConcerns] = useState<string[]>(userPreferences.healthConcerns);
  const [spiceTolerance, setSpiceTolerance] = useState<UserPreferences['spiceTolerance']>(userPreferences.spiceTolerance);
  const [maxBudget, setMaxBudget] = useState<number>(userPreferences.maxBudget);

  if (!isProfileModalOpen) return null;

  const toggleLifestyle = (id: string) => {
    setLifestyle(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const toggleHealth = (id: string) => {
    setHealthConcerns(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleSave = () => {
    const updated: UserPreferences = {
      dietType,
      lifestyle,
      healthConcerns,
      spiceTolerance,
      maxBudget,
      favCuisines: userPreferences.favCuisines
    };
    updateUserPreferences(updated);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 text-zinc-100">
      <div
        id="quick-profile-modal"
        className="w-full max-w-xl bg-[#121215] rounded-[32px] shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FF6B00] to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl">Quick Profile & Match Tuner</h3>
              <p className="text-xs text-white/80 font-medium">Personalize recommendations across all Trivandrum kitchens</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* 1. Dietary Core */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
              1. How do you usually eat? (Dietary Core)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All Diets', icon: '🍽️' },
                { id: 'vegetarian', label: 'Vegetarian', icon: '🌱' },
                { id: 'non-vegetarian', label: 'Non-Veg', icon: '🍗' },
                { id: 'vegan', label: 'Strict Vegan', icon: '🍃' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDietType(opt.id as UserPreferences['dietType'])}
                  className={`p-3 rounded-2xl border text-xs font-black uppercase tracking-wider flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    dietType === opt.id
                      ? 'border-[#FF6B00] bg-[#FF6B00]/20 text-white shadow-md'
                      : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-center leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Lifestyle Preferences */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
              2. Lifestyle & Daily Habits
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LIFESTYLE_CATEGORIES.map(cat => {
                const isSelected = lifestyle.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleLifestyle(cat.id)}
                    className={`px-3 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Health-Conscious Preferences */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
                3. Health-Conscious Filters
              </label>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Multi-select</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {HEALTH_CONSCIOUS_TAGS.map(tag => {
                const isSelected = healthConcerns.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleHealth(tag.id)}
                    className={`px-3 py-2 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{tag.icon}</span>
                      <span className="truncate">{tag.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Spice Tolerance */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
              4. Kerala Spice Tolerance
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'mild', label: 'Mild', flames: 1 },
                { id: 'medium', label: 'Medium', flames: 2 },
                { id: 'high', label: 'Spicy', flames: 3 },
                { id: 'fire', label: 'Extra Hot', flames: 4 }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => setSpiceTolerance(lvl.id as UserPreferences['spiceTolerance'])}
                  className={`p-2.5 rounded-2xl border text-xs font-black uppercase tracking-wider flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    spiceTolerance === lvl.id
                      ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                      : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: lvl.flames }).map((_, idx) => (
                      <Flame key={idx} className="w-3 h-3 text-rose-500 fill-rose-500" />
                    ))}
                  </div>
                  <span>{lvl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Max Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black text-zinc-300 uppercase tracking-wider">
              <span>5. Max Target Budget per Dish</span>
              <span className="text-[#FF8500] font-black text-sm">₹{maxBudget}</span>
            </div>
            <input
              type="range"
              min="80"
              max="600"
              step="20"
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>₹80 (Budget Saver)</span>
              <span>₹250 (Standard)</span>
              <span>₹600+ (Gourmet)</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-black/40 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              setDietType('all');
              setLifestyle(['fitness', 'quick15']);
              setHealthConcerns([]);
              setSpiceTolerance('medium');
              setMaxBudget(350);
            }}
            className="text-xs text-zinc-400 hover:text-white font-bold underline cursor-pointer"
          >
            Reset to Defaults
          </button>
          <button
            id="save-quick-profile-btn"
            onClick={handleSave}
            className="px-6 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply & Recalculate Scores</span>
          </button>
        </div>
      </div>
    </div>
  );
};
