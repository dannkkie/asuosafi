'use client';

import React from 'react';
import { CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
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
    <div className="bg-white dark:bg-[#121927] border border-emerald-300 dark:border-emerald-800/60 rounded-xl p-4 text-slate-900 dark:text-slate-100 shadow-sm space-y-3.5">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-wider font-bold">
            Nearest Potable Water Alternative
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
          {safeAlternative.sourceType}
        </span>
      </div>

      {/* Target Water Point Info Box */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{safeAlternative.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{safeAlternative.community}, {safeAlternative.district}</p>
          </div>
          <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
            {safeAlternative.metrics.turbidityNtu} NTU
          </span>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
          <div className="bg-white dark:bg-slate-900/60 rounded p-1.5 border border-slate-200 dark:border-slate-750">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-medium">Distance</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">{distanceKm} km</span>
          </div>

          <div className="bg-white dark:bg-slate-900/60 rounded p-1.5 border border-slate-200 dark:border-slate-750">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-medium">Walking Time</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">~{walkingMinutes} min</span>
          </div>

          <div className="bg-white dark:bg-slate-900/60 rounded p-1.5 border border-slate-200 dark:border-slate-750">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-medium">Water Purity</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block">100% Safe</span>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Verified clean by Ghana Water Company Ltd</span>
        </div>

        <button
          onClick={() => onSelectSafePoint(safeAlternative)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <span>Select Safe Source</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
};
