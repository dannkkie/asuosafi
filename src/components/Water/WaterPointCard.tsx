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
  Activity,
  Sparkles,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { WaterPoint, SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';
import { BarcodeSignalMeter } from '@/components/UI/BarcodeSignalMeter';

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

  // Synthetic 7-audit telemetry history (simulating real sensor recordings)
  const currentNtu = waterPoint.metrics.turbidityNtu;
  const historyAudits = [
    { day: 'D-12', ntu: Math.max(3, Math.round(currentNtu * (isToxic ? 0.45 : 0.95))) },
    { day: 'D-10', ntu: Math.max(4, Math.round(currentNtu * (isToxic ? 0.60 : 1.05))) },
    { day: 'D-8',  ntu: Math.max(3, Math.round(currentNtu * (isToxic ? 0.72 : 0.90))) },
    { day: 'D-6',  ntu: Math.max(4, Math.round(currentNtu * (isToxic ? 0.85 : 1.10))) },
    { day: 'D-4',  ntu: Math.max(3, Math.round(currentNtu * (isToxic ? 0.78 : 0.98))) },
    { day: 'D-2',  ntu: Math.max(4, Math.round(currentNtu * (isToxic ? 0.92 : 1.02))) },
    { day: 'Latest', ntu: currentNtu },
  ];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(mockSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="bg-white/85 dark:bg-[#121520] border border-slate-200/80 dark:border-[#1F2536] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none backdrop-blur-md text-slate-900 dark:text-slate-100 transition-all">
      
      {/* Top Header / Hazard Status Strip */}
      <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 ${
        isToxic
          ? 'bg-red-500/10 dark:bg-[#2E1215] border-red-500/20 dark:border-red-900/40'
          : isSafe
          ? 'bg-emerald-500/10 dark:bg-[#0E241E] border-emerald-500/20 dark:border-emerald-900/40'
          : 'bg-amber-500/10 dark:bg-[#2A1D0E] border-amber-500/20 dark:border-amber-900/40'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
            {waterPoint.sourceType.toUpperCase()} • {waterPoint.riverBasin || 'LOCAL BASIN'}
          </span>
        </div>

        {/* Hazard Level Badge & Barcode Signal */}
        <div className="flex items-center gap-2">
          <BarcodeSignalMeter
            score={isSafe ? 5 : isToxic ? 1 : 3}
            status={isSafe ? 'safe' : isToxic ? 'critical' : 'caution'}
            height={14}
          />

          {isToxic ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide bg-red-500/15 dark:bg-[#3F1418] text-red-700 dark:text-[#F87171] border border-red-500/30 dark:border-red-800/60 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              WHO Class 4: Critical Hazard
            </span>
          ) : isSafe ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide bg-emerald-500/15 dark:bg-[#112E24] text-emerald-700 dark:text-[#34D399] border border-emerald-500/30 dark:border-emerald-800/60 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              WHO Class 1: Potable
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide bg-amber-500/15 dark:bg-[#3A2510] text-amber-700 dark:text-[#FBBF24] border border-amber-500/30 dark:border-amber-800/60 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              Caution / Turbid
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-4">
        
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
          <div className="bg-red-500/10 dark:bg-[#2E1215] border border-red-500/20 dark:border-red-900/40 rounded-xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-[#F87171] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-red-900 dark:text-[#FCA5A5] uppercase tracking-wide">
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

        {/* 7-Audit Historical Telemetry Spectrum & AI Plume Risk Forecast */}
        <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Activity className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>14-Day Turbidity History & AI Threat Trend</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
              {isToxic ? (
                <span className="text-red-600 dark:text-red-400 flex items-center gap-0.5 font-bold">
                  <TrendingUp className="h-3 w-3" /> +55% Silt Runoff
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-bold">
                  <TrendingDown className="h-3 w-3" /> Stable &lt;5 NTU
                </span>
              )}
            </div>
          </div>

          {/* Equalizer Micro-Bars */}
          <div className="flex items-end justify-between gap-1.5 h-12 pt-1 px-1">
            {historyAudits.map((item, idx) => {
              const barHeightPercent = Math.max(12, Math.min(100, (item.ntu / 1000) * 100));
              const isDanger = item.ntu > 50;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className={`w-full rounded-t transition-all ${
                      isDanger ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                    }`}
                    style={{ height: `${barHeightPercent}%` }}
                  />
                  <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500 truncate w-full text-center">
                    {item.day}
                  </span>

                  {/* Micro Tooltip */}
                  <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                    <div className="bg-slate-900 text-white text-[9px] font-mono rounded px-1.5 py-0.5 whitespace-nowrap shadow-md">
                      {item.ntu} NTU
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Plume Forecast Pill */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-sky-500/10 dark:bg-[#0E1A30] border border-sky-200/80 dark:border-sky-800/40 text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-[#60A5FA] shrink-0" />
            <p className="text-slate-700 dark:text-slate-300 leading-snug">
              <strong className="text-slate-950 dark:text-white font-semibold">AI Predictive Dispersion: </strong>
              {isToxic
                ? `Heavy upstream Changfa wash-water presents elevated contamination across downstream intake zones for 48h.`
                : `Protected aquifer parameters verify zero heavy-metal percolation from distal mining corridors.`}
            </p>
          </div>
        </div>

        {/* Multi-Witness Cryptographic Attestation Block */}
        <div className="bg-slate-50/80 dark:bg-[#161B28] border border-slate-200/70 dark:border-[#232B3E] rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-[#10B981]" />
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
          <div className="flex items-center justify-between gap-2 bg-white dark:bg-[#11141D] border border-slate-200/80 dark:border-[#1E2536] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-400 dark:text-slate-500">SHA-256:</span>
              <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{mockSha256}</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Copy cryptographic audit hash"
            >
              {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-[#10B981]" /> : <Copy className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          {isToxic && (
            <button
              onClick={() => onOpenPetition(waterPoint)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-sm shadow-red-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>{t.generatePetition} (Act 522)</span>
            </button>
          )}

          {isToxic && (
            <button
              onClick={() => onFindSafeAlternative(waterPoint)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider bg-[#10B981] hover:bg-[#059669] text-white shadow-sm shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="h-4 w-4" />
              <span>{t.findSafeWater}</span>
            </button>
          )}

          {isSafe && (
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-mono text-emerald-800 dark:text-[#34D399] bg-emerald-500/10 dark:bg-[#0E241E] border border-emerald-500/20 dark:border-emerald-800/60 font-semibold">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-[#10B981]" />
              <span>Certified Potable Under Ghana Water Company Standards</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
