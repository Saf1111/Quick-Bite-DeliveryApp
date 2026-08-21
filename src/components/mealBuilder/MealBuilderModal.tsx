import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MEAL_BASES,
  MEAL_PROTEINS,
  MEAL_VEGETABLES,
  MEAL_EXTRAS,
  MEAL_SAUCES
} from '../../constants/mealBuilderData';
import { MealBuilderIngredient, MenuItem } from '../../types';
import {
  UtensilsCrossed,
  X,
  Check,
  Sparkles,
  ShoppingBag,
  Flame,
  Clock,
  Plus,
  Minus,
  Layers
} from 'lucide-react';
import { VegBadge } from '../brand/Badges';

export const MealBuilderModal: React.FC = () => {
  const { isMealBuilderOpen, setIsMealBuilderOpen, addToCart } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedBase, setSelectedBase] = useState<MealBuilderIngredient>(MEAL_BASES[0]);
  const [selectedProtein, setSelectedProtein] = useState<MealBuilderIngredient>(MEAL_PROTEINS[0]);
  const [selectedVeggies, setSelectedVeggies] = useState<MealBuilderIngredient[]>([MEAL_VEGETABLES[0], MEAL_VEGETABLES[1]]);
  const [selectedExtras, setSelectedExtras] = useState<MealBuilderIngredient[]>([MEAL_EXTRAS[0]]);
  const [selectedSauce, setSelectedSauce] = useState<MealBuilderIngredient>(MEAL_SAUCES[0]);

  if (!isMealBuilderOpen) return null;

  const toggleVeggie = (veg: MealBuilderIngredient) => {
    setSelectedVeggies(prev => {
      const exists = prev.some(v => v.id === veg.id);
      if (exists) {
        if (prev.length <= 1) return prev; // At least one veggie
        return prev.filter(v => v.id !== veg.id);
      } else {
        if (prev.length >= 3) return prev; // Max 3 veggies
        return [...prev, veg];
      }
    });
  };

  const toggleExtra = (extra: MealBuilderIngredient) => {
    setSelectedExtras(prev => {
      const exists = prev.some(e => e.id === extra.id);
      if (exists) return prev.filter(e => e.id !== extra.id);
      return [...prev, extra];
    });
  };

  // Dynamic calculations
  const totalPrice =
    selectedBase.price +
    selectedProtein.price +
    selectedVeggies.reduce((sum, v) => sum + v.price, 0) +
    selectedExtras.reduce((sum, e) => sum + e.price, 0) +
    selectedSauce.price;

  const totalCalories =
    selectedBase.calories +
    selectedProtein.calories +
    selectedVeggies.reduce((sum, v) => sum + v.calories, 0) +
    selectedExtras.reduce((sum, e) => sum + e.calories, 0) +
    selectedSauce.calories;

  const totalProtein = Math.round(
    selectedBase.proteinG +
      selectedProtein.proteinG +
      selectedVeggies.reduce((sum, v) => sum + v.proteinG, 0) +
      selectedExtras.reduce((sum, e) => sum + e.proteinG, 0) +
      selectedSauce.proteinG
  );

  const isPureVeg =
    selectedBase.isVeg &&
    selectedProtein.isVeg &&
    selectedVeggies.every(v => v.isVeg) &&
    selectedExtras.every(e => e.isVeg) &&
    selectedSauce.isVeg;

  const handleAddToCart = () => {
    const customItem: MenuItem = {
      id: `custom-meal-${Date.now()}`,
      restaurantId: 'rest-sreekaryam-fit-kitchen',
      restaurantName: 'NutriBite & High Protein Kitchen',
      name: `Custom Meal: ${selectedProtein.name} + ${selectedBase.name}`,
      description: `Crafted with ${selectedBase.name}, ${selectedProtein.name}, ${selectedVeggies.map(v => v.name).join(', ')}, ${selectedExtras.map(e => e.name).join(', ')} & ${selectedSauce.name}.`,
      price: totalPrice,
      image: selectedProtein.image,
      isVeg: isPureVeg,
      prepTimeMinutes: 14,
      rating: 5.0,
      ratingCount: 1,
      category: 'Build My Meal',
      cuisine: 'Custom Fusion',
      tags: ['fitness', 'high-protein', 'healthy', 'custom-craft'],
      spiceLevel: 2,
      nutrition: {
        calories: totalCalories,
        proteinGrams: totalProtein,
        carbsGrams: 45,
        fatGrams: 14,
        sodiumMg: 340
      },
      available: true
    };

    addToCart(customItem, 1);
    setIsMealBuilderOpen(false);
  };

  const steps = [
    { num: 1, label: '1. Base' },
    { num: 2, label: '2. Protein' },
    { num: 3, label: '3. Veggies' },
    { num: 4, label: '4. Extras' },
    { num: 5, label: '5. Sauce' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 text-zinc-100">
      <div
        id="meal-builder-modal"
        className="w-full max-w-4xl bg-[#121215] rounded-[32px] shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Top Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center text-white font-black">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl">Build My Meal Studio</h3>
              <p className="text-xs text-emerald-100 font-medium">Assemble fresh base, lean proteins, veggies & chef dressings</p>
            </div>
          </div>
          <button
            onClick={() => setIsMealBuilderOpen(false)}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentStep === s.num
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white bg-white/[0.04] border border-white/10'
              }`}
            >
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Main Workspace */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Selector Panel */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Step 1: Base */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Choose Foundation Base</h4>
                  <span className="text-xs text-zinc-400 font-bold">Select 1</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MEAL_BASES.map(base => {
                    const isSelected = selectedBase.id === base.id;
                    return (
                      <button
                        key={base.id}
                        onClick={() => setSelectedBase(base)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/20 shadow-md ring-1 ring-emerald-500/40'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                        }`}
                      >
                        <img src={base.image} alt={base.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white truncate">{base.name}</p>
                          <p className="text-[11px] text-zinc-400">{base.calories} kcal • {base.proteinG}g protein</p>
                          <p className="text-xs font-black text-emerald-400">₹{base.price}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Protein */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Choose Core Protein</h4>
                  <span className="text-xs text-zinc-400 font-bold">Select 1</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MEAL_PROTEINS.map(prot => {
                    const isSelected = selectedProtein.id === prot.id;
                    return (
                      <button
                        key={prot.id}
                        onClick={() => setSelectedProtein(prot)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/20 shadow-md ring-1 ring-emerald-500/40'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                        }`}
                      >
                        <img src={prot.image} alt={prot.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <VegBadge isVeg={prot.isVeg} size="sm" />
                            <p className="text-xs font-black text-white truncate">{prot.name}</p>
                          </div>
                          <p className="text-[11px] text-zinc-400">{prot.calories} kcal • {prot.proteinG}g protein</p>
                          <p className="text-xs font-black text-emerald-400">₹{prot.price}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Veggies */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Select Fresh Veggies</h4>
                  <span className="text-xs text-zinc-400 font-bold">Pick 1 to 3 ({selectedVeggies.length}/3)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MEAL_VEGETABLES.map(veg => {
                    const isSelected = selectedVeggies.some(v => v.id === veg.id);
                    return (
                      <button
                        key={veg.id}
                        onClick={() => toggleVeggie(veg)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/20 shadow-md'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                        }`}
                      >
                        <img src={veg.image} alt={veg.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white truncate">{veg.name}</p>
                          <p className="text-[11px] text-zinc-400">{veg.calories} kcal</p>
                          <p className="text-xs font-black text-emerald-400">+₹{veg.price}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Extras */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Super-Crunch Extras</h4>
                  <span className="text-xs text-zinc-400 font-bold">Add healthy fats & crunch</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MEAL_EXTRAS.map(extra => {
                    const isSelected = selectedExtras.some(e => e.id === extra.id);
                    return (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/20 shadow-md'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                        }`}
                      >
                        <img src={extra.image} alt={extra.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white truncate">{extra.name}</p>
                          <p className="text-[11px] text-zinc-400">+{extra.proteinG}g protein</p>
                          <p className="text-xs font-black text-emerald-400">+₹{extra.price}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Sauce */}
            {currentStep === 5 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Chef Drizzle & Gravy</h4>
                  <span className="text-xs text-zinc-400 font-bold">Select 1</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MEAL_SAUCES.map(sauce => {
                    const isSelected = selectedSauce.id === sauce.id;
                    return (
                      <button
                        key={sauce.id}
                        onClick={() => setSelectedSauce(sauce)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/20 shadow-md'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                        }`}
                      >
                        <img src={sauce.image} alt={sauce.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white truncate">{sauce.name}</p>
                          <p className="text-[11px] text-zinc-400">{sauce.calories} kcal</p>
                          <p className="text-xs font-black text-emerald-400">+₹{sauce.price}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step navigation buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 disabled:opacity-30 cursor-pointer"
              >
                Back
              </button>

              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black shadow-md cursor-pointer"
                >
                  Next Step ({currentStep + 1}/5) →
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FF6B00] hover:bg-[#FF8500] text-black shadow-lg shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Custom Bite to Cart</span>
                </button>
              )}
            </div>

          </div>

          {/* Right / Live Assembled Visual Plate & Nutrition Calculator */}
          <div className="lg:col-span-5 bg-black/60 text-white rounded-[28px] p-5 flex flex-col justify-between shadow-2xl border border-white/10">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Your Quick Bite Assembly
                </span>
                <VegBadge isVeg={isPureVeg} size="sm" />
              </div>

              {/* Dynamic Visual Plate Representation */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 p-3 flex items-center justify-center">
                <img
                  src={selectedProtein.image}
                  alt={selectedProtein.name}
                  className="w-full h-full object-cover rounded-xl transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-left">
                  <p className="text-xs font-black text-white truncate">{selectedProtein.name}</p>
                  <p className="text-[10px] text-emerald-300 font-bold uppercase">over {selectedBase.name}</p>
                </div>
              </div>

              {/* Chosen Ingredients List */}
              <div className="space-y-1.5 text-xs text-zinc-300 bg-white/[0.03] p-3.5 rounded-2xl border border-white/10">
                <p className="font-black text-[10px] text-zinc-500 uppercase tracking-wider">Selected Ingredients:</p>
                <p className="text-[11px]">🍚 <strong className="text-white">Base:</strong> {selectedBase.name}</p>
                <p className="text-[11px]">🥩 <strong className="text-white">Protein:</strong> {selectedProtein.name}</p>
                <p className="text-[11px]">🥦 <strong className="text-white">Veggies:</strong> {selectedVeggies.map(v => v.name).join(', ')}</p>
                {selectedExtras.length > 0 && (
                  <p className="text-[11px]">🥜 <strong className="text-white">Extras:</strong> {selectedExtras.map(e => e.name).join(', ')}</p>
                )}
                <p className="text-[11px]">🥣 <strong className="text-white">Sauce:</strong> {selectedSauce.name}</p>
              </div>

              {/* Live Nutrition Summary */}
              <div className="grid grid-cols-3 gap-2 bg-white/[0.03] p-3 rounded-2xl border border-white/10 text-center">
                <div>
                  <p className="text-base font-black text-emerald-400">{totalProtein}g</p>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-wider">Protein</p>
                </div>
                <div>
                  <p className="text-base font-black text-amber-400">{totalCalories}</p>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-wider">Calories</p>
                </div>
                <div>
                  <p className="text-base font-black text-sky-400">~14m</p>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-wider">Prep Time</p>
                </div>
              </div>

            </div>

            {/* Price & Add CTA */}
            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-white">₹{totalPrice}</span>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Custom meal kit</p>
              </div>

              <button
                id="builder-order-final-btn"
                onClick={handleAddToCart}
                className="px-5 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Cart</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
