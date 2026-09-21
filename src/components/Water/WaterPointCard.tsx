'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Droplet,
  ShieldCheck,
  FileText,
  Navigation,
  MapPin,
  ExternalLink,
  Flame,
  Calendar,
  Layers
} from 'lucide-react';
import { WaterPoint, SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';

interface WaterPointCardProps {
  waterPoint: WaterPoint;
  onOpenPetition: (point: WaterPoint) => void;
  onOpenAuditTrail: (point: WaterPoint) => void;
  onFindSafeAlternative: (point: WaterPoint) => void;
  currentLanguage: SupportedLanguage;
}

export const WaterPointCard: React.FC<WaterPointCardProps> = ({
  waterPoint,
  onOpenPetition,
  onOpenAuditTrail,
  onFindSafeAlternative,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isToxic = waterPoint.currentStatus === 'critical_toxic';
  const isSafe = waterPoint.currentStatus === 'safe';

  return (
    <div className={`rounded-2xl border transition-all shadow-xl p-5 text-white ${
      isToxic
        ? 'bg-slate-900/95 border-red-500/50 shadow-red-950/20'
        : isSafe
        ? 'bg-slate-900/95 border-emerald-500/40 shadow-emerald-950/20'
        : 'bg-slate-900/95 border-amber-500/40 shadow-amber-950/20'
    }`}>
      {/* Top Header: Badge & Status */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {waterPoint.sourceType.toUpperCase()} • {waterPoint.riverBasin || waterPoint.district}
          </span>
          <h3 className="text-xl font-black tracking-tight text-white mt-1">
            {waterPoint.name}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {waterPoint.community}, {waterPoint.district} ({waterPoint.region} Region)
          </p>
        </div>

        {/* Status Indicator Pill */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
          isToxic
            ? 'bg-red-500 text-white pulse-toxic'
            : isSafe
            ? 'bg-emerald-500 text-white pulse-safe'
            : 'bg-amber-500 text-slate-950'
        }`}>
          {isToxic ? (
            <>
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{t.statusToxic}</span>
            </>
          ) : isSafe ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t.statusSafe}</span>
            </>
          ) : (
            <>
              <Droplet className="h-3.5 w-3.5" />
              <span>{t.statusCaution}</span>
            </>
          )}
        </div>
      </div>

      {/* Critical Galamsey Alert Box if Toxic */}
      {isToxic && (
        <div className="bg-red-950/50 border border-red-700/60 rounded-xl p-3 mb-4">
          <div className="flex items-start gap-2.5">
            <Flame className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wide text-red-300">
                {t.criticalAlertTitle}
              </h4>
              <p className="text-xs text-red-100/90 mt-0.5 leading-relaxed">
                {t.criticalAlertText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
        {waterPoint.description}
      </p>

      {/* Water Quality Chemical & Optical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {/* Turbidity Metric */}
        <div className={`rounded-xl p-2.5 border ${
          waterPoint.metrics.turbidityNtu > 50
            ? 'bg-red-950/40 border-red-900/50 text-red-300'
            : 'bg-emerald-950/40 border-emerald-900/50 text-emerald-300'
        }`}>
          <span className="text-[10px] text-slate-400 block font-medium">Turbidity (NTU)</span>
          <span className="text-lg font-black tracking-tight">{waterPoint.metrics.turbidityNtu}</span>
          <span className="text-[9px] block text-slate-400">Safe: &lt;5 NTU</span>
        </div>

        {/* pH Balance */}
        <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
          <span className="text-[10px] text-slate-400 block font-medium">pH Acidity</span>
          <span className="text-lg font-black tracking-tight text-slate-100">{waterPoint.metrics.phLevel}</span>
          <span className="text-[9px] block text-slate-400">Safe: 6.5 - 8.5</span>
        </div>

        {/* Upstream Mining Proximity */}
        <div className={`rounded-xl p-2.5 border ${
          waterPoint.upstreamMiningDistanceKm < 1.0
            ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
        }`}>
          <span className="text-[10px] text-slate-400 block font-medium">Mining Proximity</span>
          <span className="text-lg font-black tracking-tight">{waterPoint.upstreamMiningDistanceKm} km</span>
          <span className="text-[9px] block text-slate-400">Upstream</span>
        </div>

        {/* Visual Color */}
        <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50">
          <span className="text-[10px] text-slate-400 block font-medium">Visual Clarity</span>
          <span className="text-sm font-extrabold capitalize text-slate-200 mt-1 block">
            {waterPoint.metrics.visualColor.replace('_', ' ')}
          </span>
          <span className="text-[9px] block text-slate-400">
            {waterPoint.metrics.chemicalRiskDetected ? '⚠️ Chemical Residue' : 'Normal'}
          </span>
        </div>
      </div>

      {/* Trust & Attestation Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-300">
            <strong className="text-white">{waterPoint.verifiedByCount} Verified Witnesses</strong> ({waterPoint.verificationBadge.replace(/_/g, ' ')})
          </span>
        </div>

        <button
          onClick={() => onOpenAuditTrail(waterPoint)}
          className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>{t.inspectAuditTrail}</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        {isToxic && (
          <button
            onClick={() => onFindSafeAlternative(waterPoint)}
            className="flex-1 min-w-[180px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
          >
            <Navigation className="h-4 w-4" />
            <span>{t.findSafeWater}</span>
          </button>
        )}

        {isToxic && (
          <button
            onClick={() => onOpenPetition(waterPoint)}
            className="flex-1 min-w-[180px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-950/40 transition-all active:scale-95"
          >
            <FileText className="h-4 w-4" />
            <span>{t.generatePetition}</span>
          </button>
        )}
      </div>
    </div>
  );
};
