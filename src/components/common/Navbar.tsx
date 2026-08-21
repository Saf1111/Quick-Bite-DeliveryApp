import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  ShoppingBag,
  User,
  Sparkles,
  ChevronDown,
  Shield,
  Compass,
  UtensilsCrossed,
  ChefHat,
  Bike,
  X,
  ArrowRight,
  TrendingUp,
  Receipt,
  Heart,
  Settings,
  LogOut,
  Package
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { VegBadge } from '../brand/Badges';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MenuItem, Restaurant } from '../../types';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    locationZone,
    setLocationZone,
    allZones,
    cartCount,
    cartTotal,
    restaurants,
    setSelectedRestaurantId,
    addToCart,
    showToast,
    orders,
    setAccountSubTab,
    setIsCartOpen,
    setIsProfileModalOpen,
    setIsSurpriseModalOpen,
    setIsMealBuilderOpen,
    setIsSearchModalOpen
  } = useApp();

  const { user, role, switchRole, logout } = useAuth();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  
  // Calculate active in-flight orders count
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  
  // Header inline search states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLocationDropdownOpen(false);
        setIsRoleDropdownOpen(false);
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchFocused(true);
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Quick suggestions & live query matches
  const popularKeywords = ['High Protein', 'Malabar Biryani', 'Kowdiar Cafes', 'Appam & Stew', 'Pure Veg', 'Fresh Salads'];

  // Flattened dishes
  const allDishes: { item: MenuItem; restaurant: Restaurant }[] = [];
  restaurants.forEach(rest => {
    rest.menu.forEach(item => {
      allDishes.push({ item, restaurant: rest });
    });
  });

  const q = searchQuery.trim().toLowerCase();
  const matchedDishes = q
    ? allDishes
        .filter(
          d =>
            d.item.name.toLowerCase().includes(q) ||
            d.item.description.toLowerCase().includes(q) ||
            d.item.cuisine.toLowerCase().includes(q) ||
            d.item.tags.some(t => t.toLowerCase().includes(q))
        )
        .slice(0, 4)
    : [];

  const matchedRestaurants = q
    ? restaurants
        .filter(
          r =>
            r.name.toLowerCase().includes(q) ||
            r.area.toLowerCase().includes(q) ||
            r.cuisines.some(c => c.toLowerCase().includes(q))
        )
        .slice(0, 2)
    : [];

  const handleSelectDish = (dish: MenuItem, rest: Restaurant) => {
    setSelectedRestaurantId(rest.id);
    setActiveView('home');
    addToCart(dish, rest.id, rest.name);
    showToast(`Added ${dish.name} to cart!`);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleSelectRestaurant = (rest: Restaurant) => {
    setSelectedRestaurantId(rest.id);
    setActiveView('home');
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          
          {/* 1. Brand Logo */}
          <div className="shrink-0 flex items-center">
            <Logo
              variant="navbar"
              theme="auto"
              onClick={() => {
                setActiveView('home');
              }}
            />
          </div>

          {/* 2. TVM Location Selector */}
          <div className="relative shrink-0" ref={locationRef}>
            <button
              id="location-picker-btn"
              aria-label="Select delivery corridor"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-slate-800 text-xs font-bold transition-all group cursor-pointer"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" />
              </div>
              <div className="text-left max-w-[80px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[170px] truncate">
                <span className="block text-[8px] sm:text-[9px] text-emerald-700 uppercase tracking-wider font-extrabold leading-none">
                  TVM Corridor
                </span>
                <span className="block truncate text-slate-900 font-bold tracking-tight text-xs mt-0.5">
                  {locationZone.name}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform shrink-0" />
            </button>

            {/* Location Popover Menu */}
            {isLocationDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 p-2 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select TVM Corridor</p>
                    <p className="text-[11px] text-slate-500">14 delivery zones across Thiruvananthapuram</p>
                  </div>
                  <button
                    aria-label="Close corridor selector"
                    onClick={() => setIsLocationDropdownOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                  {allZones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setLocationZone(zone);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                        locationZone.id === zone.id
                          ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-bold tracking-tight">{zone.name}</p>
                        <p
                          className={`text-[10px] ${
                            locationZone.id === zone.id ? 'text-emerald-100' : 'text-slate-400'
                          }`}
                        >
                          {zone.tagline}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          locationZone.id === zone.id
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        ~{zone.avgDeliveryMin}m
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Search Bar (Compact & Balanced with smooth Dropdown below) */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md" ref={searchRef}>
            <div
              className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-2xl border transition-all ${
                isSearchFocused
                  ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'bg-slate-100/90 hover:bg-slate-100 border-slate-200/80'
              }`}
            >
              <Search className={`w-4 h-4 shrink-0 transition-colors ${isSearchFocused ? 'text-emerald-600' : 'text-slate-400'}`} />
              
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (!isSearchFocused) setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder='Search "Protein", "Biryani", "Kowdiar"...'
                className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none truncate"
              />

              {searchQuery ? (
                <button
                  aria-label="Clear search text"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-0.5 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] bg-white border border-slate-200 rounded-md text-slate-400 font-mono font-bold shrink-0 shadow-2xs">
                  ⌘K
                </kbd>
              )}
            </div>

            {/* Polished, properly positioned dropdown menu directly below */}
            {isSearchFocused && (
              <div
                id="header-search-dropdown"
                className="absolute left-0 top-full mt-2 w-full min-w-[290px] sm:min-w-[360px] md:min-w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900"
              >
                {/* When no query is typed: Popular quick filters */}
                {!searchQuery.trim() ? (
                  <div className="p-3.5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Popular In Thiruvananthapuram</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {popularKeywords.map(keyword => (
                        <button
                          key={keyword}
                          onClick={() => {
                            setSearchQuery(keyword);
                            searchInputRef.current?.focus();
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/60 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">Need advanced macro/diet filters?</span>
                      <button
                        onClick={() => {
                          setIsSearchFocused(false);
                          setIsSearchModalOpen(true);
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Smart Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* When user is actively typing */
                  <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                    {/* Matching Restaurants */}
                    {matchedRestaurants.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 pt-1">
                          Kitchens & Places
                        </p>
                        {matchedRestaurants.map(rest => (
                          <button
                            key={rest.id}
                            onClick={() => handleSelectRestaurant(rest)}
                            className="w-full text-left p-2 rounded-2xl hover:bg-slate-100 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={rest.coverImage}
                                alt={rest.name}
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 rounded-xl object-cover border border-slate-100 shrink-0"
                              />
                              <div className="truncate">
                                <p className="text-xs font-bold text-slate-900 truncate">{rest.name}</p>
                                <p className="text-[10px] text-slate-500 truncate">{rest.area} • {rest.cuisines.join(', ')}</p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black shrink-0">
                              {rest.rating} ★
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Matching Dishes */}
                    {matchedDishes.length > 0 ? (
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 pt-1">
                          Matching Dishes
                        </p>
                        {matchedDishes.map(({ item, restaurant }) => (
                          <div
                            key={item.id}
                            className="p-2 rounded-2xl hover:bg-slate-100 flex items-center justify-between gap-2 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <VegBadge isVeg={item.isVeg} size="sm" />
                              <div className="truncate">
                                <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                                <p className="text-[10px] text-slate-500 truncate">
                                  {restaurant.name} • {item.nutrition?.proteinGrams || 18}g protein
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-black text-slate-900">₹{item.price}</span>
                              <button
                                onClick={() => handleSelectDish(item, restaurant)}
                                className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-2xs transition-transform active:scale-95 cursor-pointer"
                              >
                                + Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      matchedRestaurants.length === 0 && (
                        <div className="p-6 text-center text-slate-500 text-xs space-y-2">
                          <p className="font-semibold text-slate-700">No immediate matches for "{searchQuery}"</p>
                          <p className="text-[11px]">Try exploring by ingredient, diet tag or corridor area.</p>
                        </div>
                      )
                    )}

                    {/* Footer trigger to Smart Search Modal */}
                    <div className="pt-2 border-t border-slate-100 px-2 pb-1 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">See all diet metrics & filters</span>
                      <button
                        onClick={() => {
                          setIsSearchFocused(false);
                          setIsSearchModalOpen(true);
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Full Search</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Right Area: Surprise Me, Build Meal, Controls, Role Switcher, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 shrink-0">
            
            {/* 4a. Surprise Me Feature CTA */}
            <button
              id="nav-surprise-btn"
              aria-label="Surprise Me Recommendation"
              onClick={() => setIsSurpriseModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Surprise Me</span>
            </button>

            {/* 4b. Build Meal Studio CTA */}
            <button
              id="nav-meal-builder-btn"
              aria-label="Build Custom Meal"
              onClick={() => setIsMealBuilderOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-900 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
              <span>Build Meal</span>
            </button>

            {/* 4c. Controls: Personalization Diet Prefs Button */}
            <button
              id="nav-diet-prefs-btn"
              aria-label="Personalize Food and Dietary Preferences"
              title="Diet Preferences"
              onClick={() => setIsProfileModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-2xl text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* 4d. Controls: District Map Navigation */}
            <button
              id="nav-map-btn"
              aria-label="Thiruvananthapuram District Interactive Food Map"
              title="TVM Food Map"
              onClick={() => setActiveView('map')}
              className={`p-2 sm:p-2.5 rounded-2xl transition-all border cursor-pointer ${
                activeView === 'map'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 font-bold'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border-slate-200/80'
              }`}
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* 4e. Direct My Orders Icon Button (Near Cart & You) */}
            <button
              id="nav-orders-btn"
              aria-label="My Orders"
              title="My Orders"
              onClick={() => {
                setActiveView('orders');
              }}
              className={`relative p-2 sm:p-2.5 rounded-2xl transition-all border cursor-pointer ${
                activeView === 'orders'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 font-bold'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border-slate-200/80'
              }`}
            >
              <Receipt className="w-4 h-4" />
              {activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-black text-white ring-2 ring-white animate-pulse">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* 4f. "You" Profile Dropdown Menu */}
            <div className="relative" ref={roleRef}>
              <button
                id="nav-you-profile-btn"
                aria-label="You - Customer Profile and Preferences"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-2xl border transition-all shadow-2xs cursor-pointer ${
                  activeView === 'account' || isRoleDropdownOpen
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 border-slate-200/80'
                }`}
              >
                <div className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 ${
                  activeView === 'account' || isRoleDropdownOpen ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {user?.name ? user.name.charAt(0) : 'Y'}
                </div>
                <span className="text-xs font-bold tracking-tight hidden sm:inline">
                  {role === 'customer' ? 'You' : role === 'partner' ? 'Kitchen' : role === 'delivery' ? 'Rider' : 'Admin'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${
                  activeView === 'account' || isRoleDropdownOpen ? 'text-slate-300' : 'text-slate-400'
                }`} />
              </button>

              {/* "You" Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 p-2 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
                  {/* User Profile Card Header */}
                  <div className="px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 mb-1.5">
                    <p className="text-xs font-black text-slate-900 tracking-tight">{user?.name || 'Alex Thomas'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email || 'alex.thomas@example.com'}</p>
                  </div>

                  {/* Primary You Links */}
                  <div className="space-y-0.5">
                    {/* 1. My Profile */}
                    <button
                      onClick={() => {
                        setAccountSubTab('profile');
                        setActiveView('account');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>My Profile</span>
                    </button>

                    {/* 2. My Orders */}
                    <button
                      onClick={() => {
                        setActiveView('orders');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Receipt className="w-4 h-4 text-emerald-600" />
                        <span>My Orders</span>
                      </div>
                      {activeOrdersCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          {activeOrdersCount} active
                        </span>
                      )}
                    </button>

                    {/* 3. Favorites */}
                    <button
                      onClick={() => {
                        setAccountSubTab('favorites');
                        setActiveView('account');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Favorites</span>
                    </button>

                    {/* 4. Saved Addresses */}
                    <button
                      onClick={() => {
                        setAccountSubTab('addresses');
                        setActiveView('account');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span>Saved Addresses</span>
                    </button>

                    {/* 5. Quick Match Preferences */}
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-purple-500" />
                      <span>Quick Match Preferences</span>
                    </button>

                    {/* 6. Settings */}
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        showToast('Notification and TVM corridor settings are up to date.');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Switch Portals Submenu */}
                  <div className="border-t border-slate-100 mt-1.5 pt-1.5 px-1 space-y-1">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider px-2 py-0.5">
                      Switch Role Portal
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => {
                          switchRole('customer');
                          setActiveView('home');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`p-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ${
                          role === 'customer' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Customer</span>
                      </button>

                      <button
                        onClick={() => {
                          switchRole('partner');
                          setActiveView('partner');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`p-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ${
                          role === 'partner' ? 'bg-amber-50 text-amber-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <ChefHat className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">Kitchen</span>
                      </button>

                      <button
                        onClick={() => {
                          switchRole('delivery');
                          setActiveView('delivery');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`p-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ${
                          role === 'delivery' ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Bike className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">Rider</span>
                      </button>

                      <button
                        onClick={() => {
                          switchRole('admin');
                          setActiveView('admin');
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`p-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ${
                          role === 'admin' ? 'bg-purple-50 text-purple-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">Admin</span>
                      </button>
                    </div>
                  </div>

                  {/* 7. Logout */}
                  <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                    <button
                      onClick={() => {
                        logout();
                        showToast('Logged out of Quick Bite');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-2xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4g. Shopping Bag / Cart Trigger */}
            <button
              id="cart-drawer-trigger"
              aria-label="Open Shopping Cart"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline font-bold tracking-tight">₹{cartTotal}</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-emerald-400 text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
