import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Address } from '../../types';
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  Clock,
  AlertTriangle,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartTotal,
    appliedPromo,
    locationZone,
    userProfile,
    createOrderFromCart,
    setActiveView
  } = useApp();

  const { user } = useAuth();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'quickbite_wallet'>('upi');
  const [upiId, setUpiId] = useState('demo.user@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = cartTotal > 300 ? 0 : 25;
  const platformFee = 5;
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const taxes = Math.round(cartTotal * 0.05);
  const grandTotal = Math.max(0, cartTotal - discount + deliveryFee + taxes);

  const savedAddresses: Address[] = userProfile.savedAddresses?.length > 0
    ? userProfile.savedAddresses
    : [
        {
          id: 'addr-1',
          label: 'Home',
          street: 'Flat 4B, Silicon Heights, Near Bhavani Building, Technopark Campus',
          area: 'Kazhakkoottam',
          district: 'Thiruvananthapuram',
          landmark: 'Behind Main Security Gate Phase 1',
          lat: 8.5583,
          lng: 76.8812,
          isDefault: true
        },
        {
          id: 'addr-2',
          label: 'Work',
          street: 'TCS Peepul Park, Technopark Phase 3 Campus',
          area: 'Technopark',
          district: 'Thiruvananthapuram',
          landmark: 'Reception Block A',
          lat: 8.5620,
          lng: 76.8790,
          isDefault: false
        },
        {
          id: 'addr-3',
          label: 'Other',
          street: 'Villa 12, Golf Club Avenue, Kowdiar Main Road',
          area: 'Kowdiar',
          district: 'Thiruvananthapuram',
          landmark: 'Opposite Tennis Club',
          lat: 8.5281,
          lng: 76.9602,
          isDefault: false
        }
      ];

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    const activeAddress = savedAddresses[selectedAddressIndex] || savedAddresses[0];

    try {
      await createOrderFromCart({
        address: activeAddress,
        paymentMethod,
        notes: deliveryNote,
        couponCode: appliedPromo?.code,
        discount
      });

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#0A0A0B] flex flex-col items-center justify-center px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-white">Your Quick Bite bag is empty</h3>
        <p className="text-xs text-zinc-400 max-w-sm">
          Discover hand-crafted culinary dishes in Thiruvananthapuram before completing checkout.
        </p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          Explore Food & Menus
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0B] min-h-screen py-8 text-zinc-100 selection:bg-[#FF6B00] selection:text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-black text-zinc-400 hover:text-[#FF6B00] transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>End-to-End Encrypted Session</span>
          </div>
        </div>

        {/* Demo Mode Notice Banner (Explicitly clear that no payment is required) */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#FF6B00]/15 via-amber-500/10 to-transparent border border-[#FF6B00]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#FF6B00] text-black flex items-center justify-center font-black shrink-0 shadow-md">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">Demo Checkout & Pay Later Flow</h4>
                <span className="px-2 py-0.5 rounded-full bg-[#FF6B00]/20 text-[#FF8500] text-[9px] font-black uppercase tracking-widest border border-[#FF6B00]/30">
                  No Payment Required
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                Payment gateway integration is in test simulation mode for Thiruvananthapuram District. You can complete the entire order workflow, inspect live dispatch updates, and monitor delivery partner progress without real charges.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Address & Payment Selection */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Delivery Address Selection */}
            <div className="bg-[#121215] rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-black flex items-center justify-center font-black text-xs shadow-md">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Delivery Address</h3>
                    <p className="text-[11px] text-zinc-400">Select delivery point in {locationZone.name}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#FF8500] bg-[#FF6B00]/15 px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-[#FF6B00]/30">
                  {locationZone.name} Zone
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr, idx) => {
                  const isSelected = selectedAddressIndex === idx;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF6B00] bg-[#FF6B00]/10 shadow-lg shadow-orange-500/10'
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                          <span>{addr.label}</span>
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 leading-snug font-medium">{addr.street}</p>
                      <p className="text-[10px] text-zinc-500 mt-1.5">Landmark: {addr.landmark}</p>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Note */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-[11px] font-black text-zinc-300 uppercase tracking-wider">
                  Rider Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call upon reaching security gate, do not ring bell, leave at reception"
                  value={deliveryNote}
                  onChange={e => setDeliveryNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-[#121215] rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-black flex items-center justify-center font-black text-xs shadow-md">
                  2
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Payment Method (Simulation)</h3>
                  <p className="text-[11px] text-zinc-400">Choose preferred simulation mode</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'upi', label: 'UPI / GPay', icon: <Smartphone className="w-4 h-4" /> },
                  { id: 'card', label: 'Cards', icon: <CreditCard className="w-4 h-4" /> },
                  { id: 'quickbite_wallet', label: 'QB Wallet', icon: <Sparkles className="w-4 h-4" /> },
                  { id: 'cod', label: 'Pay on Delivery', icon: <Banknote className="w-4 h-4" /> }
                ].map(method => {
                  const isChosen = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3.5 rounded-2xl border text-xs font-black uppercase tracking-wider flex flex-col items-center gap-2 transition-all ${
                        isChosen
                          ? 'border-[#FF6B00] bg-[#FF6B00]/15 text-white shadow-lg shadow-orange-500/15'
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className={`p-2 rounded-xl ${isChosen ? 'bg-[#FF6B00] text-black' : 'bg-white/10 text-zinc-300'}`}>
                        {method.icon}
                      </span>
                      <span className="text-[11px]">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI Sub-fields */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <label className="block text-[11px] font-black text-zinc-300 uppercase tracking-wider">
                    Simulated UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Instant demo confirmation. No real banking authorization required.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-[#121215] rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
                </h3>
                <span className="text-[10px] font-black uppercase text-[#FF8500] bg-[#FF6B00]/15 px-2 py-0.5 rounded-full border border-[#FF6B00]/30">
                  {cart[0]?.menuItem.restaurantName || 'Quick Bite Partner'}
                </span>
              </div>

              {/* Items Mini List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((c) => (
                  <div key={c.cartItemId} className="flex justify-between items-start text-xs">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold text-white truncate">
                        {c.quantity}x {c.menuItem.name}
                      </p>
                      {c.customizations && c.customizations.length > 0 && (
                        <p className="text-[10px] text-zinc-500">
                          {c.customizations.map(x => x.selectedOption).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-black text-white">₹{c.itemTotal}</span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="border-t border-white/10 pt-3 space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="text-white font-bold">₹{cartTotal}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon ({appliedPromo.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="text-white font-bold">
                    {deliveryFee === 0 ? <span className="text-emerald-400 font-black">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Kitchen Packaging</span>
                  <span className="text-white font-bold">₹{taxes}</span>
                </div>
                <div className="border-t border-white/10 pt-2.5 flex justify-between text-base font-black text-white">
                  <span>Total Amount</span>
                  <span className="text-[#FF6B00]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Main Submit CTA */}
              <button
                id="place-order-demo-btn"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full py-4 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] disabled:opacity-50 text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Transmitting Order to Kitchen...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                    <span>Place Demo Order (₹{grandTotal})</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-zinc-500 text-center leading-tight">
                🔒 Free Demo Mode • Instant kitchen dispatch notification in Thiruvananthapuram
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
