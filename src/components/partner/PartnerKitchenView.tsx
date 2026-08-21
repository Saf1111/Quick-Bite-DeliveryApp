import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus, Restaurant, MenuItem, MenuItemOptionGroup } from '../../types';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  Bike,
  Plus,
  Search,
  SlidersHorizontal,
  Flame,
  Store,
  Phone,
  ArrowRight,
  TrendingUp,
  DollarSign,
  UtensilsCrossed,
  Eye,
  Check,
  X,
  Volume2,
  RefreshCw,
  Power,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { VegBadge, SpiceLevelBadge } from '../brand/Badges';

export const PartnerKitchenView: React.FC = () => {
  const {
    restaurants,
    orders,
    updateOrderStatus,
    cancelOrder,
    updateRestaurant,
    showToast,
    setActiveView,
    setActiveTrackingOrderId
  } = useApp();

  const { role, switchRole } = useAuth();

  // Partner selection (staff can select which partner restaurant they manage)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(
    restaurants.find(r => r.isPartner)?.id || restaurants[0]?.id || ''
  );

  const [activeTab, setActiveTab] = useState<'kds' | 'menu' | 'analytics' | 'settings'>('kds');
  const [kdsFilter, setKdsFilter] = useState<'all' | 'new' | 'cooking' | 'ready' | 'history'>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');
  
  // Kitchen state toggle (open/busy)
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);

  // New Dish Modal State
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState<number>(220);
  const [newDishOriginalPrice, setNewDishOriginalPrice] = useState<number>(260);
  const [newDishCategory, setNewDishCategory] = useState('Chef Specials');
  const [newDishCuisine, setNewDishCuisine] = useState('Kerala Fusion');
  const [newDishIsVeg, setNewDishIsVeg] = useState(false);
  const [newDishPrepTime, setNewDishPrepTime] = useState<number>(15);
  const [newDishCalories, setNewDishCalories] = useState<number>(450);
  const [newDishProtein, setNewDishProtein] = useState<number>(24);
  const [newDishSpiceLevel, setNewDishSpiceLevel] = useState<1 | 2 | 3 | 4>(2);
  const [newDishImage, setNewDishImage] = useState(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
  );

  const currentRestaurant =
    restaurants.find(r => r.id === selectedRestaurantId) || restaurants[0];

  // Orders for this specific restaurant
  const partnerOrders = orders.filter(
    o => o.restaurantId === currentRestaurant?.id || o.restaurantName === currentRestaurant?.name
  );

  // Fallback to all orders if mock orders didn't match specific restaurant ID
  const displayOrders = partnerOrders.length > 0 ? partnerOrders : orders;

  const newOrders = displayOrders.filter(o => o.status === 'placed');
  const preparingOrders = displayOrders.filter(o => o.status === 'accepted' || o.status === 'preparing');
  const readyOrders = displayOrders.filter(o => o.status === 'ready');
  const dispatchedOrders = displayOrders.filter(
    o => o.status === 'out_for_delivery' || o.status === 'delivered' || o.status === 'cancelled'
  );

  // Calculate live kitchen metrics
  const activeOrdersCount = displayOrders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;
  const completedOrdersCount = displayOrders.filter(o => o.status === 'delivered').length;
  const kitchenRevenue = displayOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  // KDS filter logic
  const filteredKdsOrders = displayOrders.filter(o => {
    if (kdsFilter === 'new') return o.status === 'placed';
    if (kdsFilter === 'cooking') return o.status === 'accepted' || o.status === 'preparing';
    if (kdsFilter === 'ready') return o.status === 'ready';
    if (kdsFilter === 'history') return o.status === 'out_for_delivery' || o.status === 'delivered' || o.status === 'cancelled';
    return true;
  });

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    if (status === 'accepted') {
      showToast(`Order #${orderId} accepted! Sent to preparation queue.`);
    } else if (status === 'preparing') {
      showToast(`Order #${orderId} marked as cooking in kitchen.`);
    } else if (status === 'ready') {
      showToast(`Order #${orderId} packed & marked ready for delivery partner!`);
    } else if (status === 'out_for_delivery') {
      showToast(`Order #${orderId} handed over to delivery rider.`);
    }
  };

  const handleRejectOrder = (orderId: string) => {
    const reason = window.prompt(
      'Enter reason for cancelling/rejecting this order ticket:',
      'Kitchen currently at maximum capacity'
    );
    if (reason !== null && reason.trim()) {
      cancelOrder(orderId, reason.trim());
      showToast(`Order #${orderId} cancelled. Customer notified.`, 'error');
    }
  };

  const handleToggleDishStock = (itemId: string) => {
    if (!currentRestaurant) return;
    const updatedMenu = currentRestaurant.menu.map(m =>
      m.id === itemId ? { ...m, available: !m.available } : m
    );
    const item = currentRestaurant.menu.find(m => m.id === itemId);
    const newStatus = item?.available ? 'Marked as Sold Out (86ed)' : 'Marked as In Stock (Available)';
    updateRestaurant({ ...currentRestaurant, menu: updatedMenu });
    showToast(`${item?.name}: ${newStatus}`);
  };

  const handleCreateDish = () => {
    if (!newDishName.trim()) {
      showToast('Please enter a dish name', 'error');
      return;
    }

    if (!currentRestaurant) return;

    const createdItem: MenuItem = {
      id: `dish-${Date.now()}`,
      restaurantId: currentRestaurant.id,
      restaurantName: currentRestaurant.name,
      name: newDishName.trim(),
      description: newDishDesc.trim() || 'Freshly prepared specialty dish crafted with authentic local spices.',
      price: Number(newDishPrice),
      originalPrice: newDishOriginalPrice ? Number(newDishOriginalPrice) : undefined,
      image: newDishImage,
      isVeg: newDishIsVeg,
      isBestseller: false,
      prepTimeMinutes: Number(newDishPrepTime),
      rating: 4.9,
      ratingCount: 1,
      category: newDishCategory,
      cuisine: newDishCuisine,
      tags: ['fresh', newDishIsVeg ? 'vegetarian' : 'non-vegetarian', 'chef-curated'],
      spiceLevel: newDishSpiceLevel,
      nutrition: {
        calories: Number(newDishCalories),
        proteinGrams: Number(newDishProtein),
        carbsGrams: 38,
        fatGrams: 14,
        sodiumMg: 360
      },
      available: true,
      optionGroups: [
        {
          id: `opt-${Date.now()}-1`,
          title: 'Portion Size',
          required: false,
          minSelect: 0,
          maxSelect: 1,
          options: [
            { id: 'opt-reg', name: 'Regular Portion', priceDelta: 0 },
            { id: 'opt-large', name: 'Large Feast Portion', priceDelta: 60 }
          ]
        }
      ]
    };

    const updatedMenu = [createdItem, ...currentRestaurant.menu];
    updateRestaurant({ ...currentRestaurant, menu: updatedMenu });

    // Reset form
    setNewDishName('');
    setNewDishDesc('');
    setIsAddDishModalOpen(false);
    showToast(`Dish "${createdItem.name}" published to ${currentRestaurant.name} live menu!`);
  };

  const sampleImages = [
    { label: 'Kerala Rice Bowl', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Biryani Feast', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
    { label: 'Grilled Seafood', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80' },
    { label: 'Fresh Salad & Veg', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="bg-[#0A0A0B] min-h-screen text-zinc-100 py-6 selection:bg-[#FF6B00] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Operational Status Banner */}
        <div className="bg-[#121215] rounded-[32px] p-6 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20 shrink-0">
              <ChefHat className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  PARTNER KITCHEN PORTAL
                </span>
                <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  isKitchenOpen
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isKitchenOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  {isKitchenOpen ? 'ACCEPTING LIVE ORDERS' : 'KITCHEN PAUSED (BUSY)'}
                </span>
              </div>

              {/* Kitchen Name & Dropdown Selector */}
              <div className="flex items-center gap-3 mt-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {currentRestaurant?.name || 'Partner Kitchen'}
                </h1>
                <select
                  value={selectedRestaurantId}
                  onChange={e => setSelectedRestaurantId(e.target.value)}
                  className="bg-white/[0.06] border border-white/15 rounded-xl px-2.5 py-1 text-xs font-bold text-zinc-300 focus:outline-none focus:border-[#FF6B00] cursor-pointer"
                >
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#121215] text-white">
                      {r.name} ({r.area})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-zinc-400 mt-0.5">
                {currentRestaurant?.area} Corridor, Thiruvananthapuram • Average Prep Time: {currentRestaurant?.avgPrepTimeMin} mins
              </p>
            </div>
          </div>

          {/* Quick Actions Cluster */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
            <button
              onClick={() => setIsKitchenOpen(!isKitchenOpen)}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
                isKitchenOpen
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isKitchenOpen ? 'Pause Orders' : 'Resume Orders'}</span>
            </button>

            <button
              onClick={() => setIsAddDishModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Dish</span>
            </button>

            <button
              onClick={() => setActiveView('home')}
              className="px-3.5 py-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
              title="Preview Customer Storefront"
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              <span>Storefront</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#121215] p-4 sm:p-5 rounded-[24px] border border-white/10 shadow-xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF6B00] flex items-center justify-center font-black">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Active Tickets</p>
              <p className="text-xl sm:text-2xl font-black text-white">{activeOrdersCount}</p>
            </div>
          </div>

          <div className="bg-[#121215] p-4 sm:p-5 rounded-[24px] border border-white/10 shadow-xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Completed Orders</p>
              <p className="text-xl sm:text-2xl font-black text-white">{completedOrdersCount}</p>
            </div>
          </div>

          <div className="bg-[#121215] p-4 sm:p-5 rounded-[24px] border border-white/10 shadow-xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Kitchen Revenue</p>
              <p className="text-xl sm:text-2xl font-black text-white">₹{kitchenRevenue}</p>
            </div>
          </div>

          <div className="bg-[#121215] p-4 sm:p-5 rounded-[24px] border border-white/10 shadow-xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Live Menu Items</p>
              <p className="text-xl sm:text-2xl font-black text-white">{currentRestaurant?.menu.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Primary View Switcher Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('kds')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'kds'
                ? 'bg-[#FF6B00] text-black shadow-lg shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/10'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen Display (KDS)</span>
            {newOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                {newOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#FF6B00] text-black shadow-lg shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Menu & Stock Control (86'ing)</span>
          </button>
        </div>

        {/* TAB 1: KITCHEN DISPLAY SYSTEM (KDS) */}
        {activeTab === 'kds' && (
          <div className="space-y-6">
            
            {/* KDS Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121215] p-3 rounded-2xl border border-white/10">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => setKdsFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    kdsFilter === 'all' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All Tickets ({displayOrders.length})
                </button>
                <button
                  onClick={() => setKdsFilter('new')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    kdsFilter === 'new' ? 'bg-rose-500 text-white font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>Incoming ({newOrders.length})</span>
                </button>
                <button
                  onClick={() => setKdsFilter('cooking')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    kdsFilter === 'cooking' ? 'bg-[#FF6B00] text-black font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Cooking ({preparingOrders.length})
                </button>
                <button
                  onClick={() => setKdsFilter('ready')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    kdsFilter === 'ready' ? 'bg-emerald-500 text-black font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Ready for Rider ({readyOrders.length})
                </button>
                <button
                  onClick={() => setKdsFilter('history')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    kdsFilter === 'history' ? 'bg-blue-500 text-white font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Dispatched & History ({dispatchedOrders.length})
                </button>
              </div>

              <div className="text-[11px] text-zinc-400 font-bold flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio KDS Cues Active</span>
              </div>
            </div>

            {/* KDS Order Cards Grid */}
            {filteredKdsOrders.length === 0 ? (
              <div className="bg-[#121215] rounded-[32px] p-12 border border-white/10 text-center space-y-3">
                <ChefHat className="w-12 h-12 text-zinc-500 mx-auto" />
                <h3 className="text-lg font-black text-white">No tickets in this section</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Orders placed by customers in Thiruvananthapuram will appear instantly here on the Kitchen Display.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredKdsOrders.map(order => {
                  const isNew = order.status === 'placed';
                  const isCooking = order.status === 'accepted' || order.status === 'preparing';
                  const isReady = order.status === 'ready';
                  const isDispatched = order.status === 'out_for_delivery';
                  const isDelivered = order.status === 'delivered';
                  const isCancelled = order.status === 'cancelled';

                  return (
                    <div
                      key={order.id}
                      className={`bg-[#121215] rounded-[28px] border p-5 shadow-2xl flex flex-col justify-between transition-all duration-300 ${
                        isNew
                          ? 'border-rose-500 ring-2 ring-rose-500/20 animate-pulse'
                          : isCooking
                          ? 'border-[#FF6B00]/60'
                          : isReady
                          ? 'border-emerald-500/60'
                          : 'border-white/10 opacity-80'
                      }`}
                    >
                      {/* Ticket Top Header */}
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-white tracking-tight">#{order.id}</span>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isNew
                                  ? 'bg-rose-500 text-white'
                                  : isCooking
                                  ? 'bg-[#FF6B00] text-black'
                                  : isReady
                                  ? 'bg-emerald-500 text-black'
                                  : isDispatched
                                  ? 'bg-blue-500 text-white'
                                  : isDelivered
                                  ? 'bg-zinc-700 text-zinc-200'
                                  : 'bg-red-950 text-red-300'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              Customer: <strong className="text-white">{order.userName}</strong>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black text-[#FF8500]">₹{order.grandTotal}</span>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold">{order.paymentMethod}</p>
                          </div>
                        </div>

                        {/* Customer Address & Zone */}
                        <div className="py-2.5 text-[11px] text-zinc-400 border-b border-white/5 flex items-center justify-between">
                          <span>Corridor: <strong className="text-zinc-200">{order.deliveryAddress?.area || 'Kazhakkoottam'}</strong></span>
                          <span>Est. Time: <strong className="text-zinc-200">{order.estimatedDeliveryTime}</strong></span>
                        </div>

                        {/* Order Items Checklist */}
                        <div className="py-3 space-y-2.5">
                          <p className="text-[10px] uppercase font-black tracking-wider text-zinc-500">
                            Kitchen Preparation List ({order.items.reduce((sum, i) => sum + i.quantity, 0)} items)
                          </p>
                          
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-2 text-xs"
                              >
                                <div className="space-y-0.5 flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <VegBadge isVeg={item.isVeg} size="sm" />
                                    <span className="font-black text-white">
                                      {item.quantity}x {item.name}
                                    </span>
                                  </div>

                                  {/* Customizations */}
                                  {item.customizations && item.customizations.length > 0 && (
                                    <div className="text-[10px] text-orange-300 pl-4 space-y-0.5">
                                      {item.customizations.map((c, cIdx) => (
                                        <p key={cIdx}>• {c.selectedOption}</p>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <span className="font-bold text-zinc-400 text-xs">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Ticket Workflow Action Buttons */}
                      <div className="pt-4 border-t border-white/10 space-y-2">
                        {isNew && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'accepted')}
                              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Accept Ticket</span>
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                            >
                              <span>Decline</span>
                            </button>
                          </div>
                        )}

                        {order.status === 'accepted' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'preparing')}
                            className="w-full py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/20"
                          >
                            <Flame className="w-4 h-4 fill-black" />
                            <span>Start Cooking / Preparing</span>
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'ready')}
                            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                          >
                            <PackageCheck className="w-4 h-4 stroke-[2.5]" />
                            <span>Food Ready & Packed</span>
                          </button>
                        )}

                        {order.status === 'ready' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                            className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/20"
                          >
                            <Bike className="w-4 h-4" />
                            <span>Handover to Delivery Rider</span>
                          </button>
                        )}

                        {order.status === 'out_for_delivery' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Confirm Delivered</span>
                          </button>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => {
                              setActiveTrackingOrderId(order.id);
                              setActiveView('orders');
                            }}
                            className="text-[10px] text-zinc-400 hover:text-[#FF8500] font-bold uppercase tracking-wider"
                          >
                            View Live Customer Dispatch Tracking →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE MENU & STOCK MANAGEMENT (86'ing items) */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Menu Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#121215] p-4 rounded-2xl border border-white/10">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dishes in menu to toggle stock..."
                  value={menuSearch}
                  onChange={e => setMenuSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddDishModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF8500] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Dish</span>
                </button>
              </div>
            </div>

            {/* Menu Items Table / Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentRestaurant?.menu
                .filter(m => {
                  if (menuSearch.trim()) {
                    const q = menuSearch.toLowerCase();
                    return m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map(item => (
                  <div
                    key={item.id}
                    className={`bg-[#121215] rounded-[24px] p-4 border transition-all flex items-start gap-3.5 shadow-xl ${
                      item.available
                        ? 'border-white/10 hover:border-[#FF6B00]/40'
                        : 'border-rose-500/40 bg-rose-950/10 opacity-75'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover bg-zinc-900 border border-white/10 shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <VegBadge isVeg={item.isVeg} size="sm" />
                          <h4 className="text-xs font-black text-white truncate">{item.name}</h4>
                        </div>
                        <span className="text-xs font-black text-white shrink-0">₹{item.price}</span>
                      </div>

                      <p className="text-[10px] text-zinc-400 line-clamp-1">{item.description}</p>
                      
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 pt-0.5">
                        <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/5 font-bold">
                          {item.prepTimeMinutes}m prep
                        </span>
                        {item.nutrition && (
                          <span className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold">
                            {item.nutrition.proteinGrams}g Protein
                          </span>
                        )}
                      </div>

                      {/* In Stock / Sold Out Toggle Switch */}
                      <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          item.available ? 'text-emerald-400' : 'text-rose-400 font-black'
                        }`}>
                          {item.available ? '● In Stock' : '✕ Sold Out (86ed)'}
                        </span>

                        <button
                          onClick={() => handleToggleDishStock(item.id)}
                          className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            item.available
                              ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.available ? 'Turn Off' : 'Turn On'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* MODAL: ADD NEW DISH TO LIVE MENU */}
        {isAddDishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-[#121215] rounded-[32px] shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#16161B]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#FF6B00] text-black flex items-center justify-center font-black">
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">Publish New Dish</h3>
                    <p className="text-[11px] text-zinc-400">Add to {currentRestaurant?.name} live storefront</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="block font-black text-zinc-300 uppercase tracking-wider mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Malabar Pepper Grilled Paneer / Coastal Sea Bass"
                    value={newDishName}
                    onChange={e => setNewDishName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-white bg-white/[0.04] focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black text-zinc-300 uppercase tracking-wider mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={newDishPrice}
                      onChange={e => setNewDishPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-white bg-white/[0.04] focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-zinc-300 uppercase tracking-wider mb-1">
                      Original / MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={newDishOriginalPrice}
                      onChange={e => setNewDishOriginalPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-white bg-white/[0.04] focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-zinc-300 uppercase tracking-wider mb-1">
                    Description & Ingredients
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Crispy spiced crust, served with authentic coconut chutney and herb dip..."
                    value={newDishDesc}
                    onChange={e => setNewDishDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-white bg-white/[0.04] focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-black text-zinc-300 uppercase tracking-wider mb-1">
                      Diet Type
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewDishIsVeg(!newDishIsVeg)}
                      className={`w-full py-2.5 rounded-xl border font-black uppercase tracking-wider transition-all ${
                        newDishIsVeg
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-rose-500/20 border-rose-500 text-rose-300'
                      }`}
                    >
                      {newDishIsVeg ? 'Vegetarian' : 'Non-Veg'}
                    </button>
                  </div>

                  <div>
                    <label className="block font-black text-zinc-300 uppercase tracking-wider mb-1">
                      Prep Time (Mins)
                    </label>
                    <input
                      type="number"
                      value={newDishPrepTime}
                      onChange={e => setNewDishPrepTime(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-white bg-white/[0.04] focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-zinc-300 uppercase tracking-wider mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={newDishProtein}
                      onChange={e => setNewDishProtein(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-white bg-white/[0.04] focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                {/* Sample Photo Selection */}
                <div>
                  <label className="block font-black text-zinc-300 uppercase tracking-wider mb-1">
                    Select Visual Photo
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {sampleImages.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setNewDishImage(img.url)}
                        className={`rounded-xl overflow-hidden border cursor-pointer relative aspect-video ${
                          newDishImage === img.url ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]' : 'border-white/10 opacity-70'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-white py-0.5 truncate px-1">
                          {img.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-[#16161B] flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDish}
                  className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black uppercase tracking-wider shadow-lg shadow-orange-500/25 cursor-pointer"
                >
                  Publish to Menu
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
