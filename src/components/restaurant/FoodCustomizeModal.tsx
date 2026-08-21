import React, { useState } from 'react';
import { MenuItem, CartCustomization } from '../../types';
import { VegBadge, MatchScoreBadge } from '../brand/Badges';
import { X, ShoppingBag, Plus, Minus, Check, Flame } from 'lucide-react';
import { computeQuickMatch } from '../../services/recommendation';
import { useApp } from '../../context/AppContext';

interface FoodCustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const FoodCustomizeModal: React.FC<FoodCustomizeModalProps> = ({ item, onClose }) => {
  const { addToCart, userPreferences } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [groupId: string]: string }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!item) return null;

  const match = computeQuickMatch(item, userPreferences);

  const handleSelectOption = (groupId: string, optionName: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: optionName
    }));
  };

  // Compute total price
  let extraPrice = 0;
  const customizationsList: CartCustomization[] = [];

  if (item.optionGroups) {
    item.optionGroups.forEach(group => {
      const selectedOptName = selectedOptions[group.id];
      if (selectedOptName) {
        const opt = group.options.find(o => o.name === selectedOptName);
        if (opt) {
          extraPrice += opt.priceDelta;
          customizationsList.push({
            groupTitle: group.title,
            selectedOption: opt.name,
            priceDelta: opt.priceDelta
          });
        }
      }
    });
  }

  const finalUnitPrice = item.price + extraPrice;
  const finalTotal = finalUnitPrice * quantity;

  const handleConfirmAdd = () => {
    addToCart(item, quantity, customizationsList, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 text-zinc-100">
      <div
        id="food-customize-modal"
        className="w-full max-w-lg bg-[#121215] rounded-[32px] shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header Image */}
        <div className="relative aspect-video sm:aspect-2/1 bg-zinc-900 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <VegBadge isVeg={item.isVeg} size="sm" />
              <span className="text-xs font-black uppercase tracking-wider text-[#FF8500]">{item.restaurantName}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black">{item.name}</h3>
          </div>
        </div>

        {/* Scrollable Options */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MatchScoreBadge score={match.overallScore} result={match} size="sm" />
              <span className="text-zinc-400 font-bold">⚡ {item.prepTimeMinutes}m prep</span>
            </div>
            <span className="font-black text-white text-base">₹{item.price}</span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">{item.description}</p>

          {/* Option Groups (if available) */}
          {item.optionGroups && item.optionGroups.length > 0 ? (
            item.optionGroups.map(group => (
              <div key={group.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-white uppercase tracking-wider">
                    {group.title} {group.required && <span className="text-rose-500">*</span>}
                  </label>
                  <span className="text-[10px] text-zinc-400 font-bold">Choose 1</span>
                </div>
                <div className="space-y-1.5">
                  {group.options.map(opt => {
                    const isSelected = selectedOptions[group.id] === opt.name;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(group.id, opt.name)}
                        className={`w-full p-3 rounded-2xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF6B00] bg-[#FF6B00]/15 text-white font-black'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#FF6B00] bg-[#FF6B00] text-black' : 'border-zinc-600'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span>{opt.name}</span>
                        </span>
                        <span className="font-black text-white">{opt.priceDelta > 0 ? `+₹${opt.priceDelta}` : 'Free'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3.5 bg-white/[0.03] rounded-2xl border border-white/10 text-xs text-zinc-400">
              Standard chef preparation using authentic local recipe and fresh spice blends.
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
              Special Kitchen Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Less oil, extra curry leaves, mild gravy..."
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF6B00] bg-white/[0.04]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-black/40 border-t border-white/10 flex items-center justify-between gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-black text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="confirm-customize-add-btn"
            onClick={handleConfirmAdd}
            className="flex-1 px-5 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-transform active:scale-95 flex items-center justify-between cursor-pointer"
          >
            <span>Add to Cart</span>
            <span>₹{finalTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
