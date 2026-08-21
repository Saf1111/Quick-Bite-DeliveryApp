import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Address } from '../../types';
import {
  User,
  MapPin,
  Heart,
  SlidersHorizontal,
  Plus,
  Trash2,
  Sparkles,
  Shield,
  ArrowLeft,
  Receipt,
  CheckCircle2
} from 'lucide-react';
import { FoodCard } from '../restaurant/FoodCard';
import { RestaurantCard } from '../restaurant/RestaurantCard';

export const AccountView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    userPreferences,
    setIsProfileModalOpen,
    restaurants,
    favoriteItemIds,
    favoriteRestaurantIds,
    setSelectedRestaurantId,
    setActiveView,
    accountSubTab,
    setAccountSubTab,
    showToast
  } = useApp();

  const { user } = useAuth();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);

  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('Kazhakkoottam');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');

  // Gather favorite items
  const favItems: any[] = [];
  restaurants.forEach(r => {
    r.menu.forEach(item => {
      if (favoriteItemIds.includes(item.id)) {
        favItems.push(item);
      }
    });
  });

  // Gather favorite restaurants
  const favRestaurants = restaurants.filter(r => favoriteRestaurantIds.includes(r.id));

  const handleSaveProfile = () => {
    updateUserProfile({ name, email, phone });
    showToast('Profile details updated successfully!');
  };

  const handleAddAddress = () => {
    if (!newAddrStreet.trim()) {
      showToast('Please enter street and address line', 'error');
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      street: newAddrStreet,
      area: newAddrArea,
      district: 'Thiruvananthapuram',
      landmark: newAddrLandmark || 'Near Main Junction',
      lat: 8.5583,
      lng: 76.8812,
      isDefault: false
    };

    updateUserProfile({
      savedAddresses: [...(userProfile.savedAddresses || []), newAddr]
    });

    setNewAddrStreet('');
    setNewAddrLandmark('');
    showToast('New delivery address saved!');
  };

  const handleDeleteAddress = (id: string) => {
    updateUserProfile({
      savedAddresses: (userProfile.savedAddresses || []).filter(a => a.id !== id)
    });
    showToast('Address removed.');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          <button
            onClick={() => setActiveView('orders')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Go to My Orders →</span>
          </button>
        </div>

        {/* User Profile Card Top Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">{userProfile.name}</h1>
              <p className="text-xs text-slate-500">{userProfile.phone} • {userProfile.email}</p>
              <div className="flex items-center gap-2 pt-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Diet: {userPreferences.dietType}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  TVM District Member
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Edit Food Preferences</span>
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 text-xs font-bold">
          <button
            onClick={() => setAccountSubTab('profile')}
            className={`px-4 py-2.5 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${
              accountSubTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setAccountSubTab('addresses')}
            className={`px-4 py-2.5 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${
              accountSubTab === 'addresses'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
            }`}
          >
            Saved Delivery Addresses ({userProfile.savedAddresses?.length || 0})
          </button>
          <button
            onClick={() => setAccountSubTab('favorites')}
            className={`px-4 py-2.5 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${
              accountSubTab === 'favorites'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
            }`}
          >
            Favorites ({favItems.length + favRestaurants.length})
          </button>
        </div>

        {/* Tab 1: Profile */}
        {accountSubTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm max-w-xl space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Personal Information</h3>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Mobile Number (Delivery & OTP)</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Tab 2: Addresses */}
        {accountSubTab === 'addresses' && (
          <div className="space-y-6">
            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(userProfile.savedAddresses || []).map(addr => (
                <div
                  key={addr.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{addr.label}</span>
                      </span>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{addr.street}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {addr.area}, {addr.district} • Landmark: {addr.landmark}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-700 font-bold uppercase tracking-wider">TVM Delivery Zone</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Address Form */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm max-w-xl space-y-4">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Add New Delivery Address</span>
              </h4>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Address Label</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setNewAddrLabel(l)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        newAddrLabel === l
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Flat / House No, Street, Building</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 4B, Silicon Heights, Near Bhavani Building"
                  value={newAddrStreet}
                  onChange={e => setNewAddrStreet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Corridor Area</label>
                  <select
                    value={newAddrArea}
                    onChange={e => setNewAddrArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Kazhakkoottam">Kazhakkoottam</option>
                    <option value="Technopark">Technopark Phase 1/2/3</option>
                    <option value="Kowdiar">Kowdiar & Golf Club</option>
                    <option value="Sasthamangalam">Sasthamangalam</option>
                    <option value="Palayam">Palayam & Statue</option>
                    <option value="Varkala">Varkala Coastal</option>
                    <option value="Pattom">Pattom & Kesavadasapuram</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Behind Main Security Gate"
                    value={newAddrLandmark}
                    onChange={e => setNewAddrLandmark(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={handleAddAddress}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
              >
                Save New Address
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Favorites */}
        {accountSubTab === 'favorites' && (
          <div className="space-y-6">
            {/* Dishes */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Favorite Dishes ({favItems.length})
              </h3>
              {favItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favItems.map(item => (
                    <FoodCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-white p-6 rounded-3xl border border-slate-200/80">
                  No favorite food items bookmarked yet. Tap the heart icon on any dish!
                </p>
              )}
            </div>

            {/* Restaurants */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Favorite Kitchens ({favRestaurants.length})
              </h3>
              {favRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favRestaurants.map(r => (
                    <RestaurantCard
                      key={r.id}
                      restaurant={r}
                      onClick={() => {
                        setSelectedRestaurantId(r.id);
                        setActiveView('restaurant');
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-white p-6 rounded-3xl border border-slate-200/80">
                  No favorite restaurants bookmarked yet.
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
