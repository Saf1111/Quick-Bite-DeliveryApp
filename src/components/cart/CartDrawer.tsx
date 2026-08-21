import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PROMO_CODES } from '../../constants/promoCodes';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Check
} from 'lucide-react';
import { VegBadge } from '../brand/Badges';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    locationZone,
    setActiveView
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [tipAmount, setTipAmount] = useState<number>(20);

  if (!isCartOpen) return null;

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    const found = PROMO_CODES.find(p => p.code === code);
    if (!found) {
      setPromoError('Invalid coupon. Try QUICKBITE, FIRSTBITE, or TVMFIT');
      return;
    }
    if (cartTotal < found.minOrder) {
      setPromoError(`Minimum order of ₹${found.minOrder} required for ${found.code}`);
      return;
    }

    let discount = 0;
    if (found.discountType === 'percentage') {
      discount = Math.min(Math.round((cartTotal * found.discountValue) / 100), found.maxDiscount);
    } else {
      discount = found.discountValue;
    }

    applyPromoCode({
      code: found.code,
      discountAmount: discount,
      description: found.description
    });
    setPromoInput('');
  };

  const deliveryFee = cartTotal > 300 ? 0 : 25;
  const platformFee = 5;
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const finalGrandTotal = Math.max(0, cartTotal - discountAmount + deliveryFee + platformFee + tipAmount);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#0A0A0B] h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-white/10 text-zinc-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#121215]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FF6B00] text-black flex items-center justify-center font-black shadow-md shadow-orange-500/20">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">Your Quick Bite Bag</h3>
              <p className="text-[11px] text-zinc-400">Delivering to {locationZone.name}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Items Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {cart.length > 0 ? (
            <>
              {/* Delivery Zone Notice */}
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-xs text-[#FF8500]">
                <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span className="truncate">
                  Corridor: <strong className="text-white">{locationZone.name}</strong> (~{locationZone.avgDeliveryMin} mins)
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cart.map((cartItem) => (
                  <div
                    key={cartItem.cartItemId}
                    className="p-3.5 rounded-2xl bg-[#121215] border border-white/10 flex items-start justify-between gap-3 shadow-lg"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <img
                        src={cartItem.menuItem.image}
                        alt={cartItem.menuItem.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover shrink-0 bg-zinc-900 border border-white/10"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <VegBadge isVeg={cartItem.menuItem.isVeg} size="sm" />
                          <h4 className="text-xs font-bold text-white truncate">
                            {cartItem.menuItem.name}
                          </h4>
                        </div>
                        <p className="text-[11px] font-black text-[#FF8500]">
                          ₹{cartItem.itemTotal}
                        </p>

                        {/* Customizations */}
                        {cartItem.customizations && cartItem.customizations.length > 0 && (
                          <div className="text-[10px] text-zinc-400 space-y-0.5">
                            {cartItem.customizations.map((c, idx) => (
                              <p key={idx}>• {c.selectedOption} (+₹{c.priceDelta})</p>
                            ))}
                          </div>
                        )}

                        {cartItem.specialInstructions && (
                          <p className="text-[10px] text-zinc-400 italic">
                            Note: "{cartItem.specialInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl p-1 shadow-inner">
                      <button
                        onClick={() => updateCartQuantity(cartItem.cartItemId, -1)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-black text-white">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(cartItem.cartItemId, 1)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Applicator */}
              <div className="p-3.5 rounded-2xl bg-[#121215] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-white">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Tag className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Apply Coupon / Offer</span>
                  </span>
                  {appliedPromo && (
                    <button
                      onClick={removePromoCode}
                      className="text-[11px] text-rose-400 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedPromo ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs flex items-center justify-between text-emerald-300 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{appliedPromo.code} applied (-₹{appliedPromo.discountAmount})</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-normal">
                      {appliedPromo.description}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. QUICKBITE, FIRSTBITE"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs uppercase font-bold text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FF6B00] text-black text-xs font-black uppercase tracking-wider hover:bg-[#FF8500] cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-[10px] text-rose-400 font-semibold">{promoError}</p>
                )}
              </div>

              {/* Delivery Tip Selector */}
              <div className="space-y-1.5">
                <p className="text-xs font-black text-zinc-300 uppercase tracking-wider">Rider Tip (100% to partner)</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 20, 30, 50].map(tip => (
                    <button
                      key={tip}
                      onClick={() => setTipAmount(tip)}
                      className={`py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        tipAmount === tip
                          ? 'border-[#FF6B00] bg-[#FF6B00]/15 text-[#FF8500] shadow-sm'
                          : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]'
                      }`}
                    >
                      {tip === 0 ? 'No tip' : `₹${tip}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Details Breakdown */}
              <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 text-xs space-y-2">
                <p className="font-black text-white uppercase tracking-wider text-[11px]">
                  Bill Breakdown
                </p>
                <div className="flex justify-between text-zinc-400">
                  <span>Item Subtotal</span>
                  <span className="text-white font-bold">₹{cartTotal}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Partner Fee</span>
                  <span className="text-white font-bold">
                    {deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Platform Fee</span>
                  <span className="text-white font-bold">₹{platformFee}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Rider Tip</span>
                    <span className="text-white font-bold">₹{tipAmount}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 flex justify-between font-black text-white text-sm">
                  <span>Grand Total</span>
                  <span className="text-[#FF6B00]">₹{finalGrandTotal}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00] border border-[#FF6B00]/30">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-base text-white">Your bag is empty</h4>
                <p className="text-xs text-zinc-400 max-w-xs mt-1">
                  Discover dishes matched to your lifestyle in Thiruvananthapuram.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider cursor-pointer"
              >
                Explore Menu
              </button>
            </div>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121215]">
            <button
              id="proceed-checkout-btn"
              onClick={() => {
                setIsCartOpen(false);
                setActiveView('checkout');
              }}
              className="w-full py-4 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-500/25 transition-transform active:scale-95 flex items-center justify-between px-5 cursor-pointer"
            >
              <div className="text-left">
                <p className="text-[10px] text-black/70 uppercase tracking-widest font-black">Total to Pay (Demo)</p>
                <p className="text-base font-black leading-none">₹{finalGrandTotal}</p>
              </div>
              <div className="flex items-center gap-1.5 font-black text-xs">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
