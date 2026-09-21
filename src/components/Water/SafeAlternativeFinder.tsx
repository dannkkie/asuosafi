'use client';

import React from 'react';
import { Navigation, CheckCircle2, Droplet, Clock, ShieldCheck } from 'lucide-react';
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
    <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 text-white shadow-xl">
      <div className="flex items-center gap-2 text-emerald-400 mb-2">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span className="font-bold text-sm tracking-wide uppercase">
          {t.nearestSafeDistance}
        </span>
      </div>

      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-3 mb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-bold text-base text-emerald-100">{safeAlternative.name}</h4>
            <p className="text-xs text-slate-300">{safeAlternative.community}, {safeAlternative.district}</p>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
            {safeAlternative.sourceType}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800 text-center">
          <div className="bg-slate-800/60 rounded-lg p-1.5">
            <span className="text-[10px] text-slate-400 block">Distance</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-0.5">
              <Navigation className="h-3 w-3" />
              {distanceKm} km
            </span>
          </div>

          <div className="bg-slate-800/60 rounded-lg p-1.5">
            <span className="text-[10px] text-slate-400 block">Walking Time</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-0.5">
              <Clock className="h-3 w-3" />
              ~{walkingMinutes} min
            </span>
          </div>

          <div className="bg-slate-800/60 rounded-lg p-1.5">
            <span className="text-[10px] text-slate-400 block">Purity</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-0.5">
              <Droplet className="h-3 w-3" />
              {safeAlternative.metrics.turbidityNtu} NTU
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] leading-tight">
            Verified Clean by Ghana Water Co. & Local Water Board
          </span>
        </div>

        <button
          onClick={() => onSelectSafePoint(safeAlternative)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all active:scale-95 shrink-0"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>Switch to Safe Water</span>
        </button>
      </div>
    </div>
  );
};
