import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus, Restaurant, MenuItem } from '../../types';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Bike,
  Store,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  AlertCircle,
  XCircle,
  ChefHat,
  PackageCheck,
  Search,
  Sliders,
  Check,
  X,
  Phone,
  Power,
  Navigation
} from 'lucide-react';
import { VegBadge } from '../brand/Badges';

export const AdminDashboardView: React.FC = () => {
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

  const [activeTab, setActiveTab] = useState<'orders' | 'kitchen' | 'dishes' | 'fleet' | 'zones'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('active');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(restaurants[0]?.id || '');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  
  // New dish form state
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState(240);
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishProtein, setNewDishProtein] = useState(26);
  const [newDishCalories, setNewDishCalories] = useState(420);
  const [newDishIsVeg, setNewDishIsVeg] = useState(false);

  const selectedRestaurant = restaurants.find(r => r.id === selectedPartnerId) || restaurants[0];

  // Calculate live analytics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0) + 28500;
  const totalOrdersCount = orders.length + 480;
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'active') {
      if (o.status === 'delivered' || o.status === 'cancelled') return false;
    } else if (orderFilter === 'completed') {
      if (o.status !== 'delivered') return false;
    } else if (orderFilter === 'cancelled') {
      if (o.status !== 'cancelled') return false;
    }

    if (searchOrderQuery.trim()) {
      const q = searchOrderQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.restaurantName.toLowerCase().includes(q) ||
        o.userName.toLowerCase().includes(q) ||
        o.deliveryAddress?.area?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  const handleRejectOrder = (orderId: string) => {
    const reason = window.prompt('Provide rejection/cancellation reason:', 'Kitchen at capacity in TVM corridor');
    if (reason !== null) {
      cancelOrder(orderId, reason);
    }
  };

  const handleToggleItemAvailability = (restaurantId: string, itemId: string) => {
    const rest = restaurants.find(r => r.id === restaurantId);
    if (!rest) return;

    const updatedMenu = rest.menu.map(m => (m.id === itemId ? { ...m, available: !m.available } : m));
    updateRestaurant({ ...rest, menu: updatedMenu });
    showToast('Menu item availability updated');
  };

  const handleCreateDish = () => {
    if (!newDishName.trim()) {
      showToast('Please provide a dish name', 'error');
      return;
    }

    const createdItem: MenuItem = {
      id: `dish-custom-${Date.now()}`,
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      name: newDishName,
      description: newDishDesc || 'Freshly prepared specialty dish with premium local ingredients.',
      price: Number(newDishPrice),
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      isVeg: newDishIsVeg,
      prepTimeMinutes: 14,
      rating: 4.9,
      ratingCount: 1,
      category: 'Chef Specials',
      cuisine: selectedRestaurant.cuisines[0] || 'Kerala Fusion',
      tags: ['special', 'chef-pick', newDishIsVeg ? 'veg' : 'non-veg'],
      spiceLevel: 2,
      nutrition: {
        calories: Number(newDishCalories),
        proteinGrams: Number(newDishProtein),
        carbsGrams: 40,
        fatGrams: 12,
        sodiumMg: 350
      },
      available: true
    };

    const updatedMenu = [createdItem, ...selectedRestaurant.menu];
    updateRestaurant({ ...selectedRestaurant, menu: updatedMenu });

    setNewDishName('');
    setNewDishDesc('');
    showToast(`Dish "${createdItem.name}" published to ${selectedRestaurant.name}!`);
  };

  const mockRiders = [
    {
      id: 'dp-tvm-01',
      name: 'Rajesh K.',
      phone: '+91 98471 22334',
      vehicle: 'Hero Electric EV (KL 01 EF 8820)',
      zone: 'Technopark & Kazhakkoottam',
      status: 'online',
      activeOrderId: orders.find(o => o.status === 'out_for_delivery')?.id || 'QB-2026-9042',
      rating: 4.9,
      todayTrips: 7,
      todayEarnings: 540
    },
    {
      id: 'dp-tvm-02',
      name: 'Arjun Mohan',
      phone: '+91 94472 88190',
      vehicle: 'Ather 450X (KL 01 EC 9901)',
      zone: 'Kowdiar & Sasthamangalam',
      status: 'online',
      activeOrderId: null,
      rating: 4.85,
      todayTrips: 9,
      todayEarnings: 680
    },
    {
      id: 'dp-tvm-03',
      name: 'Kiran Suresh',
      phone: '+91 98460 77112',
      vehicle: 'TVS iQube (KL 01 ED 1240)',
      zone: 'Palayam & Statue (City Core)',
      status: 'busy',
      activeOrderId: 'QB-2026-8812',
      rating: 4.95,
      todayTrips: 11,
      todayEarnings: 820
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 py-8 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20 font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">Admin Operations & Fleet Dispatch</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider border border-purple-200">
                  CENTRAL HUB
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Real-time kitchen order state machine, rider fleet dispatch & TVM corridor volume
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                switchRole('customer');
                setActiveView('home');
              }}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Switch to Customer View →
            </button>
          </div>
        </div>

        {/* Analytics Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span className="uppercase tracking-wider text-[10px] font-black">Today's Gross Sales</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-600 font-bold">+22.4% vs last week (TVM)</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span className="uppercase tracking-wider text-[10px] font-black">Active Dispatches</span>
              <Bike className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{activeOrders.length} In Progress</p>
            <p className="text-[11px] text-slate-500">Avg corridor transit: 18.5 mins</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span className="uppercase tracking-wider text-[10px] font-black">Orders Fulfilled</span>
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalOrdersCount}</p>
            <p className="text-[11px] text-purple-600 font-bold">99.6% SLA On-Time Rate</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span className="uppercase tracking-wider text-[10px] font-black">Partner Kitchens</span>
              <Store className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{restaurants.filter(r => r.isPartner).length} Active</p>
            <p className="text-[11px] text-amber-600 font-bold">14 District Hubs Connected</p>
          </div>

        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
          {[
            { id: 'orders', label: 'Live Orders Dispatch' },
            { id: 'fleet', label: 'Riders & Fleet Control' },
            { id: 'kitchen', label: 'Partner Catalog' },
            { id: 'dishes', label: 'Dish Studio & Stock' },
            { id: 'zones', label: 'TVM Corridor Volume' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Live Orders Dispatch */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter Bar & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
                {(['all', 'active', 'completed', 'cancelled'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      orderFilter === f
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {f} ({orders.filter(o => f === 'all' ? true : f === 'active' ? (o.status !== 'delivered' && o.status !== 'cancelled') : o.status === f).length})
                  </button>
                ))}
              </div>

              <div className="relative max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by Order ID, area or name..."
                  value={searchOrderQuery}
                  onChange={e => setSearchOrderQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Orders Cards List */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                <p className="text-sm font-bold text-slate-600">No orders matching this filter</p>
                <p className="text-xs text-slate-400">Place an order in customer mode or adjust search parameters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    {/* Order Details */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-black text-slate-900">#{ord.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ord.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ord.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500">
                          From <strong className="text-slate-900">{ord.restaurantName}</strong>
                        </span>
                      </div>

                      {/* Items list */}
                      <div className="space-y-1">
                        {ord.items.map((i, idx) => (
                          <p key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                            <span className="font-bold text-slate-900">{i.quantity}x</span>
                            <span>{i.name}</span>
                            {i.customizations && i.customizations.length > 0 && (
                              <span className="text-[10px] text-slate-400">
                                ({i.customizations.map(c => c.selectedOption).join(', ')})
                              </span>
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Customer & Location */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{ord.deliveryAddress?.street || 'Technopark'}, {ord.deliveryAddress?.area || 'Kazhakkoottam'}</span>
                        </span>
                        <span>•</span>
                        <span>Customer: <strong className="text-slate-800">{ord.userName}</strong> ({ord.userPhone})</span>
                      </div>
                    </div>

                    {/* Right Action Block */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <p className="text-lg font-black text-slate-900">₹{ord.grandTotal}</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">{ord.paymentMethod} (Paid)</p>
                        <button
                          onClick={() => {
                            setActiveTrackingOrderId(ord.id);
                            setActiveView('orders');
                          }}
                          className="text-[10px] text-emerald-700 hover:underline font-bold mt-1 inline-block"
                        >
                          View in Customer Tracker →
                        </button>
                      </div>

                      {/* Status State Machine Controls */}
                      {ord.status !== 'cancelled' && (
                        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                          {ord.status === 'placed' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'accepted')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all cursor-pointer"
                            >
                              ✓ Accept Order
                            </button>
                          )}
                          {(ord.status === 'placed' || ord.status === 'accepted') && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'preparing')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer"
                            >
                              Chef Cooking
                            </button>
                          )}
                          {(ord.status === 'preparing' || ord.status === 'accepted') && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'ready')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer"
                            >
                              Pack Ready
                            </button>
                          )}
                          {(ord.status === 'ready' || ord.status === 'preparing') && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'out_for_delivery')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer"
                            >
                              Dispatch Rider
                            </button>
                          )}
                          {ord.status === 'out_for_delivery' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all cursor-pointer"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {ord.status !== 'delivered' && (
                            <button
                              onClick={() => handleRejectOrder(ord.id)}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                              title="Reject / Cancel Order"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Fleet & Riders Control (New 5th Tab) */}
        {activeTab === 'fleet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Active Delivery Fleet in Thiruvananthapuram</h3>
                <p className="text-xs text-slate-500">Live pilot GPS status, daily trips, rating & zone assignments</p>
              </div>
              <button
                onClick={() => {
                  switchRole('delivery');
                  setActiveView('delivery');
                }}
                className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Open Rider Pilot View →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockRiders.map(rider => (
                <div key={rider.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center justify-center">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{rider.name}</h4>
                        <p className="text-xs text-slate-500">{rider.phone}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700">
                      {rider.rating} ★
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-600">
                    <p className="font-semibold text-slate-800">{rider.vehicle}</p>
                    <p>Corridor: {rider.zone}</p>
                    <p className="text-[11px] text-slate-500">
                      Trips Today: {rider.todayTrips} • Earnings: ₹{rider.todayEarnings}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className={`w-2 h-2 rounded-full ${rider.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="capitalize font-bold">{rider.status}</span>
                    </span>
                    <button
                      onClick={() => showToast(`Dialing ${rider.name} (${rider.phone})...`)}
                      className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Partner Management */}
        {activeTab === 'kitchen' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Registered Culinary Partners in Thiruvananthapuram</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(r => (
                <div key={r.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.coverImage}
                      alt={r.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{r.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{r.area} • {r.openingHours}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{r.cuisines.join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-600">
                    <span>{r.menu.length} Dishes Published</span>
                    <span className={r.isPartner ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {r.isPartner ? '⭐ Quick Bite Partner' : '📍 Discovered Place'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Dish & Menu Studio with stock toggling */}
        {activeTab === 'dishes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Create Dish Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Publish New Dish to Partner Menu</span>
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select Partner Kitchen</label>
                <select
                  value={selectedPartnerId}
                  onChange={e => setSelectedPartnerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.area})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. Malabar Pepper Grilled Salmon"
                  value={newDishName}
                  onChange={e => setNewDishName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    value={newDishPrice}
                    onChange={e => setNewDishPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Protein (grams)</label>
                  <input
                    type="number"
                    value={newDishProtein}
                    onChange={e => setNewDishProtein(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishIsVeg}
                    onChange={e => setNewDishIsVeg(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>Pure Vegetarian</span>
                </label>
              </div>

              <button
                onClick={handleCreateDish}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Publish Item Live</span>
              </button>
            </div>

            {/* Right: Existing Menu for Selected Kitchen with stock status toggle */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Menu Items for {selectedRestaurant.name} ({selectedRestaurant.menu.length})
                </h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Click Toggle to update Stock</span>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {selectedRestaurant.menu.map(m => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <VegBadge isVeg={m.isVeg} size="sm" />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{m.name}</p>
                        <p className="text-[11px] text-slate-500">{m.nutrition?.proteinGrams || 20}g Protein • {m.prepTimeMinutes}m prep</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-slate-900">₹{m.price}</span>
                      <button
                        onClick={() => handleToggleItemAvailability(selectedRestaurant.id, m.id)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          m.available !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200'
                        }`}
                      >
                        {m.available !== false ? 'In Stock' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 5: Zone Performance */}
        {activeTab === 'zones' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Thiruvananthapuram District Corridor Delivery Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {[
                { zone: 'Kazhakkoottam & Technopark', share: '42%', orders: 198, time: '18m avg' },
                { zone: 'Kowdiar & Sasthamangalam', share: '26%', orders: 114, time: '16m avg' },
                { zone: 'Palayam & Statue (City Core)', share: '18%', orders: 84, time: '14m avg' },
                { zone: 'Varkala & Coastal Towns', share: '14%', orders: 62, time: '28m avg' }
              ].map(z => (
                <div key={z.zone} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-500">{z.zone}</p>
                  <p className="text-2xl font-black text-slate-900">{z.share}</p>
                  <p className="text-[11px] text-emerald-600 font-bold">{z.orders} orders • {z.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
