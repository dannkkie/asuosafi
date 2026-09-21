'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { WaterPoint } from '@/types';
import { SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';

interface StatsBannerProps {
  waterPoints: WaterPoint[];
  currentLanguage: SupportedLanguage;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ waterPoints, currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const totalPoints = waterPoints.length;
  const criticalPoints = waterPoints.filter(p => p.currentStatus === 'critical_toxic').length;
  const safePoints = waterPoints.filter(p => p.currentStatus === 'safe').length;
  const totalWitnesses = waterPoints.reduce((acc, p) => acc + p.verifiedByCount, 0);

  return (
    <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-center">
        {/* Critical Toxic Alert Stat */}
        <div className="flex items-center gap-3 bg-red-950/40 border border-red-900/50 rounded-xl p-2.5 sm:p-3">
          <div className="h-9 w-9 rounded-lg bg-red-900/50 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="text-left">
            <p className="text-lg font-bold text-red-300 leading-tight">{criticalPoints}</p>
            <p className="text-[11px] font-medium text-red-200/80 leading-snug">
              {t.statusToxic}
            </p>
          </div>
        </div>

        {/* Verified Safe Alternatives Stat */}
        <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-2.5 sm:p-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-900/50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-lg font-bold text-emerald-300 leading-tight">{safePoints}</p>
            <p className="text-[11px] font-medium text-emerald-200/80 leading-snug">
              {t.statusSafe}
            </p>
          </div>
        </div>

        {/* Community Attestation & Trust Stat */}
        <div className="flex items-center gap-3 bg-cyan-950/40 border border-cyan-900/50 rounded-xl p-2.5 sm:p-3">
          <div className="h-9 w-9 rounded-lg bg-cyan-900/50 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="text-left">
            <p className="text-lg font-bold text-cyan-300 leading-tight">{totalWitnesses}</p>
            <p className="text-[11px] font-medium text-cyan-200/80 leading-snug">
              Witness Attestations
            </p>
          </div>
        </div>

        {/* Legal Environmental Petitions Stat */}
        <div className="flex items-center gap-3 bg-amber-950/40 border border-amber-900/50 rounded-xl p-2.5 sm:p-3">
          <div className="h-9 w-9 rounded-lg bg-amber-900/50 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-left">
            <p className="text-lg font-bold text-amber-300 leading-tight">Act 522 & 995</p>
            <p className="text-[11px] font-medium text-amber-200/80 leading-snug">
              Statutory Petitions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
