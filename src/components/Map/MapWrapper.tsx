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
      <div className="w-full h-full min-h-[420px] rounded-[12px] dark:rounded-[6px] bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] flex flex-col items-center justify-center text-[#5f6368] dark:text-[#a3a3a3] p-6">
        <div className="h-10 w-10 rounded-[8px] dark:rounded-[4px] bg-[#e8f0fe] dark:bg-[#1f1f1f] flex items-center justify-center mb-3">
          <svg className="animate-spin h-5 w-5 text-[#1a73e8] dark:text-[#e50914]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-xs font-semibold text-[#1f2124] dark:text-[#f5f5f1]">Loading Geospatial Water Map...</p>
        <p className="text-[11px] text-[#5f6368] dark:text-[#a3a3a3] mt-1">Initializing Offin, Birim & Ankobra River Basins</p>
      </div>
    ),
  }
);

export const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  return <DynamicWaterMap {...props} />;
};
