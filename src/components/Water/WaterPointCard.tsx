'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Navigation,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
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
  const [copiedHash, setCopiedHash] = useState(false);
  const t = TRANSLATIONS[currentLanguage];
  const isToxic = waterPoint.currentStatus === 'critical_toxic';
  const isSafe = waterPoint.currentStatus === 'safe';

  // Synthetic cryptographic mock hash for quick demonstration
  const mockSha256 = `0x8f3b4c1298da5e149afbf4c8996fb92427ae41e4649b934ca495991b7852${waterPoint.id.slice(-4)}`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(mockSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm text-slate-900 dark:text-slate-100 transition-all">
      
      {/* Top Header / Hazard Status Strip */}
      <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 ${
        isToxic
          ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/40'
          : isSafe
          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40'
          : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
            {waterPoint.sourceType.toUpperCase()} • {waterPoint.riverBasin || 'LOCAL BASIN'}
          </span>
        </div>

        {/* Hazard Level Badge */}
        <div className="flex items-center gap-1.5">
          {isToxic ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/60 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400" />
              WHO Class 4: Critical Hazard
            </span>
          ) : isSafe ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              WHO Class 1: Potable
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
              Caution / Turbid
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5">
        
        {/* Title & Geospatial Coordinates */}
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            {waterPoint.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {waterPoint.community}, {waterPoint.district} ({waterPoint.region} Region)
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {waterPoint.coordinates.latitude.toFixed(4)}° N, {Math.abs(waterPoint.coordinates.longitude).toFixed(4)}° W
            </span>
          </div>
        </div>

        {/* Critical Contamination Warning Notice if Toxic */}
        {isToxic && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-lg p-3.5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-red-900 dark:text-red-200 uppercase tracking-wide">
                Severe Galamsey Silt & Chemical Danger Detected
              </p>
              <p className="text-xs text-red-800/90 dark:text-red-300/90 leading-relaxed">
                Turbidity exceeds WHO drinking safety limits by <strong className="text-red-950 dark:text-white font-bold">{Math.round(waterPoint.metrics.turbidityNtu / 5)}x</strong>. Heavy silt, mercury, and cyanide wash-water render this source unsafe for drinking, domestic cooking, or bathing.
              </p>
            </div>
          </div>
        )}

        {/* Narrative Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          {waterPoint.description}
        </p>

        {/* Precision Scientific Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* Metric 1: Turbidity Gauge */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
              Turbidity (NTU)
            </span>
            <span className={`text-xl font-bold font-mono tabular-nums block mt-0.5 ${
              waterPoint.metrics.turbidityNtu > 50 ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
            }`}>
              {waterPoint.metrics.turbidityNtu}
            </span>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${
                  waterPoint.metrics.turbidityNtu > 50 ? 'bg-red-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, (waterPoint.metrics.turbidityNtu / 1000) * 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-1 block">WHO Safe: &lt;5 NTU</span>
          </div>

          {/* Metric 2: pH Acidity Strip */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
              pH Acidity
            </span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 block mt-0.5">
              {waterPoint.metrics.phLevel}
            </span>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${
                  waterPoint.metrics.phLevel < 6.5 ? 'bg-amber-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${(waterPoint.metrics.phLevel / 14) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-1 block">Standard: 6.5–8.5</span>
          </div>

          {/* Metric 3: Upstream Mining Threat */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
              Mining Proximity
            </span>
            <span className={`text-xl font-bold font-mono tabular-nums block mt-0.5 ${
              waterPoint.upstreamMiningDistanceKm < 1.0 ? 'text-amber-800 dark:text-amber-300' : 'text-slate-800 dark:text-slate-200'
            }`}>
              {waterPoint.upstreamMiningDistanceKm} km
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-2 block font-medium">
              {waterPoint.upstreamMiningDistanceKm < 1.0 ? '⚠️ Active Upstream' : 'Distal Basin'}
            </span>
          </div>

          {/* Metric 4: Chemical Residue Risk */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
              Chemical Residue
            </span>
            <span className={`text-sm font-bold block mt-1.5 ${
              waterPoint.metrics.chemicalRiskDetected ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
            }`}>
              {waterPoint.metrics.chemicalRiskDetected ? 'Hazard Detected' : 'Clear / Negligible'}
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-2 block font-mono">
              {waterPoint.metrics.visualColor.replace('_', ' ').toUpperCase()}
            </span>
          </div>

        </div>

        {/* Multi-Witness Cryptographic Attestation Block */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold">{waterPoint.verifiedByCount} Verified Co-Signatories</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                ({waterPoint.verificationBadge.replace(/_/g, ' ')})
              </span>
            </div>

            <button
              onClick={() => onOpenAuditTrail(waterPoint)}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{t.inspectAuditTrail}</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          {/* Cryptographic SHA-256 Hash Display */}
          <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-750 rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-400 dark:text-slate-500">SHA-256:</span>
              <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{mockSha256}</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Copy cryptographic audit hash"
            >
              {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          {isToxic && (
            <button
              onClick={() => onOpenPetition(waterPoint)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>{t.generatePetition} (Act 522)</span>
            </button>
          )}

          {isToxic && (
            <button
              onClick={() => onFindSafeAlternative(waterPoint)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="h-4 w-4" />
              <span>{t.findSafeWater}</span>
            </button>
          )}

          {isSafe && (
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Certified Potable Under Ghana Water Company Standards</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
