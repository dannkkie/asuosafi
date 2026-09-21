'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Users, Scale } from 'lucide-react';
import { WaterPoint, SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';

interface StatsBannerProps {
  waterPoints: WaterPoint[];
  currentLanguage: SupportedLanguage;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ waterPoints, currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const criticalPoints = waterPoints.filter(p => p.currentStatus === 'critical_toxic');
  const safePoints = waterPoints.filter(p => p.currentStatus === 'safe');
  const totalWitnesses = waterPoints.reduce((acc, p) => acc + p.verifiedByCount, 0);

  const avgCriticalTurbidity = criticalPoints.length > 0
    ? Math.round(criticalPoints.reduce((acc, p) => acc + p.metrics.turbidityNtu, 0) / criticalPoints.length)
    : 0;

  return (
    <section className="bg-white dark:bg-[#0B0F17] border-b border-slate-200/80 dark:border-slate-800 py-3.5 px-4 sm:px-6 lg:px-8 transition-colors duration-150">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-200 dark:lg:divide-slate-800 bg-slate-50/60 dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-2 lg:p-0">
          
          {/* Metric 1: Critical Toxic Zones */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/40 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-red-700 dark:text-red-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {criticalPoints.length}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-red-800 dark:text-red-300 font-semibold px-1.5 py-0.2 rounded bg-red-100/70 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60">
                  Critical Hazard
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Avg. Turbidity: <span className="text-red-700 dark:text-red-400 font-mono font-semibold">{avgCriticalTurbidity} NTU</span>
              </p>
            </div>
          </div>

          {/* Metric 2: Verified Potable Alternatives */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/40 flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {safePoints.length}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-800 dark:text-emerald-300 font-semibold px-1.5 py-0.2 rounded bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                  Potable
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Boreholes & Protected Springs
              </p>
            </div>
          </div>

          {/* Metric 3: Multi-Witness Attestations */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/40 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-sky-700 dark:text-sky-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {totalWitnesses}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-sky-800 dark:text-sky-300 font-semibold px-1.5 py-0.2 rounded bg-sky-100/70 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60">
                  Consensus
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Decentralized Co-Signatories
              </p>
            </div>
          </div>

          {/* Metric 4: Statutory Redress Filings */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-center shrink-0">
              <Scale className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  Act 522
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 dark:text-amber-300 font-semibold px-1.5 py-0.2 rounded bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60">
                  Enforceable
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Statutory Redress Instruments
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
