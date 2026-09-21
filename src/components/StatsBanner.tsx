'use client';

import React from 'react';
import { AlertCircle, CheckCircle, ShieldCheck, Scale, Activity, ArrowUpRight } from 'lucide-react';
import { WaterPoint, SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';
import { RadialArcGauge } from '@/components/UI/RadialArcGauge';
import { BarcodeSignalMeter } from '@/components/UI/BarcodeSignalMeter';

interface StatsBannerProps {
  waterPoints: WaterPoint[];
  currentLanguage: SupportedLanguage;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ waterPoints, currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const criticalPoints = waterPoints.filter(p => p.currentStatus === 'critical_toxic');
  const safePoints = waterPoints.filter(p => p.currentStatus === 'safe');
  const cautionPoints = waterPoints.filter(p => p.currentStatus === 'caution_turbid');
  const totalWitnesses = waterPoints.reduce((acc, p) => acc + p.verifiedByCount, 0);

  const potabilityPercentage = waterPoints.length > 0
    ? Math.round((safePoints.length / waterPoints.length) * 100)
    : 0;

  const avgCriticalTurbidity = criticalPoints.length > 0
    ? Math.round(criticalPoints.reduce((acc, p) => acc + p.metrics.turbidityNtu, 0) / criticalPoints.length)
    : 0;

  return (
    <section className="bg-[#f8f9fa] dark:bg-[#141414] border-b border-[#e0e2e6] dark:border-[#2a2a2a] py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-150">
      <div className="max-w-7xl mx-auto">
        
        {/* Main 3-Column Telemetry Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
          
          {/* Card 1 (4 cols): National Basin Potability Pulse with Radial Arc Gauge */}
          <div className="md:col-span-4 bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-4 shadow-material dark:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-[#e0e2e6] dark:border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#1e8e3e] dark:bg-[#e50914] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1f2124] dark:text-[#f5f5f1] dark:font-display dark:text-base dark:tracking-wide">
                  National Water Security Pulse
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full dark:rounded-[3px] bg-[#f1f3f4] dark:bg-[#181818] text-[#5f6368] dark:text-[#a3a3a3] border border-[#e0e2e6] dark:border-[#2a2a2a]">
                WHO Index
              </span>
            </div>

            <div className="py-2 flex items-center justify-center">
              <RadialArcGauge
                percentage={potabilityPercentage}
                label="Potability Rate"
                sublabel={`${safePoints.length} of ${waterPoints.length} sources safe for consumption`}
                size={170}
                variant="dynamic"
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#e0e2e6] dark:border-[#2a2a2a] text-center">
              <div className="p-1.5 rounded-[8px] dark:rounded-[4px] bg-emerald-50 dark:bg-[#172319] border border-emerald-200 dark:border-[#254228]">
                <span className="text-[9px] uppercase font-mono text-emerald-800 dark:text-[#a7f3d0] block font-medium">Safe</span>
                <span className="font-mono font-bold text-xs text-emerald-700 dark:text-[#a7f3d0]">{safePoints.length}</span>
              </div>
              <div className="p-1.5 rounded-[8px] dark:rounded-[4px] bg-amber-50 dark:bg-[#282119] border border-amber-200 dark:border-[#523215]">
                <span className="text-[9px] uppercase font-mono text-amber-800 dark:text-[#fde68a] block font-medium">Caution</span>
                <span className="font-mono font-bold text-xs text-amber-700 dark:text-[#fde68a]">{cautionPoints.length}</span>
              </div>
              <div className="p-1.5 rounded-[8px] dark:rounded-[4px] bg-red-50 dark:bg-[#2e1517] border border-red-200 dark:border-[#541e22]">
                <span className="text-[9px] uppercase font-mono text-red-800 dark:text-[#fca5a5] block font-medium">Toxic</span>
                <span className="font-mono font-bold text-xs text-red-700 dark:text-[#fca5a5]">{criticalPoints.length}</span>
              </div>
            </div>
          </div>

          {/* Card 2 (4 cols): Silt & Turbidity Equalizer Spectrum */}
          <div className="md:col-span-4 bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-4 shadow-material dark:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-[#e0e2e6] dark:border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#f9ab00] dark:text-[#e50914]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1f2124] dark:text-[#f5f5f1] dark:font-display dark:text-base dark:tracking-wide">
                  Galamsey Silt Dispersion
                </span>
              </div>
              <span className="text-[10px] font-mono text-red-700 dark:text-[#fca5a5] font-bold bg-red-50 dark:bg-[#2e1517] px-2.5 py-0.5 rounded-full dark:rounded-[3px] border border-red-200 dark:border-[#541e22]">
                Avg {avgCriticalTurbidity} NTU
              </span>
            </div>

            {/* Visual Equalizer / Spectrum Bars for Monitored Stations */}
            <div className="my-auto py-2">
              <div className="flex items-end justify-between gap-1.5 h-16 px-1">
                {waterPoints.map((pt) => {
                  const isCritical = pt.currentStatus === 'critical_toxic';
                  const isSafe = pt.currentStatus === 'safe';
                  const heightPercent = Math.max(15, Math.min(100, (pt.metrics.turbidityNtu / 1200) * 100));

                  return (
                    <div
                      key={pt.id}
                      className="flex-1 flex flex-col items-center gap-1 group relative"
                    >
                      <div
                        className={`w-full rounded-t-[2px] transition-all duration-300 ${
                          isCritical
                            ? 'bg-[#d93025] dark:bg-[#e50914]'
                            : isSafe
                            ? 'bg-[#1e8e3e] dark:bg-[#1e8e3e]'
                            : 'bg-[#f9ab00] dark:bg-[#f9ab00]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[8px] font-mono text-[#5f6368] dark:text-[#a3a3a3] truncate w-full text-center">
                        {pt.name.slice(0, 3).toUpperCase()}
                      </span>

                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                        <div className="bg-[#1f2124] dark:bg-[#141414] border border-transparent dark:border-[#2a2a2a] text-white text-[10px] font-mono rounded-[4px] px-2 py-1 whitespace-nowrap shadow-material">
                          {pt.name}: {pt.metrics.turbidityNtu} NTU
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#5f6368] dark:text-[#a3a3a3] mt-2 px-1 pt-2 border-t border-[#e0e2e6] dark:border-[#2a2a2a]">
                <span>Safe Limit: &lt;5 NTU</span>
                <span className="text-red-700 dark:text-[#fca5a5] font-bold">Severe Silt: &gt;50 NTU</span>
              </div>
            </div>

            {/* Bottom Telemetry Mini-Pill */}
            <div className="flex items-center justify-between p-2 rounded-[8px] dark:rounded-[4px] bg-[#f8f9fa] dark:bg-[#181818] border border-[#e0e2e6] dark:border-[#2a2a2a] text-xs">
              <span className="text-[#5f6368] dark:text-[#a3a3a3] text-[11px]">Primary Basin Silt:</span>
              <span className="font-mono font-bold text-[#1f2124] dark:text-[#f5f5f1]">Pra & Offin Corridors</span>
            </div>
          </div>

          {/* Card 3 (4 cols): Decentralized Consensus & Statutory Enforcement */}
          <div className="md:col-span-4 bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-4 shadow-material dark:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-[#e0e2e6] dark:border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1a73e8] dark:text-[#e50914]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1f2124] dark:text-[#f5f5f1] dark:font-display dark:text-base dark:tracking-wide">
                  Civic Consensus & Legal Power
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#1a73e8] dark:text-[#f5f5f1] bg-[#e8f0fe] dark:bg-[#181818] px-2.5 py-0.5 rounded-full dark:rounded-[3px] border border-[#d2e3fc] dark:border-[#2a2a2a]">
                Act 522 / 995
              </span>
            </div>

            <div className="my-auto space-y-2.5 py-1">
              {/* Co-Signatories Metric */}
              <div className="flex items-center justify-between p-2.5 rounded-[8px] dark:rounded-[4px] bg-[#f8f9fa] dark:bg-[#181818] border border-[#e0e2e6] dark:border-[#2a2a2a]">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-[6px] dark:rounded-[4px] bg-[#e8f0fe] dark:bg-[#2a2a2a] text-[#1a73e8] dark:text-[#f5f5f1] flex items-center justify-center font-bold text-xs">
                    {totalWitnesses}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1f2124] dark:text-[#f5f5f1] block">Verified Co-Signatories</span>
                    <span className="text-[10px] text-[#5f6368] dark:text-[#a3a3a3]">Decentralized Community Monitored</span>
                  </div>
                </div>
                <BarcodeSignalMeter score={totalWitnesses} maxScore={25} status="safe" height={16} />
              </div>

              {/* Ready Petitions Metric */}
              <div className="flex items-center justify-between p-2.5 rounded-[8px] dark:rounded-[4px] bg-[#f8f9fa] dark:bg-[#181818] border border-[#e0e2e6] dark:border-[#2a2a2a]">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-[6px] dark:rounded-[4px] bg-amber-100 dark:bg-[#282119] text-amber-800 dark:text-amber-400 flex items-center justify-center">
                    <Scale className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1f2124] dark:text-[#f5f5f1] block">{criticalPoints.length} Statutory Petitions Ready</span>
                    <span className="text-[10px] text-[#5f6368] dark:text-[#a3a3a3]">District Chief Executive Injunctions</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-[4px] bg-amber-50 dark:bg-[#282119] border border-amber-200 dark:border-[#523215]">
                  Ready
                </span>
              </div>
            </div>

            {/* Cryptographic Ledger Verification Stamp */}
            <div className="flex items-center justify-between pt-2 border-t border-[#e0e2e6] dark:border-[#2a2a2a] text-[10px] font-mono text-[#5f6368] dark:text-[#a3a3a3]">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e] dark:bg-[#e50914]" />
                Immutable SHA-256 Ledger
              </span>
              <span className="text-[#1f2124] dark:text-[#f5f5f1] font-semibold">100% Tamper-Proof</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

