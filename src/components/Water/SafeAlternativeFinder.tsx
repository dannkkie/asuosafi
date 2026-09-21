'use client';

import React from 'react';
import { Navigation, CheckCircle, Clock, Droplets, ShieldCheck, ArrowRight } from 'lucide-react';
import { WaterPoint, SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';
import { calculateDistanceKm } from '@/utils/crypto';

interface SafeAlternativeFinderProps {
  currentWaterPoint: WaterPoint;
  safeAlternative: WaterPoint | null;
  onSelectSafePoint: (point: WaterPoint) => void;
  currentLanguage: SupportedLanguage;
}

export const SafeAlternativeFinder: React.FC<SafeAlternativeFinderProps> = ({
  currentWaterPoint,
  safeAlternative,
  onSelectSafePoint,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  if (!safeAlternative) return null;

  const distanceKm = calculateDistanceKm(
    currentWaterPoint.coordinates.latitude,
    currentWaterPoint.coordinates.longitude,
    safeAlternative.coordinates.latitude,
    safeAlternative.coordinates.longitude
  );

  // Approximate walking time assuming 4 km/h walking speed
  const walkingMinutes = Math.max(5, Math.round((distanceKm / 4) * 60));

  return (
    <div className="bg-[#0E1524] border border-emerald-500/30 rounded-xl p-4 text-slate-100 shadow-xl space-y-3.5">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">
            Nearest Potable Water Alternative
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {safeAlternative.sourceType}
        </span>
      </div>

      {/* Target Water Point Info Box */}
      <div className="bg-[#141D2D] border border-white/[0.06] rounded-lg p-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-sm text-white">{safeAlternative.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{safeAlternative.community}, {safeAlternative.district}</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {safeAlternative.metrics.turbidityNtu} NTU
          </span>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/[0.06] text-center text-xs">
          <div className="bg-[#0B0F17] rounded p-1.5 border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Distance</span>
            <span className="font-mono font-bold text-slate-200 mt-0.5 block">{distanceKm} km</span>
          </div>

          <div className="bg-[#0B0F17] rounded p-1.5 border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Walking Time</span>
            <span className="font-mono font-bold text-slate-200 mt-0.5 block">~{walkingMinutes} min</span>
          </div>

          <div className="bg-[#0B0F17] rounded p-1.5 border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Water Purity</span>
            <span className="font-mono font-bold text-emerald-400 mt-0.5 block">100% Safe</span>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>Certified clean by Ghana Water Company Ltd</span>
        </div>

        <button
          onClick={() => onSelectSafePoint(safeAlternative)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <span>Select Safe Source</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
};
