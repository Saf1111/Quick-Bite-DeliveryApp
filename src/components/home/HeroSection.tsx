import React from 'react';
import { Sparkles, UtensilsCrossed, Zap, ShieldCheck, Flame, Compass, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection: React.FC = () => {
  const {
    locationZone,
    setIsSurpriseModalOpen,
    setIsMealBuilderOpen,
    setIsProfileModalOpen,
    setActiveView
  } = useApp();

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-[#0A0A0B] border-b border-white/10">
      {/* Background ambient radial blurs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FF6B00]/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy & Actions with Bold Typography */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Top Area Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 shadow-sm text-xs font-bold text-zinc-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
              </span>
              <span className="text-zinc-200">Serving <strong className="text-[#FF6B00]">{locationZone.name}</strong> & Thiruvananthapuram</span>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="text-[#FF8500] hover:text-[#FFA000] underline text-[11px] font-black ml-1 uppercase tracking-wider"
              >
                Customize Diet
              </button>
            </div>

            {/* Main Headline - Bold Typography Theme Archetype */}
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#FF6B00]">
                Thiruvananthapuram Food Discovery
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black text-white tracking-tighter leading-[0.92] uppercase">
                FIND YOUR <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8500] to-[#FFCC00] italic">
                  PERFECT BITE.
                </span>
              </h1>
            </div>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Food that fits your mood, lifestyle and moment. Powered by transparent match scoring, macro-aware filters, and custom meal building across Thiruvananthapuram.
            </p>

            {/* Hero CTA Cluster */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-surprise-me-cta"
                onClick={() => setIsSurpriseModalOpen(true)}
                className="px-7 py-4 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-black stroke-black" />
                <span>Surprise Me Today</span>
              </button>

              <button
                id="hero-build-meal-cta"
                onClick={() => setIsMealBuilderOpen(true)}
                className="px-6 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:border-white/30"
              >
                <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                <span>Build My Meal</span>
              </button>

              <button
                id="hero-explore-map-cta"
                onClick={() => setActiveView('map')}
                className="px-5 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 border border-white/10"
              >
                <Compass className="w-4 h-4 text-[#FF6B00]" />
                <span>District Map</span>
              </button>
            </div>

            {/* Value Highlights in Dark Minimal Grid */}
            <div className="grid grid-cols-3 gap-3 pt-6 max-w-md mx-auto lg:mx-0 border-t border-white/10">
              <div className="text-left bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                <p className="text-base font-black text-white tracking-tight">⚡ ~18 min</p>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Quick 15 Express</p>
              </div>
              <div className="text-left bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                <p className="text-base font-black text-emerald-400 tracking-tight">96% Match</p>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Personalized Rules</p>
              </div>
              <div className="text-left bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                <p className="text-base font-black text-[#FF6B00] tracking-tight">14 Zones</p>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Full TVM District</p>
              </div>
            </div>

          </div>

          {/* Right Column: Layered Dark Visual with Glowing Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Visual Container */}
            <div className="relative w-full max-w-md aspect-square rounded-[36px] p-5 bg-gradient-to-tr from-white/[0.08] via-white/[0.03] to-white/[0.05] border border-white/15 shadow-2xl backdrop-blur-2xl flex items-center justify-center">
              
              {/* Main Dish Imagery with rounded mask & 3D glow */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-2xl border-4 border-[#FF6B00]/40 transition-transform duration-500 hover:scale-105 group">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80"
                  alt="Quick Bite Signature Protein Bowl"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/20 shadow-lg">
                    Charred Pepper Power Bowl
                  </span>
                </div>
              </div>

              {/* Floating Badge 1: Quick Match Score */}
              <div className="absolute -top-3 right-4 sm:-right-2 bg-[#121215]/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black font-black flex items-center justify-center text-xs shadow-md">
                  96%
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white uppercase tracking-wider">Quick Match</p>
                  <p className="text-[10px] text-emerald-400 font-bold">High Protein • Less Oil</p>
                </div>
              </div>

              {/* Floating Badge 2: Quick 15 Express Timer */}
              <div className="absolute -bottom-4 left-2 sm:-left-4 bg-[#121215]/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-[#FF6B00]/30 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-black font-black flex items-center justify-center text-xs shadow-md">
                  <Zap className="w-4 h-4 text-black fill-black" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white uppercase tracking-wider">Quick 15</p>
                  <p className="text-[10px] text-[#FF8500] font-bold">12m Cooking Time</p>
                </div>
              </div>

              {/* Floating Badge 3: Macro Specs */}
              <div className="absolute top-1/2 -right-4 sm:-right-6 bg-black/90 backdrop-blur-xl text-white px-3.5 py-2 rounded-2xl shadow-2xl border border-white/20 text-xs font-black flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="tracking-tight">38g Protein • 420 kcal</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
