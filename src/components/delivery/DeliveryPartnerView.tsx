import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  deliveryService,
  DeliveryTripItem,
  RiderProfile
} from '../../services/deliveryService';
import {
  Bike,
  Navigation,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Package,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Power,
  RotateCw,
  ExternalLink,
  Store,
  HelpCircle,
  X,
  Compass,
  Check
} from 'lucide-react';

export const DeliveryPartnerView: React.FC = () => {
  const { showToast, setActiveView, setActiveTrackingOrderId } = useApp();
  const { role, switchRole } = useAuth();

  const [profile, setProfile] = useState<RiderProfile>(() => deliveryService.getProfile());
  const [activeTrip, setActiveTrip] = useState<DeliveryTripItem | null>(() =>
    deliveryService.getActiveTrip()
  );
  const [availableTrips, setAvailableTrips] = useState<DeliveryTripItem[]>(() =>
    deliveryService.getAvailableTrips()
  );
  const [tripHistory, setTripHistory] = useState<DeliveryTripItem[]>(() =>
    deliveryService.getTripHistory()
  );

  const [activeTab, setActiveTab] = useState<'radar' | 'active' | 'earnings' | 'history'>('active');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);
  const [verifiedItems, setVerifiedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = deliveryService.subscribe(() => {
      setProfile(deliveryService.getProfile());
      setActiveTrip(deliveryService.getActiveTrip());
      setAvailableTrips(deliveryService.getAvailableTrips());
      setTripHistory(deliveryService.getTripHistory());
    });

    return unsubscribe;
  }, []);

  const handleToggleOnline = () => {
    const status = deliveryService.toggleOnlineStatus();
    showToast(status ? 'You are now ONLINE. Dispatch radar active!' : 'You are now OFFLINE. Deliveries paused.', 'info');
  };

  const handleAcceptTrip = (orderId: string) => {
    const success = deliveryService.acceptTrip(orderId);
    if (success) {
      showToast(`Trip for #${orderId} accepted! Proceed to restaurant.`);
      setActiveTab('active');
    }
  };

  const handleArrivedAtPickup = () => {
    deliveryService.markArrivedAtPickup();
    showToast('Marked arrived at restaurant. Verify items before pickup.');
  };

  const handleConfirmPickup = () => {
    deliveryService.markPickedUp();
    showToast('Pickup confirmed! Starting navigation to customer.');
  };

  const handleConfirmDelivery = () => {
    deliveryService.markDelivered();
    showToast(`Order delivered! Payout added to your wallet.`);
    setActiveTab('earnings');
  };

  const handleCall = (phone: string, name: string) => {
    showToast(`Calling ${name} (${phone})...`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white pb-20">
      
      {/* Top Rider Operational Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Rider Identity & Online Switch */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                    profile.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">{profile.name}</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {profile.rating} ★ Pilot
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {profile.vehicleType} • <span className="font-mono text-slate-300">{profile.vehicleNumber}</span>
                </p>
              </div>
            </div>

            {/* Quick Online / Offline Toggle Button */}
            <button
              onClick={handleToggleOnline}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                profile.isOnline
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{profile.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>
          </div>

          {/* Right Area: Corridor Info & Role Switcher */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zone: <strong className="text-white">{profile.currentZone}</strong></span>
            </div>

            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Support</span>
            </button>

            <button
              onClick={() => {
                switchRole('customer');
                setActiveView('home');
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              Customer App →
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* 1. Rider Key Performance Overview Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider">Today's Earnings</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">₹{profile.todayEarnings}</p>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Wallet Balance: ₹{profile.walletBalance}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider">Completed Trips</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{profile.todayDeliveries}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Active Trip: {activeTrip ? '1' : '0'}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider">On-Time Rate</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{profile.onTimeRate}%</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Acceptance: {profile.acceptanceRate}%</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider">Distance Covered</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{profile.totalDistanceKm} km</p>
              <p className="text-[11px] text-purple-600 font-bold mt-0.5">Eco Electric Mileage</p>
            </div>
          </div>

        </section>

        {/* 2. Navigation Tabs (Active Delivery vs Available Radar vs Earnings vs History) */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'active'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Bike className="w-4 h-4 text-emerald-400" />
            <span>Active Mission</span>
            {activeTrip && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Navigation className="w-4 h-4 text-amber-500" />
            <span>Available Orders ({availableTrips.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'earnings'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Earnings & Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Trip History ({tripHistory.length})</span>
          </button>
        </div>

        {/* 3. TAB 1: ACTIVE MISSION CONTROL */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {!activeTrip ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Bike className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Active Delivery in Progress</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {profile.isOnline
                    ? `You are online in ${profile.currentZone}. Check the radar tab for incoming restaurant orders ready for dispatch!`
                    : 'Turn your status to ONLINE to start receiving order dispatch requests.'}
                </p>
                {profile.isOnline ? (
                  <button
                    onClick={() => setActiveTab('radar')}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>View Available Orders ({availableTrips.length})</span>
                  </button>
                ) : (
                  <button
                    onClick={handleToggleOnline}
                    className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Go Online Now
                  </button>
                )}
              </div>
            ) : (
              /* Active Delivery Live Card */
              <div className="space-y-6">
                
                {/* Mission Status Stage Banner */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        ACTIVE TRIP #{activeTrip.orderId}
                      </span>
                      <h2 className="text-2xl font-black text-white">
                        {activeTrip.status === 'assigned' && 'Step 1: Head to Partner Kitchen'}
                        {activeTrip.status === 'at_pickup' && 'Step 2: Verify & Collect Meal'}
                        {activeTrip.status === 'picked_up' && 'Step 3: Deliver to Customer Doorstep'}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Guaranteed Payout</p>
                        <p className="text-2xl font-black text-emerald-400">₹{activeTrip.payoutAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Step Progress Visual Bar */}
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        activeTrip.status === 'assigned'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-black'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      <p className="text-[10px] uppercase font-bold">1. Heading to Kitchen</p>
                    </div>
                    <div
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        activeTrip.status === 'at_pickup'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-black'
                          : activeTrip.status === 'picked_up'
                          ? 'bg-slate-800/60 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      <p className="text-[10px] uppercase font-bold">2. Collect & Pack</p>
                    </div>
                    <div
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        activeTrip.status === 'picked_up'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-black'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      <p className="text-[10px] uppercase font-bold">3. Customer Dropoff</p>
                    </div>
                  </div>
                </div>

                {/* Pickup and Delivery Detail Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card 1: Restaurant Pickup Details */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Pickup Point (Kitchen)
                          </p>
                          <h4 className="text-base font-bold text-slate-900">{activeTrip.restaurantName}</h4>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCall(activeTrip.restaurantPhone, activeTrip.restaurantName)}
                        className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Call Kitchen"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">{activeTrip.restaurantAddress}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Distance: ~{activeTrip.pickupDistanceKm} km</p>
                    </div>

                    {/* Stage 1 Action */}
                    {activeTrip.status === 'assigned' && (
                      <button
                        onClick={handleArrivedAtPickup}
                        className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>I Have Arrived at Kitchen</span>
                      </button>
                    )}
                  </div>

                  {/* Card 2: Customer Destination Details */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Dropoff Destination
                          </p>
                          <h4 className="text-base font-bold text-slate-900">{activeTrip.customerName}</h4>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCall(activeTrip.customerPhone, activeTrip.customerName)}
                        className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Call Customer"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">
                        {activeTrip.customerAddress.street}, {activeTrip.customerAddress.area}
                      </p>
                      {activeTrip.specialInstructions && (
                        <p className="text-[11px] text-amber-600 font-bold">{activeTrip.specialInstructions}</p>
                      )}
                      <p className="text-[11px] text-slate-500">Trip Distance: ~{activeTrip.deliveryDistanceKm} km</p>
                    </div>

                    {/* Directions Trigger */}
                    <button
                      onClick={() => setIsDirectionsModalOpen(true)}
                      className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Route & GPS Directions</span>
                    </button>
                  </div>

                </div>

                {/* Items Verification Checklist */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                        Order Items & Tamper Verification
                      </h4>
                      <p className="text-xs text-slate-500">Ensure all containers are sealed with insulation cover</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                      {activeTrip.itemCount} Items
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-800">{activeTrip.itemsSummary}</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Order Amount: ₹{activeTrip.grandTotal} ({activeTrip.paymentMethod})
                    </p>
                  </div>

                  {/* Stage Actions */}
                  {activeTrip.status === 'at_pickup' && (
                    <button
                      onClick={handleConfirmPickup}
                      className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Confirm Items Collected & Start Delivery</span>
                    </button>
                  )}

                  {activeTrip.status === 'picked_up' && (
                    <button
                      onClick={handleConfirmDelivery}
                      className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Delivery Handover at Doorstep</span>
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* 4. TAB 2: AVAILABLE DISPATCH RADAR */}
        {activeTab === 'radar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Nearby Kitchen Orders</h3>
                <p className="text-xs text-slate-500">
                  Ready & cooking orders across Technopark, Kowdiar & Thiruvananthapuram
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200">
                {availableTrips.length} Active Dispatch Requests
              </span>
            </div>

            {availableTrips.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                <Clock className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">No Orders in Dispatch Queue</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  New orders will automatically pop up here as partner kitchens finish preparing tickets.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTrips.map(trip => (
                  <div
                    key={trip.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-emerald-500 transition-all shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                          #{trip.orderId}
                        </span>
                        <span className="text-lg font-black text-emerald-600">
                          ₹{trip.payoutAmount} Payout
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{trip.restaurantName}</h4>
                      <p className="text-xs text-slate-600">
                        📍 Pickup: {trip.restaurantAddress} (~{trip.pickupDistanceKm} km)
                      </p>
                      <p className="text-xs text-slate-600">
                        🏠 Drop: {trip.customerAddress.area}, Thiruvananthapuram
                      </p>

                      <div className="p-3 rounded-2xl bg-slate-50 text-[11px] text-slate-600 font-medium">
                        {trip.itemsSummary}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptTrip(trip.orderId)}
                      disabled={!!activeTrip}
                      className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        activeTrip
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 cursor-pointer'
                      }`}
                    >
                      <span>{activeTrip ? 'Complete Active Mission First' : 'Accept Delivery Trip'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB 3: EARNINGS & WALLET LEDGER */}
        {activeTab === 'earnings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Total Wallet Balance</p>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900">₹{profile.walletBalance}</h3>
                <p className="text-xs text-emerald-600 font-bold mt-1">✓ Instant Payout Available to Bank / UPI</p>
              </div>

              <button
                onClick={() => showToast('Demo Payout: ₹1,840 scheduled for bank transfer.', 'success')}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
              >
                Withdraw to Bank
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Today's Trip Payout Breakdown
              </h4>

              <div className="divide-y divide-slate-100">
                {tripHistory.slice(0, 5).map((trip, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">Trip #{trip.orderId} • {trip.restaurantName}</p>
                      <p className="text-[11px] text-slate-400">
                        {trip.customerAddress.area} • Distance: {trip.deliveryDistanceKm}km
                      </p>
                    </div>
                    <span className="font-black text-emerald-600 text-sm">+₹{trip.payoutAmount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. TAB 4: TRIP HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delivered Trip History</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripHistory.map(trip => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700">
                      ✓ Delivered
                    </span>
                    <span className="text-xs font-bold text-slate-400">{trip.deliveredAt || 'Earlier today'}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{trip.restaurantName}</h4>
                    <p className="text-xs text-slate-500">
                      To: {trip.customerName} ({trip.customerAddress.area})
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">{trip.itemsSummary}</span>
                    <span className="font-black text-emerald-600">₹{trip.payoutAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Support / Safety Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-[32px] p-6 border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Rider Partner Support</h3>
              </div>
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold">24/7 TVM Fleet Dispatch Hotline</p>
                <p className="text-sm font-black">+91 471 2987654</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">Emergency Roadside Assistance</p>
                <p className="text-slate-600">Free puncture and battery swap across all 14 TVM zones</p>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Connecting to Quick Bite TVM Fleet Manager...');
                setIsSupportModalOpen(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Call Fleet Manager
            </button>
          </div>
        </div>
      )}

      {/* GPS Directions Simulated Modal */}
      {isDirectionsModalOpen && activeTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-[32px] p-6 border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">TVM Corridor Turn-by-Turn</h3>
              </div>
              <button
                onClick={() => setIsDirectionsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-950 space-y-1">
                <p className="text-[10px] font-black uppercase text-blue-600">Optimal Route</p>
                <p className="font-bold text-sm">Via Kazhakkoottam Bypass → Technopark Campus Road</p>
                <p className="text-xs text-blue-700">Estimated Duration: ~8 mins • Traffic: Light</p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                  <p className="text-slate-700">Head North on Technopark Main Road toward Phase 1 Gate (400m)</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                  <p className="text-slate-700">Turn right at Silicon Heights security boom barrier (120m)</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                  <p className="text-slate-700 font-bold">Arrive at Flat 4B on the left</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsDirectionsModalOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Close Navigation
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
