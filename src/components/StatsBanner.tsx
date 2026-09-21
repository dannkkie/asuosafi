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
    <section className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-200 bg-slate-50/60 border border-slate-200 rounded-xl p-2 lg:p-0">
          
          {/* Metric 1: Critical Toxic Zones */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-red-50 border border-red-200/80 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {criticalPoints.length}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-red-800 font-semibold px-1.5 py-0.2 rounded bg-red-100/70 border border-red-200">
                  Critical Hazard
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Avg. Turbidity: <span className="text-red-700 font-mono font-semibold">{avgCriticalTurbidity} NTU</span>
              </p>
            </div>
          </div>

          {/* Metric 2: Verified Potable Alternatives */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {safePoints.length}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-800 font-semibold px-1.5 py-0.2 rounded bg-emerald-100/70 border border-emerald-200">
                  Potable
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Boreholes & Protected Springs
              </p>
            </div>
          </div>

          {/* Metric 3: Multi-Witness Attestations */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {totalWitnesses}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-sky-800 font-semibold px-1.5 py-0.2 rounded bg-sky-100/70 border border-sky-200">
                  Consensus
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Decentralized Co-Signatories
              </p>
            </div>
          </div>

          {/* Metric 4: Statutory Redress Filings */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
              <Scale className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  Act 522
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 font-semibold px-1.5 py-0.2 rounded bg-amber-100/70 border border-amber-200">
                  Enforceable
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory Redress Instruments
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
