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
    <section className="bg-white/60 dark:bg-[#0B0F17]/60 border-b border-slate-200/80 dark:border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-150 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        
        {/* Main 3-Column Telemetry Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
          
          {/* Card 1 (4 cols): National Basin Potability Pulse with Radial Arc Gauge */}
          <div className="md:col-span-4 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-800 dark:text-slate-200">
                  National Water Security Pulse
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                WHO Class Index
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

            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
              <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[9px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-medium">Safe</span>
                <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">{safePoints.length}</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[9px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-medium">Caution</span>
                <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-400">{cautionPoints.length}</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[9px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-medium">Toxic</span>
                <span className="font-mono font-bold text-xs text-red-700 dark:text-red-400">{criticalPoints.length}</span>
              </div>
            </div>
          </div>

          {/* Card 2 (4 cols): Silt & Turbidity Equalizer Spectrum */}
          <div className="md:col-span-4 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-800 dark:text-slate-200">
                  Galamsey Silt Dispersion
                </span>
              </div>
              <span className="text-[10px] font-mono text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/60">
                Avg {avgCriticalTurbidity} NTU
              </span>
            </div>

            {/* Visual Equalizer / Spectrum Bars for Monitored Stations */}
            <div className="my-auto py-2">
              <div className="flex items-end justify-between gap-1.5 h-16 px-1">
                {waterPoints.map((pt, idx) => {
                  const isCritical = pt.currentStatus === 'critical_toxic';
                  const isSafe = pt.currentStatus === 'safe';
                  const heightPercent = Math.max(15, Math.min(100, (pt.metrics.turbidityNtu / 1200) * 100));

                  return (
                    <div
                      key={pt.id}
                      className="flex-1 flex flex-col items-center gap-1 group relative"
                    >
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isCritical
                            ? 'bg-red-600 dark:bg-red-500'
                            : isSafe
                            ? 'bg-emerald-600 dark:bg-emerald-500'
                            : 'bg-amber-500 dark:bg-amber-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[8px] font-mono text-slate-400 truncate w-full text-center">
                        {pt.name.slice(0, 3).toUpperCase()}
                      </span>

                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                        <div className="bg-slate-900 text-white text-[10px] font-mono rounded px-2 py-1 whitespace-nowrap shadow-lg">
                          {pt.name}: {pt.metrics.turbidityNtu} NTU
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2 px-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span>Safe Limit: &lt;5 NTU</span>
                <span className="text-red-700 dark:text-red-400 font-bold">Severe Silt: &gt;50 NTU</span>
              </div>
            </div>

            {/* Bottom Telemetry Mini-Pill */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">Primary Basin Silt:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">Pra & Offin Corridors</span>
            </div>
          </div>

          {/* Card 3 (4 cols): Decentralized Consensus & Statutory Enforcement */}
          <div className="md:col-span-4 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-800 dark:text-slate-200">
                  Civic Consensus & Legal Power
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Act 522 / 995
              </span>
            </div>

            <div className="my-auto space-y-2.5 py-1">
              {/* Co-Signatories Metric */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs">
                    {totalWitnesses}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Verified Co-Signatories</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Decentralized Community Monitored</span>
                  </div>
                </div>
                <BarcodeSignalMeter score={totalWitnesses} maxScore={25} status="safe" height={16} />
              </div>

              {/* Ready Petitions Metric */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                    <Scale className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{criticalPoints.length} Statutory Petitions Ready</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">District Chief Executive Injunctions</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60">
                  Ready
                </span>
              </div>
            </div>

            {/* Cryptographic Ledger Verification Stamp */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                Immutable SHA-256 Ledger
              </span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">100% Tamper-Proof</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

