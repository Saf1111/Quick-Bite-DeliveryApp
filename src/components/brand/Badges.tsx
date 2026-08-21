import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Flame, Info, Clock, Heart } from 'lucide-react';
import { MatchScoreResult } from '../../services/recommendation';

export const VegBadge: React.FC<{ isVeg: boolean; size?: 'sm' | 'md' }> = ({ isVeg, size = 'md' }) => {
  const dim = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const dotDim = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      className={`${dim} border ${
        isVeg ? 'border-emerald-400 bg-emerald-950/80' : 'border-rose-500 bg-rose-950/80'
      } rounded-[4px] p-[1.5px] flex items-center justify-center shadow-sm shrink-0`}
    >
      <div
        className={`${dotDim} rounded-full ${
          isVeg ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-rose-500 shadow-sm shadow-rose-500/50'
        }`}
      />
    </div>
  );
};

export const PartnerBadge: React.FC<{ isPartner: boolean; size?: 'sm' | 'md' }> = ({ isPartner, size = 'md' }) => {
  if (isPartner) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-black uppercase tracking-wider rounded-full bg-[#FF6B00]/20 text-[#FF8500] border border-[#FF6B00]/40 shadow-sm ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[11px]'
        }`}
      >
        <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-[#FF6B00]' : 'w-3.5 h-3.5 text-[#FF6B00]'} />
        <span>Quick Bite Partner</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full bg-white/10 text-zinc-300 border border-white/10 ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[11px]'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
      <span>Discovered Nearby</span>
    </span>
  );
};

export const SpiceLevelBadge: React.FC<{ level: 1 | 2 | 3 | 4 }> = ({ level }) => {
  const labels = ['Mild', 'Medium', 'Spicy', 'Extra Hot'];
  return (
    <div className="inline-flex items-center gap-0.5 text-xs text-[#FFA000] font-bold" title={`Spice: ${labels[level - 1]}`}>
      {Array.from({ length: level }).map((_, i) => (
        <Flame key={i} className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]" />
      ))}
    </div>
  );
};

export const MatchScoreBadge: React.FC<{
  score: number;
  result?: MatchScoreResult;
  size?: 'sm' | 'md' | 'lg';
}> = ({ score, result, size = 'md' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  if (score < 60) {
    badgeBg = 'bg-white/10 text-zinc-300 border-white/15';
  } else if (score < 80) {
    badgeBg = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  } else if (score >= 90) {
    badgeBg = 'bg-[#FF6B00]/25 text-[#FF8500] border-[#FF6B00]/50 shadow-md shadow-orange-500/20';
  }

  const scoreText = (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (result) setShowTooltip(!showTooltip);
      }}
      className={`relative inline-flex items-center gap-1 rounded-full font-black uppercase tracking-wider cursor-pointer transition-transform hover:scale-105 border ${badgeBg} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[9px]' : size === 'lg' ? 'px-3.5 py-1 text-xs' : 'px-3 py-0.5 text-[10px]'
      }`}
    >
      <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5 text-[#FF6B00]' : 'w-3 h-3 text-[#FF6B00]'} />
      <span>{score}% Match</span>
    </div>
  );

  return (
    <div className="relative inline-block">
      {scoreText}

      {showTooltip && result && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3.5 rounded-2xl bg-[#121215]/95 backdrop-blur-xl text-white text-xs shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10 font-black uppercase text-zinc-200 tracking-wider text-[11px]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              Match Breakdown
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-zinc-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 my-2.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400">Fitness Profile:</span>
              <span className="font-bold text-emerald-400">{result.breakdown.fitness}%</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400">High Protein:</span>
              <span className="font-bold text-emerald-400">{result.breakdown.highProtein}%</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400">Health Preference:</span>
              <span className="font-bold text-emerald-400">{result.breakdown.healthConscious}%</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400">Budget Fit:</span>
              <span className="font-bold text-emerald-400">{result.breakdown.budget}%</span>
            </div>
          </div>

          {result.reasons.length > 0 && (
            <div className="pt-2 border-t border-white/10 text-[10px] text-zinc-400">
              <p className="font-bold text-[#FF8500] uppercase tracking-wider mb-1">Match Highlights:</p>
              <ul className="list-disc pl-3.5 space-y-0.5">
                {result.reasons.slice(0, 2).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
