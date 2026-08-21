import React from 'react';
import { Logo } from '../brand/Logo';
import { TVM_DISTRICT_ZONES } from '../../constants/locations';
import { ShieldCheck, MapPin, Sparkles, ChefHat, Bike, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { setLocationZone, setActiveView } = useApp();
  const { switchRole } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Logo variant="full" theme="dark" />
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Discover • Personalize • Build • Order • Track. Intelligent food delivery platform crafted for Thiruvananthapuram District, Kerala.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% District Coverage
              </span>
            </div>
          </div>

          {/* District Coverage Hubs */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Thiruvananthapuram District Corridors</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {TVM_DISTRICT_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    setLocationZone(zone);
                    setActiveView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left py-1 text-slate-400 hover:text-emerald-400 font-medium transition-colors truncate cursor-pointer"
                >
                  • {zone.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links & App Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Connected Portals</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => {
                    switchRole('customer');
                    setActiveView('home');
                  }}
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customer Discovery App</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('partner');
                    setActiveView('partner');
                  }}
                  className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                  <span>Partner Kitchen (KDS)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('delivery');
                    setActiveView('delivery');
                  }}
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Bike className="w-3.5 h-3.5 text-blue-400" />
                  <span>Delivery Partner (Rider)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('admin');
                    setActiveView('admin');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Operations Hub</span>
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => setActiveView('map')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  District Interactive Map
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="text-center md:text-left font-normal">
            © {new Date().getFullYear()} Quick Bite Food Discovery & Delivery. Thiruvananthapuram, Kerala, India.
          </p>
          <p className="text-[11px] text-slate-500 text-center max-w-xl">
            Quick Match scores and dietary indicators are calculated transparently based on ingredient nutritional profiles.
          </p>
        </div>
      </div>
    </footer>
  );
};
