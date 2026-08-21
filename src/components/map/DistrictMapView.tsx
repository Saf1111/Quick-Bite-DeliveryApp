import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Restaurant, LocationZone } from '../../types';
import { TVM_DISTRICT_ZONES } from '../../constants/locations';
import { PartnerBadge } from '../brand/Badges';
import {
  MapPin,
  Navigation,
  Compass,
  Star,
  Clock,
  Layers,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  Utensils
} from 'lucide-react';

interface DistrictMapViewProps {
  onSelectRestaurant: (id: string) => void;
}

export const DistrictMapView: React.FC<DistrictMapViewProps> = ({ onSelectRestaurant }) => {
  const { restaurants, locationZone, setLocationZone, setSelectedRestaurantId, setActiveView } = useApp();

  const [selectedPin, setSelectedPin] = useState<Restaurant | null>(restaurants[0] || null);
  const [filterMode, setFilterMode] = useState<'all' | 'partner' | 'nearby'>('all');
  const [searchMapText, setSearchMapText] = useState('');

  const filteredRestaurants = restaurants.filter(r => {
    if (filterMode === 'partner' && !r.isPartner) return false;
    if (filterMode === 'nearby' && r.isPartner) return false;
    if (searchMapText.trim()) {
      const q = searchMapText.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.cuisines.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-slate-950 text-white flex flex-col">
      {/* Top Map Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Search & District Selector */}
        <div className="flex items-center gap-2 pointer-events-auto max-w-lg flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search places in Thiruvananthapuram District..."
              value={searchMapText}
              onChange={e => setSearchMapText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-xl"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterMode === 'all' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({restaurants.length})
            </button>
            <button
              onClick={() => setFilterMode('partner')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterMode === 'partner' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Partners
            </button>
          </div>
        </div>

        {/* Current Active Zone Pill */}
        <div className="self-end sm:self-auto pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300">Active Zone:</span>
          <strong className="text-orange-400">{locationZone.name}</strong>
        </div>
      </div>

      {/* Main Interactive High-Precision Vector Canvas Area */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center p-6 sm:p-12">
        {/* District Terrain Grid Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

        {/* District Map Canvas Visual */}
        <div className="relative w-full max-w-5xl aspect-16/10 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl p-6 overflow-hidden">
          
          {/* Map Vector Roads / Coastline Graphic Representation */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-800 fill-none stroke-[2]" viewBox="0 0 800 500">
            {/* Arabian Sea Coastline curve */}
            <path
              d="M 50 30 C 150 180, 200 320, 260 480"
              className="stroke-cyan-800/60 stroke-[4] fill-none"
            />
            {/* NH 66 bypass corridor */}
            <path
              d="M 120 20 L 320 220 L 450 380 L 600 480"
              className="stroke-orange-500/20 stroke-[3]"
            />
            {/* MC Road inland corridor */}
            <path
              d="M 400 30 L 480 200 L 520 450"
              className="stroke-emerald-500/20 stroke-[2]"
            />
          </svg>

          {/* Watermark Label */}
          <div className="absolute bottom-4 left-6 text-[11px] text-slate-600 font-mono">
            THIRUVANANTHAPURAM DISTRICT FOOD DISCOVERY ENGINE (8.5241° N, 76.9366° E)
          </div>

          {/* Zone Region Anchors */}
          {TVM_DISTRICT_ZONES.map((zone, idx) => {
            // Distribute zone pins across map canvas
            const leftPct = 20 + ((idx * 27) % 65);
            const topPct = 15 + ((idx * 19) % 70);

            return (
              <div
                key={zone.id}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 hover:opacity-100 transition-opacity"
              >
                <div className="text-[10px] font-bold text-slate-500 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800">
                  {zone.name}
                </div>
              </div>
            );
          })}

          {/* Restaurant Pin Markers */}
          {filteredRestaurants.map((rest, index) => {
            // Coordinate projection onto visual space
            const left = 25 + ((index * 22) % 60);
            const top = 20 + ((index * 17) % 60);
            const isSelected = selectedPin?.id === rest.id;

            return (
              <div
                key={rest.id}
                style={{ left: `${left}%`, top: `${top}%` }}
                onClick={() => setSelectedPin(rest)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-300 group ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                {/* Pin Head */}
                <div
                  className={`px-2.5 py-1 rounded-2xl flex items-center gap-1.5 shadow-2xl border transition-all ${
                    rest.isPartner
                      ? isSelected
                        ? 'bg-orange-500 text-white border-white ring-4 ring-orange-500/40'
                        : 'bg-orange-600 text-white border-orange-400'
                      : isSelected
                      ? 'bg-slate-700 text-white border-white'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[11px] font-black whitespace-nowrap">{rest.name}</span>
                </div>

                {/* Pin Pointer Stem */}
                <div className="w-1.5 h-2 bg-orange-600 mx-auto rounded-b-full shadow-xs" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Restaurant Bottom Card Sheet */}
      {selectedPin && (
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom duration-200 z-30">
          <div className="max-w-4xl mx-auto bg-slate-800/90 rounded-3xl p-4 sm:p-5 border border-slate-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={selectedPin.coverImage}
                alt={selectedPin.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-slate-700"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <PartnerBadge isPartner={selectedPin.isPartner} size="sm" />
                  <span className="text-xs text-slate-400 font-semibold truncate">{selectedPin.area}</span>
                </div>
                <h4 className="text-base font-black text-white truncate">{selectedPin.name}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {selectedPin.rating}
                  </span>
                  <span>•</span>
                  <span>~{selectedPin.avgDeliveryTimeMin} mins</span>
                  <span>•</span>
                  <span>₹{selectedPin.priceForTwo} for two</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {selectedPin.isPartner ? (
                <button
                  id="view-restaurant-menu-btn"
                  onClick={() => {
                    setSelectedRestaurantId(selectedPin.id);
                    setActiveView('restaurant');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black shadow-lg shadow-orange-600/30 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <span>Explore Menu & Order</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-xs text-slate-400 text-right">
                  <p className="font-bold text-slate-300">Discovered Location</p>
                  <p className="text-[11px]">{selectedPin.phone}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
