import React, { useState } from 'react';
import { LIFESTYLE_CATEGORIES, FOOD_PREFERENCE_CATEGORIES, HEALTH_CONSCIOUS_TAGS } from '../../constants/categories';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CategoryPillsProps {
  selectedTag: string | null;
  onSelectTag: (tagId: string | null) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ selectedTag, onSelectTag }) => {
  const { setIsProfileModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'lifestyle' | 'food_pref' | 'health'>('lifestyle');

  return (
    <section className="py-7 border-b border-white/10 bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header & Subtabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              DISCOVER BY CATEGORY
            </h3>
            {selectedTag && (
              <button
                onClick={() => onSelectTag(null)}
                className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] hover:text-[#FFA000] bg-[#FF6B00]/15 border border-[#FF6B00]/30 px-2.5 py-0.5 rounded-full"
              >
                Clear filter ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('lifestyle')}
              className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider text-[11px] font-black transition-all ${
                activeTab === 'lifestyle' ? 'bg-[#FF6B00] text-black shadow-md shadow-orange-500/20' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🏋️ Lifestyle
            </button>
            <button
              onClick={() => setActiveTab('food_pref')}
              className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider text-[11px] font-black transition-all ${
                activeTab === 'food_pref' ? 'bg-[#FF6B00] text-black shadow-md shadow-orange-500/20' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🍛 Flavours
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider text-[11px] font-black transition-all ${
                activeTab === 'health' ? 'bg-emerald-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🍃 Health
            </button>
          </div>
        </div>

        {/* Scrollable Pills List */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {/* "All" reset pill */}
          <button
            onClick={() => onSelectTag(null)}
            className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
              selectedTag === null
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10'
            }`}
          >
            🔥 All Curations
          </button>

          {/* Active Tab Categories */}
          {activeTab === 'lifestyle' &&
            LIFESTYLE_CATEGORIES.map((cat) => {
              const isSelected = selectedTag === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectTag(isSelected ? null : cat.id)}
                  className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
                    isSelected
                      ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-lg shadow-orange-500/25 scale-105'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border-white/10 hover:border-[#FF6B00]/40'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}

          {activeTab === 'food_pref' &&
            FOOD_PREFERENCE_CATEGORIES.map((cat) => {
              const isSelected = selectedTag === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectTag(isSelected ? null : cat.id)}
                  className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
                    isSelected
                      ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-lg shadow-orange-500/25 scale-105'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border-white/10 hover:border-[#FF6B00]/40'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}

          {activeTab === 'health' &&
            HEALTH_CONSCIOUS_TAGS.map((cat) => {
              const isSelected = selectedTag === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectTag(isSelected ? null : cat.id)}
                  className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
                    isSelected
                      ? 'bg-emerald-400 text-black border-emerald-400 shadow-lg shadow-emerald-500/25 scale-105'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border-white/10 hover:border-emerald-400/40'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}

          {/* Quick Profile Tuner Trigger Pill */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[#FF8500] bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border border-dashed border-[#FF6B00]/40 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>More Goals...</span>
          </button>
        </div>

      </div>
    </section>
  );
};
