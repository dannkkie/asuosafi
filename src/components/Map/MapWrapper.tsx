'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { WaterPoint, MiningConcession } from '@/types';

interface MapWrapperProps {
  waterPoints: WaterPoint[];
  selectedWaterPoint: WaterPoint | null;
  onSelectWaterPoint: (point: WaterPoint) => void;
  concessions: MiningConcession[];
  showConcessions: boolean;
}

// Dynamically import Leaflet map with SSR disabled
const DynamicWaterMap = dynamic(
  () => import('./WaterMap').then((mod) => mod.WaterMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-6 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-3">
          <svg className="animate-spin h-5 w-5 text-emerald-600 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Loading Geospatial Water Map...</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">Initializing Offin, Birim & Ankobra River Basins</p>
      </div>
    ),
  }
);

export const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  return <DynamicWaterMap {...props} />;
};
