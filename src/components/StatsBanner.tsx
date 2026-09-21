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
    <section className="bg-[#0B0F17]/80 border-b border-white/[0.06] py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0 lg:divide-x lg:divide-white/[0.08] bg-white/[0.02] border border-white/[0.06] rounded-xl p-2 lg:p-0">
          
          {/* Metric 1: Critical Toxic Zones */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {criticalPoints.length}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-red-400 font-semibold px-1.5 py-0.2 rounded bg-red-500/10 border border-red-500/20">
                  Critical Hazard
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Avg. Turbidity: <span className="text-red-300 font-mono font-medium">{avgCriticalTurbidity} NTU</span>
              </p>
            </div>
          </div>

          {/* Metric 2: Verified Potable Alternatives */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {safePoints.length}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Potable
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Boreholes & Protected Springs
              </p>
            </div>
          </div>

          {/* Metric 3: Multi-Witness Attestations */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {totalWitnesses}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20">
                  Consensus
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Decentralized Co-Signatories
              </p>
            </div>
          </div>

          {/* Metric 4: Statutory Redress Filings */}
          <div className="p-3 lg:px-6 lg:py-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Scale className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  Act 522
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                  Enforceable
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory Redress Instruments
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
