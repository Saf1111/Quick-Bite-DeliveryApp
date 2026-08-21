import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, Order } from '../../types';
import {
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  HelpCircle,
  ChefHat,
  Bike,
  PackageCheck,
  MapPin,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Store,
  ChevronRight,
  Receipt,
  RotateCcw,
  Eye,
  X,
  Compass,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Utensils
} from 'lucide-react';
import { VegBadge } from '../brand/Badges';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    activeTrackingOrderId,
    setActiveTrackingOrderId,
    updateOrderStatus,
    setActiveView,
    addToCart,
    setIsCartOpen,
    showToast
  } = useApp();

  // Local view mode: 'list' (My Orders dashboard) vs 'live_tracking' (Single active order GPS dispatch view)
  const [viewMode, setViewMode] = useState<'list' | 'live_tracking'>('list');
  // Selected order for detailed modal
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);

  // Active in-flight orders and past history orders
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  // Currently focused order for live tracking view
  const currentTrackingOrder = orders.find(o => o.id === activeTrackingOrderId) || activeOrders[0] || orders[0];

  const steps = [
    { key: 'placed' as OrderStatus, label: 'Order Placed', desc: 'Received & verified by Quick Bite', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'accepted' as OrderStatus, label: 'Kitchen Accepted', desc: 'Partner kitchen confirmed ticket', icon: <Store className="w-4 h-4" /> },
    { key: 'preparing' as OrderStatus, label: 'Preparing Food', desc: 'Fresh ingredients simmering', icon: <ChefHat className="w-4 h-4" /> },
    { key: 'ready' as OrderStatus, label: 'Ready & Packed', desc: 'Sealed with tamper insulation', icon: <PackageCheck className="w-4 h-4" /> },
    { key: 'out_for_delivery' as OrderStatus, label: 'Out for Delivery', desc: 'Rider on the TVM corridor', icon: <Bike className="w-4 h-4" /> },
    { key: 'delivered' as OrderStatus, label: 'Delivered', desc: 'Handed over at doorstep', icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 0;
      case 'accepted': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      case 'cancelled': return -1;
      default: return 2;
    }
  };

  const handleTrackOrder = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setViewMode('live_tracking');
  };

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return;
    
    // Add all items from this order to cart
    order.items.forEach(item => {
      // Create a MenuItem shape
      const menuItem = {
        id: item.itemId,
        name: item.name,
        description: 'Reordered favorite item',
        price: item.price,
        image: item.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        category: 'Main Course',
        isVeg: item.isVeg,
        rating: 4.8,
        ratingCount: 120,
        prepTime: '20 mins',
        calories: 450
      };
      addToCart(menuItem, item.quantity, item.customizations);
    });

    showToast(`Added ${order.items.length} items from ${order.restaurantName} to your bag!`);
    setIsCartOpen(true);
  };

  const handleCallDriver = (order: Order) => {
    showToast(`Calling ${order.deliveryPartner?.name || 'Rider Vishnu K.'} (${order.deliveryPartner?.phone || '+91 98471 88990'})...`);
  };

  const handleSupport = () => {
    showToast('Quick Bite 24/7 TVM Customer Hotline: +91 471 2987654');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            Order Placed
          </span>
        );
      case 'accepted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            Kitchen Accepted
          </span>
        );
      case 'preparing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Preparing
          </span>
        );
      case 'ready':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            Packed & Ready
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100/70 text-emerald-800 border border-emerald-300/80 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // 1. EMPTY STATE
  if (orders.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5 shadow-sm">
          <Receipt className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">No orders yet</h2>
        <p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed">
          Discover hand-crafted culinary dishes from top kitchens across Thiruvananthapuram and place your first Quick Bite order.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setActiveView('home')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-transform active:scale-95 cursor-pointer"
          >
            Explore Food
          </button>
          <button
            onClick={() => setActiveView('map')}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Explore TVM Map
          </button>
        </div>
      </div>
    );
  }

  // 2. LIVE TRACKING DETAIL VIEW (when customer clicks [ Track Order ])
  if (viewMode === 'live_tracking' && currentTrackingOrder) {
    const currentIdx = getStepIndex(currentTrackingOrder.status);

    return (
      <div className="bg-slate-50 min-h-screen py-8 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Navigation & Breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors uppercase tracking-wider cursor-pointer bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Orders</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSupport}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200/80 px-3.5 py-2 rounded-2xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Help & Support</span>
              </button>
            </div>
          </div>

          {/* Multiple Active Orders Switcher Tab (if more than 1 order) */}
          {activeOrders.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider shrink-0 px-2">
                Active Orders:
              </span>
              {activeOrders.map(ord => (
                <button
                  key={ord.id}
                  onClick={() => setActiveTrackingOrderId(ord.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    ord.id === currentTrackingOrder.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  #{ord.id} • {ord.restaurantName} (₹{ord.grandTotal})
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column: Live Status & Simulation Map */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Live Progress Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-black text-emerald-600 tracking-wider">
                        ORDER #{currentTrackingOrder.id}
                      </span>
                      {currentTrackingOrder.status !== 'delivered' && currentTrackingOrder.status !== 'cancelled' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      {currentTrackingOrder.status === 'delivered'
                        ? 'Order Delivered!'
                        : currentTrackingOrder.status === 'cancelled'
                        ? 'Order Cancelled'
                        : currentTrackingOrder.status === 'out_for_delivery'
                        ? 'Rider is on the way!'
                        : currentTrackingOrder.status === 'ready'
                        ? 'Food is packed & ready!'
                        : currentTrackingOrder.status === 'preparing'
                        ? 'Chef is cooking your meal'
                        : currentTrackingOrder.status === 'accepted'
                        ? 'Kitchen accepted your order'
                        : 'Order received by Quick Bite'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      From <strong className="text-slate-800">{currentTrackingOrder.restaurantName}</strong> to{' '}
                      <strong className="text-slate-800">{currentTrackingOrder.deliveryAddress?.area || 'Technopark Kazhakkoottam'}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200/80 shrink-0">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Estimated ETA</p>
                      <p className="text-base font-black text-emerald-950">
                        {currentTrackingOrder.status === 'delivered' ? 'Delivered' : currentTrackingOrder.estimatedDeliveryTime || '16 mins'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                {currentTrackingOrder.status === 'cancelled' ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>This order was cancelled. Refund processed to original payment method.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 relative">
                      {steps.map((step, idx) => {
                        const isDone = idx < currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div
                            key={step.key}
                            className={`p-3 rounded-2xl border flex flex-col items-center text-center space-y-2 transition-all ${
                              isCurrent
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                                : isDone
                                ? 'bg-slate-50 border-slate-200 text-slate-700'
                                : 'bg-slate-50/50 border-slate-100 text-slate-400'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                                  : isDone
                                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                                  : 'bg-slate-200 text-slate-400'
                              }`}
                            >
                              {step.icon}
                            </div>
                            <div>
                              <p className={`text-[10px] font-black uppercase tracking-wider leading-tight ${
                                isCurrent ? 'text-emerald-900' : isDone ? 'text-slate-800' : 'text-slate-400'
                              }`}>
                                {step.label}
                              </p>
                              <p className="text-[9px] text-slate-500 mt-0.5 hidden sm:block">
                                {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Simulation Demo Trigger (Fast-forward stages for testing) */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] font-bold text-slate-500">
                        ⚡ Fast-Forward Order Lifecycle Demo:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {steps.map((s) => (
                          <button
                            key={s.key}
                            onClick={() => updateOrderStatus(currentTrackingOrder.id, s.key)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              currentTrackingOrder.status === s.key
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {s.label.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Interactive Vector Dispatch Map Visual */}
              <div className="relative aspect-16/9 rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm bg-gradient-to-b from-slate-900 to-slate-950 p-5 flex flex-col justify-between text-white">
                
                {/* Map Canvas Background Grid */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

                {/* Map Road Vector Graphic */}
                <svg className="absolute inset-0 w-full h-full stroke-emerald-500/40 fill-none stroke-[3] stroke-dasharray-[6,6]" viewBox="0 0 500 280">
                  <path d="M 60 220 Q 220 100, 300 150 T 440 60" />
                </svg>

                {/* Top Map Badges */}
                <div className="relative z-10 flex justify-between items-start">
                  <span className="px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TVM Corridor: {currentTrackingOrder.restaurantName} → {currentTrackingOrder.deliveryAddress?.area || 'Kazhakkoottam'}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/40">
                    GPS Active • Live Dispatch
                  </span>
                </div>

                {/* Rider Pin Indicator */}
                <div className="relative z-10 self-center bg-emerald-500 text-slate-950 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce font-black text-xs">
                  <Bike className="w-4 h-4 stroke-[2.5]" />
                  <span>{currentTrackingOrder.deliveryPartner?.name || 'Vishnu K.'} is 1.2 km away</span>
                </div>

                {/* Destination Point */}
                <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate text-white font-medium">
                      {currentTrackingOrder.deliveryAddress?.street || 'Technopark Main Road, Trivandrum'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">8.558° N, 76.881° E</span>
                </div>

              </div>

            </div>

            {/* Right Column: Driver Info & Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Delivery Partner Profile Card */}
              {currentTrackingOrder.deliveryPartner && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Assigned Quick Bite Delivery Partner
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentTrackingOrder.deliveryPartner.photo}
                        alt={currentTrackingOrder.deliveryPartner.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/40"
                      />
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{currentTrackingOrder.deliveryPartner.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          ⭐ {currentTrackingOrder.deliveryPartner.rating} • {currentTrackingOrder.deliveryPartner.vehicleNumber}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">{currentTrackingOrder.deliveryPartner.vehicleType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCallDriver(currentTrackingOrder)}
                        className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        title="Call Rider"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showToast('Opening instant messaging chat with rider...')}
                        className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                        title="Message Rider"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 text-[11px] text-slate-600 flex items-center gap-2 border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Insulated thermal bag & verified Thiruvananthapuram District rider license.</span>
                  </div>
                </div>
              )}

              {/* Order Items & Receipt Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Order Details ({currentTrackingOrder.items.reduce((s, i) => s + i.quantity, 0)} Items)
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(currentTrackingOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {currentTrackingOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs">
                      <div className="flex items-start gap-2 flex-1 min-w-0 pr-2">
                        <VegBadge isVeg={it.isVeg} size="sm" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {it.name} <span className="text-slate-400 font-medium">× {it.quantity}</span>
                          </p>
                          {it.customizations && it.customizations.length > 0 && (
                            <p className="text-[10px] text-slate-500">
                              {it.customizations.map(c => c.selectedOption).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-black text-slate-900">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Payment Mode</span>
                    <span className="font-bold text-slate-900 uppercase">{currentTrackingOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {currentTrackingOrder.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  {currentTrackingOrder.couponCode && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Coupon ({currentTrackingOrder.couponCode})</span>
                      <span>-₹{currentTrackingOrder.discount}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-black text-slate-900 text-base">
                    <span>Total Paid</span>
                    <span className="text-emerald-700">₹{currentTrackingOrder.grandTotal}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // 3. PRIMARY "MY ORDERS" LIST VIEW (Organized into ACTIVE ORDERS and ORDER HISTORY)
  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <button
                onClick={() => setActiveView('home')}
                className="hover:text-emerald-600 transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-slate-800">My Orders</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Receipt className="w-7 h-7 text-emerald-600" />
              <span>My Orders</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track your live deliveries in real-time and review past orders from TVM kitchens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('home')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Utensils className="w-4 h-4" />
              <span>Explore Food</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            SECTION 1: ACTIVE ORDERS
            ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Active Orders
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                {activeOrders.length}
              </span>
            </div>
            {activeOrders.length > 0 && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Dispatch In Progress
              </span>
            )}
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 text-center space-y-2">
              <p className="text-xs font-bold text-slate-500">No active orders right now.</p>
              <p className="text-[11px] text-slate-400">Your in-progress orders will appear here with live GPS tracking.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border-2 border-emerald-500/40 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  {/* Card Header: Order # & Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                          ORDER #{order.id}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                      <h3 className="text-base font-black text-slate-900 mt-0.5">
                        {order.restaurantName}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {order.restaurantAddress}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items List Summary */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-700">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <VegBadge isVeg={it.isVeg} size="sm" />
                          <span className="font-bold text-slate-900 truncate">{it.name}</span>
                          <span className="text-slate-400 font-medium shrink-0">× {it.quantity}</span>
                        </div>
                        <span className="font-black text-slate-900 shrink-0">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Estimated Time */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Total Amount</p>
                      <p className="text-base font-black text-emerald-700">₹{order.grandTotal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Estimated Arrival</p>
                      <p className="text-xs font-black text-slate-800 flex items-center justify-end gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{order.estimatedDeliveryTime || '16 mins'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions: Track Order & View Details */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Track Order</span>
                    </button>
                    <button
                      onClick={() => setSelectedOrderDetail(order)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Details</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION 2: ORDER HISTORY
            ======================================================== */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Order History
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black">
                {pastOrders.length}
              </span>
            </div>
            <span className="text-xs text-slate-400">Past completed deliveries</span>
          </div>

          {pastOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 text-center text-xs text-slate-400">
              No past orders recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {pastOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Info & Items summary */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                        ORDER #{order.id}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        {order.restaurantName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {order.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Right: Price & Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Grand Total</p>
                      <p className="text-base font-black text-slate-900">₹{order.grandTotal}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrderDetail(order)}
                        className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ========================================================
          MODAL: ORDER DETAILS BREAKDOWN
          ======================================================== */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-6 text-slate-900">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                    ORDER #{selectedOrderDetail.id}
                  </span>
                  {getStatusBadge(selectedOrderDetail.status)}
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {selectedOrderDetail.restaurantName}
                </h3>
                <p className="text-xs text-slate-400">
                  {new Date(selectedOrderDetail.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ordered Food Items Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Ordered Items ({selectedOrderDetail.items.reduce((s, i) => s + i.quantity, 0)})
              </h4>
              <div className="divide-y divide-slate-100">
                {selectedOrderDetail.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-start text-xs">
                    <div className="flex items-start gap-2.5 flex-1 pr-3">
                      <VegBadge isVeg={it.isVeg} size="sm" />
                      <div>
                        <p className="font-bold text-slate-900">
                          {it.name} <span className="text-slate-400 font-medium">× {it.quantity}</span>
                        </p>
                        {it.customizations && it.customizations.length > 0 && (
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {it.customizations.map(c => `${c.groupName}: ${c.selectedOption}`).join(' • ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-black text-slate-900 shrink-0">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivery Address</span>
              </p>
              <p className="text-xs font-bold text-slate-800">
                {selectedOrderDetail.deliveryAddress?.label || 'Home'} • {selectedOrderDetail.deliveryAddress?.street}
              </p>
              <p className="text-[11px] text-slate-500">
                {selectedOrderDetail.deliveryAddress?.area}, {selectedOrderDetail.deliveryAddress?.district}
              </p>
            </div>

            {/* Price & Bill Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-bold text-slate-800">₹{selectedOrderDetail.itemTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-bold text-slate-800">
                  {selectedOrderDetail.deliveryFee === 0 ? 'FREE' : `₹${selectedOrderDetail.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Restaurant Packaging</span>
                <span className="font-bold text-slate-800">₹{selectedOrderDetail.taxesAndCharges}</span>
              </div>
              {selectedOrderDetail.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount {selectedOrderDetail.couponCode ? `(${selectedOrderDetail.couponCode})` : ''}</span>
                  <span>-₹{selectedOrderDetail.discount}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900 text-base">
                <span>Grand Total</span>
                <span className="text-emerald-700">₹{selectedOrderDetail.grandTotal}</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Payment: <strong className="uppercase text-slate-700">{selectedOrderDetail.paymentMethod}</strong> ({selectedOrderDetail.paymentStatus})
              </p>
            </div>

            {/* Lifecycle Timeline */}
            {selectedOrderDetail.timeline && selectedOrderDetail.timeline.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Order Timeline</h4>
                <div className="space-y-2">
                  {selectedOrderDetail.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        step.completed ? 'bg-emerald-500' : 'bg-slate-300'
                      }`} />
                      <div className="flex-1">
                        <p className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </p>
                        <p className="text-[11px] text-slate-500">{step.description}</p>
                      </div>
                      {step.timestamp && (
                        <span className="text-[10px] text-slate-400 shrink-0">{step.timestamp}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedOrderDetail.status !== 'delivered' && selectedOrderDetail.status !== 'cancelled' ? (
                <button
                  onClick={() => {
                    const id = selectedOrderDetail.id;
                    setSelectedOrderDetail(null);
                    handleTrackOrder(id);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Track Live Order</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const ord = selectedOrderDetail;
                    setSelectedOrderDetail(null);
                    handleReorder(ord);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reorder Items</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
