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
    <div className="bg-white dark:bg-[#1f1f1f] border border-emerald-300 dark:border-[#254228] rounded-[12px] dark:rounded-[6px] p-4 text-[#1f2124] dark:text-[#f5f5f1] shadow-material dark:shadow-none space-y-3.5">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-[#a7f3d0]">
          <CheckCircle className="h-4 w-4 text-[#1e8e3e]" />
          <span className="text-xs font-mono uppercase tracking-wider font-bold">
            Nearest Potable Water Alternative
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-emerald-50 dark:bg-[#172319] text-emerald-800 dark:text-[#a7f3d0] border border-emerald-200 dark:border-[#254228] font-semibold">
          {safeAlternative.sourceType}
        </span>
      </div>

      {/* Target Water Point Info Box */}
      <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-sm text-[#1f2124] dark:text-[#f5f5f1]">{safeAlternative.name}</h4>
            <p className="text-xs text-[#5f6368] dark:text-[#a3a3a3] mt-0.5">{safeAlternative.community}, {safeAlternative.district}</p>
          </div>
          <span className="text-xs font-mono text-emerald-800 dark:text-[#a7f3d0] font-bold bg-emerald-100 dark:bg-[#172319] px-2 py-0.5 rounded-[3px] border border-emerald-200 dark:border-[#254228]">
            {safeAlternative.metrics.turbidityNtu} NTU
          </span>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#e0e2e6] dark:border-[#2a2a2a] text-center text-xs">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-[6px] dark:rounded-[4px] p-1.5 border border-[#e0e2e6] dark:border-[#2a2a2a]">
            <span className="text-[10px] text-[#5f6368] dark:text-[#a3a3a3] block uppercase font-mono font-medium">Distance</span>
            <span className="font-mono font-bold text-[#1f2124] dark:text-[#f5f5f1] mt-0.5 block">{distanceKm} km</span>
          </div>

          <div className="bg-white dark:bg-[#1f1f1f] rounded-[6px] dark:rounded-[4px] p-1.5 border border-[#e0e2e6] dark:border-[#2a2a2a]">
            <span className="text-[10px] text-[#5f6368] dark:text-[#a3a3a3] block uppercase font-mono font-medium">Walking Time</span>
            <span className="font-mono font-bold text-[#1f2124] dark:text-[#f5f5f1] mt-0.5 block">~{walkingMinutes} min</span>
          </div>

          <div className="bg-white dark:bg-[#1f1f1f] rounded-[6px] dark:rounded-[4px] p-1.5 border border-[#e0e2e6] dark:border-[#2a2a2a]">
            <span className="text-[10px] text-[#5f6368] dark:text-[#a3a3a3] block uppercase font-mono font-medium">Water Purity</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-[#a7f3d0] mt-0.5 block">100% Safe</span>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-[#5f6368] dark:text-[#a3a3a3]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1e8e3e] shrink-0" />
          <span>Verified clean by Ghana Water Company Ltd</span>
        </div>

        <button
          onClick={() => onSelectSafePoint(safeAlternative)}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full dark:rounded-[4px] text-xs font-semibold bg-[#1a73e8] hover:bg-[#1765cc] dark:bg-[#e50914] dark:hover:bg-[#b80710] text-white shadow-material dark:shadow-none transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <span>Select Safe Source</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
};
