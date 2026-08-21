import React, { useState, useEffect } from 'react';
import {
  Compass,
  Store,
  Sparkles,
  UtensilsCrossed,
  ShoppingBag,
  Zap,
  Bike,
  Heart,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface TutorialStep {
  id: number;
  title: string;
  shortLabel: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  highlights: string[];
  visualPreview: {
    badge: string;
    headline: string;
    subtext: string;
    metric: string;
    metricLabel: string;
    bgGradient: string;
  };
}

export const HowToUseSection: React.FC = () => {
  const {
    locationZone,
    setIsSurpriseModalOpen,
    setIsMealBuilderOpen,
    setIsProfileModalOpen,
    setActiveView
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);

  const steps: TutorialStep[] = [
    {
      id: 1,
      title: '1. Select Your TVM District Corridor',
      shortLabel: '1. Set Location',
      tagline: 'Hyper-local Delivery Across Thiruvananthapuram',
      description:
        'Choose your corridor from the header dropdown — Technopark, Kowdiar, Kazhakkoottam, Sreekaryam, Palayam, Vazhuthacaud, or 14+ district zones. All restaurant menus and delivery ETAs dynamically adapt.',
      icon: <Compass className="w-5 h-5 text-[#FF6B00]" />,
      accentColor: '#FF6B00',
      highlights: ['14+ TVM corridors covered', 'Instant ETA estimation', 'Accurate kitchen availability'],
      visualPreview: {
        badge: 'CORRIDOR DISPATCH',
        headline: `${locationZone.name}`,
        subtext: 'Average Delivery Time: ~20-25 mins across all verified kitchen partners',
        metric: '14 Zones',
        metricLabel: 'District Coverage',
        bgGradient: 'from-orange-500/20 via-amber-500/10 to-transparent'
      }
    },
    {
      id: 2,
      title: '2. Explore Verified Partner Kitchens',
      shortLabel: '2. Pick Kitchen',
      tagline: 'Authentic Local Flavors & Cloud Kitchens',
      description:
        'Browse top-rated heritage bistros, coastal seafood specialists, wholesome protein studios, and traditional Kerala kitchens with full transparency on chef certifications and safety.',
      icon: <Store className="w-5 h-5 text-emerald-400" />,
      accentColor: '#10B981',
      highlights: ['100% Verified Partners', 'Pure Veg & Specialty Flags', 'Zero Artificial Surge'],
      visualPreview: {
        badge: 'CERTIFIED KITCHEN',
        headline: 'Technopark Kerala Kitchen',
        subtext: '4.8 ★ (1,420+ reviews) • Malabar & Travancore Cuisine',
        metric: '98.6%',
        metricLabel: 'Kitchen Hygiene Score',
        bgGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent'
      }
    },
    {
      id: 3,
      title: '3. Personalized Quick Match Discovery',
      shortLabel: '3. Quick Match',
      tagline: 'Food Recommendations Tailored to You',
      description:
        'Set your diet (High Protein, Vegetarian, Less Oil, Mild Spice) in your profile. Quick Match scores each dish out of 100% with plain-English reasons why it fits your preferences.',
      icon: <Sparkles className="w-5 h-5 text-[#FF8500]" />,
      accentColor: '#FF8500',
      highlights: ['Transparent Match %', 'Macro-aware filters', 'Dietary intolerance protection'],
      visualPreview: {
        badge: 'AI MATCH ENGINE',
        headline: '96% Match Score',
        subtext: 'High Protein (28g) • Mild Kerala Spice • Budget Friendly (Under ₹250)',
        metric: '96%',
        metricLabel: 'Personal Fit Score',
        bgGradient: 'from-orange-500/25 via-yellow-500/10 to-transparent'
      }
    },
    {
      id: 4,
      title: '4. Customize & Build Your Meal',
      shortLabel: '4. Customize Meal',
      tagline: 'Exact Portions, Add-ons & Chef Notes',
      description:
        'Tailor your dish portion, select wholesome add-ons, adjust spice tolerance, or build a bowl from scratch with the interactive Meal Builder studio.',
      icon: <UtensilsCrossed className="w-5 h-5 text-blue-400" />,
      accentColor: '#3B82F6',
      highlights: ['Interactive portion selector', 'Live macro calculator', 'Direct kitchen notes'],
      visualPreview: {
        badge: 'MEAL BUILDER STUDIO',
        headline: 'Custom Pepper Protein Bowl',
        subtext: 'Brown Rice Base + Charred Paneer + Herb Dip + Extra Curry Leaves',
        metric: '32g',
        metricLabel: 'Custom Protein Output',
        bgGradient: 'from-blue-500/20 via-indigo-500/10 to-transparent'
      }
    },
    {
      id: 5,
      title: '5. Review Bag & Apply Promos',
      shortLabel: '5. Review Bag',
      tagline: 'Transparent Pricing & Instant Savings',
      description:
        'Review items in the slide-out bag. Apply promo codes like QUICKBITE or FIRSTBITE for instant discounts with free delivery thresholds above ₹300.',
      icon: <ShoppingBag className="w-5 h-5 text-purple-400" />,
      accentColor: '#A855F7',
      highlights: ['Coupons: QUICKBITE, FIRSTBITE', 'Clear itemized breakdown', 'No hidden markups'],
      visualPreview: {
        badge: 'SAVINGS APPLIED',
        headline: 'Code: QUICKBITE (₹75 OFF)',
        subtext: 'Item Total: ₹340 • Promo Discount: -₹75 • Free Delivery Active',
        metric: '₹265',
        metricLabel: 'Final Bag Total',
        bgGradient: 'from-purple-500/20 via-pink-500/10 to-transparent'
      }
    },
    {
      id: 6,
      title: '6. One-Tap Instant Checkout',
      shortLabel: '6. Instant Checkout',
      tagline: 'Seamless Frictionless Demo Experience',
      description:
        'Select from saved TVM addresses (Home, Office, Technopark Campus), select payment preference (UPI, Card, COD), and confirm order instantly with zero card friction.',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      accentColor: '#F59E0B',
      highlights: ['Instant demo confirmation', 'Address pinpointing', 'Confetti celebration'],
      visualPreview: {
        badge: 'ORDER CONFIRMED',
        headline: 'Ticket #QB-8924 Placed',
        subtext: 'Delivering to Flat 4B, Silicon Heights, Technopark Campus Phase 1',
        metric: 'Instant',
        metricLabel: 'Order Handshake',
        bgGradient: 'from-amber-500/20 via-orange-500/10 to-transparent'
      }
    },
    {
      id: 7,
      title: '7. Live Kitchen-to-Doorstep Tracking',
      shortLabel: '7. Live Tracking',
      tagline: 'Real-time Kitchen KDS & Rider Dispatch',
      description:
        'Follow your meal through each milestone: Accepted by Kitchen -> Cooking Fresh -> Packed & Ready -> Rider Picked Up -> Arriving at your doorstep with live simulated dispatch.',
      icon: <Bike className="w-5 h-5 text-emerald-400" />,
      accentColor: '#10B981',
      highlights: ['Milestone step visualizer', 'Delivery partner contact', 'Real-time status sync'],
      visualPreview: {
        badge: 'LIVE DISPATCH',
        headline: 'Rider Rajesh K. on the way',
        subtext: 'Hero Electric Scooter • KL-01-CZ-4592 • ~7 mins away',
        metric: '~18m',
        metricLabel: 'Total Trip Time',
        bgGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent'
      }
    }
  ];

  // Auto-play walkthrough timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % steps.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const activeStep = steps[currentStepIndex];

  return (
    <section className="py-16 bg-[#08080A] border-t border-white/10 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF6B00]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-xs font-black uppercase tracking-wider text-[#FF8500]">
              <Layers className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Step-by-Step Interactive Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              HOW TO USE QUICK BITE
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              New to Quick Bite? See how transparent food matching, local kitchen discovery, and live doorstep dispatch work across Thiruvananthapuram.
            </p>
          </div>

          {/* Player Controls (Play/Pause, Step Next/Prev, Captions) */}
          <div className="flex items-center gap-2 bg-[#121215] p-1.5 rounded-2xl border border-white/10 self-start md:self-auto shadow-xl">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-xl transition-all ${
                isPlaying ? 'bg-[#FF6B00] text-black font-black' : 'bg-white/10 text-zinc-300 hover:text-white'
              }`}
              title={isPlaying ? 'Pause Auto-tour' : 'Resume Auto-tour'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => setCaptionsEnabled(!captionsEnabled)}
              className={`p-2.5 rounded-xl transition-all ${
                captionsEnabled ? 'bg-white/10 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Toggle Captions & Narration Notes"
            >
              {captionsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="h-5 w-px bg-white/10 mx-1" />

            <button
              onClick={() => setCurrentStepIndex(prev => (prev === 0 ? steps.length - 1 : prev - 1))}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold text-zinc-400 px-2">
              {currentStepIndex + 1}/{steps.length}
            </span>

            <button
              onClick={() => setCurrentStepIndex(prev => (prev + 1) % steps.length)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 transition-colors"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Selector Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer border ${
                currentStepIndex === idx
                  ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-lg shadow-orange-500/20 scale-105'
                  : 'bg-[#121215] text-zinc-400 hover:text-white border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              <span>{step.shortLabel}</span>
              {currentStepIndex === idx && (
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Interactive Showcase Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#121215] rounded-[36px] p-6 sm:p-10 border border-white/10 shadow-2xl relative">
          
          {/* Left Column: Step Details & Explanation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-md">
                {activeStep.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF8500]">
                  {activeStep.tagline}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeStep.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {activeStep.description}
            </p>

            {/* Highlights List */}
            <div className="space-y-2 pt-2">
              {activeStep.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold">{h}</span>
                </div>
              ))}
            </div>

            {/* Action CTA based on current step */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              {currentStepIndex === 0 && (
                <button
                  onClick={() => setActiveView('map')}
                  className="px-5 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore TVM District Map</span>
                </button>
              )}

              {currentStepIndex === 1 && (
                <button
                  onClick={() => {
                    const elem = document.getElementById('kitchens-section');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Store className="w-4 h-4" />
                  <span>Browse Partner Kitchens</span>
                </button>
              )}

              {currentStepIndex === 2 && (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Set Your Diet Rules</span>
                </button>
              )}

              {currentStepIndex === 3 && (
                <button
                  onClick={() => setIsMealBuilderOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Open Meal Builder Studio</span>
                </button>
              )}

              {currentStepIndex === 4 && (
                <button
                  onClick={() => setIsSurpriseModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try Surprise Me</span>
                </button>
              )}

              {(currentStepIndex === 5 || currentStepIndex === 6) && (
                <button
                  onClick={() => setActiveView('orders')}
                  className="px-5 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#FF8500] text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  <Bike className="w-4 h-4" />
                  <span>View Live Dispatch View</span>
                </button>
              )}

              <button
                onClick={() => setCurrentStepIndex(prev => (prev + 1) % steps.length)}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Simulated Canvas Card */}
          <div className="lg:col-span-6">
            <div
              className={`rounded-[28px] p-6 sm:p-8 bg-gradient-to-tr ${activeStep.visualPreview.bgGradient} border border-white/15 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-[#FF8500] border border-white/10">
                  {activeStep.visualPreview.badge}
                </span>

                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                  Quick Bite TVM Engine
                </span>
              </div>

              {/* Central Visual Focus */}
              <div className="bg-black/60 rounded-2xl p-5 border border-white/10 backdrop-blur-md space-y-3">
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeStep.visualPreview.headline}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {activeStep.visualPreview.subtext}
                </p>
              </div>

              {/* Metric Highlight Box */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.05] border border-white/10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    {activeStep.visualPreview.metricLabel}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-white">
                    {activeStep.visualPreview.metric}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FF6B00]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Step Progress Bar at Bottom of Card */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  <span>Interactive Walkthrough</span>
                  <span>Step {currentStepIndex + 1} of {steps.length}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF6B00] rounded-full transition-all duration-500"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
