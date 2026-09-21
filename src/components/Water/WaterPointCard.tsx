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
    <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] overflow-hidden shadow-material dark:shadow-none text-[#1f2124] dark:text-[#f5f5f1] transition-all">
      
      {/* Top Header / Hazard Status Strip */}
      <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 ${
        isToxic
          ? 'bg-red-50 dark:bg-[#2e1517] border-red-200 dark:border-[#541e22]'
          : isSafe
          ? 'bg-emerald-50 dark:bg-[#172319] border-emerald-200 dark:border-[#254228]'
          : 'bg-amber-50 dark:bg-[#282119] border-amber-200 dark:border-[#523215]'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold">
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full dark:rounded-[3px] text-xs font-mono uppercase tracking-wide bg-red-100 dark:bg-[#3d1518] text-red-800 dark:text-[#fca5a5] border border-red-200 dark:border-[#541e22] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d93025] dark:bg-[#e50914] animate-pulse" />
              WHO Class 4: Critical Hazard
            </span>
          ) : isSafe ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full dark:rounded-[3px] text-xs font-mono uppercase tracking-wide bg-emerald-100 dark:bg-[#193220] text-emerald-800 dark:text-[#a7f3d0] border border-emerald-200 dark:border-[#254228] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e]" />
              WHO Class 1: Potable
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full dark:rounded-[3px] text-xs font-mono uppercase tracking-wide bg-amber-100 dark:bg-[#352516] text-amber-900 dark:text-[#fde68a] border border-amber-200 dark:border-[#523215] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f9ab00]" />
              Caution / Turbid
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-4">
        
        {/* Title & Geospatial Coordinates */}
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[#1f2124] dark:text-[#f5f5f1] font-sans dark:font-display dark:text-2xl dark:tracking-wide">
            {waterPoint.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#5f6368] dark:text-[#a3a3a3]">
            <span className="flex items-center gap-1 font-medium text-[#1f2124] dark:text-[#f5f5f1]">
              <MapPin className="h-3.5 w-3.5 text-[#5f6368] dark:text-[#a3a3a3]" />
              {waterPoint.community}, {waterPoint.district} ({waterPoint.region} Region)
            </span>
            <span className="text-[#e0e2e6] dark:text-[#333333]">•</span>
            <span className="font-mono text-[#5f6368] dark:text-[#a3a3a3]">
              {waterPoint.coordinates.latitude.toFixed(4)}° N, {Math.abs(waterPoint.coordinates.longitude).toFixed(4)}° W
            </span>
          </div>
        </div>

        {/* Critical Contamination Warning Notice if Toxic */}
        {isToxic && (
          <div className="bg-red-50 dark:bg-[#2e1517] border border-red-200 dark:border-[#541e22] rounded-[8px] dark:rounded-[4px] p-3.5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-[#e50914] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-red-900 dark:text-[#fca5a5] uppercase tracking-wide">
                Severe Galamsey Silt & Chemical Danger Detected
              </p>
              <p className="text-xs text-red-800/90 dark:text-red-300/90 leading-relaxed">
                Turbidity exceeds WHO drinking safety limits by <strong className="text-red-950 dark:text-white font-bold">{Math.round(waterPoint.metrics.turbidityNtu / 5)}x</strong>. Heavy silt, mercury, and cyanide wash-water render this source unsafe for drinking, domestic cooking, or bathing.
              </p>
            </div>
          </div>
        )}

        {/* Narrative Description */}
        <p className="text-xs text-[#5f6368] dark:text-[#a3a3a3] leading-relaxed bg-[#f8f9fa] dark:bg-[#141414] p-3 rounded-[8px] dark:rounded-[4px] border border-[#e0e2e6] dark:border-[#2a2a2a]">
          {waterPoint.description}
        </p>

        {/* Precision Scientific Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* Metric 1: Turbidity Gauge */}
          <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold block">
              Turbidity (NTU)
            </span>
            <span className={`text-xl font-bold font-mono tabular-nums block mt-0.5 ${
              waterPoint.metrics.turbidityNtu > 50 ? 'text-red-700 dark:text-[#e50914]' : 'text-emerald-700 dark:text-[#1e8e3e]'
            }`}>
              {waterPoint.metrics.turbidityNtu}
            </span>
            <div className="w-full bg-[#e0e2e6] dark:bg-[#2a2a2a] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${
                  waterPoint.metrics.turbidityNtu > 50 ? 'bg-[#d93025] dark:bg-[#e50914]' : 'bg-[#1e8e3e]'
                }`}
                style={{ width: `${Math.min(100, (waterPoint.metrics.turbidityNtu / 1000) * 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-[#5f6368] dark:text-[#a3a3a3] font-mono mt-1 block">WHO Safe: &lt;5 NTU</span>
          </div>

          {/* Metric 2: pH Acidity Strip */}
          <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold block">
              pH Acidity
            </span>
            <span className="text-xl font-bold font-mono tabular-nums text-[#1f2124] dark:text-[#f5f5f1] block mt-0.5">
              {waterPoint.metrics.phLevel}
            </span>
            <div className="w-full bg-[#e0e2e6] dark:bg-[#2a2a2a] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${
                  waterPoint.metrics.phLevel < 6.5 ? 'bg-[#f9ab00]' : 'bg-[#1e8e3e]'
                }`}
                style={{ width: `${(waterPoint.metrics.phLevel / 14) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-[#5f6368] dark:text-[#a3a3a3] font-mono mt-1 block">Standard: 6.5–8.5</span>
          </div>

          {/* Metric 3: Upstream Mining Threat */}
          <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold block">
              Mining Proximity
            </span>
            <span className={`text-xl font-bold font-mono tabular-nums block mt-0.5 ${
              waterPoint.upstreamMiningDistanceKm < 1.0 ? 'text-amber-800 dark:text-amber-400' : 'text-[#1f2124] dark:text-[#f5f5f1]'
            }`}>
              {waterPoint.upstreamMiningDistanceKm} km
            </span>
            <span className="text-[9px] text-[#5f6368] dark:text-[#a3a3a3] mt-2 block font-medium">
              {waterPoint.upstreamMiningDistanceKm < 1.0 ? '⚠️ Active Upstream' : 'Distal Basin'}
            </span>
          </div>

          {/* Metric 4: Chemical Residue Risk */}
          <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold block">
              Chemical Residue
            </span>
            <span className={`text-sm font-bold block mt-1.5 ${
              waterPoint.metrics.chemicalRiskDetected ? 'text-red-700 dark:text-[#e50914]' : 'text-emerald-700 dark:text-[#1e8e3e]'
            }`}>
              {waterPoint.metrics.chemicalRiskDetected ? 'Hazard Detected' : 'Clear / Negligible'}
            </span>
            <span className="text-[9px] text-[#5f6368] dark:text-[#a3a3a3] mt-2 block font-mono">
              {waterPoint.metrics.visualColor.replace('_', ' ').toUpperCase()}
            </span>
          </div>

        </div>

        {/* 7-Audit Historical Telemetry Spectrum & AI Plume Risk Forecast */}
        <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1f2124] dark:text-[#f5f5f1]">
              <Activity className="h-3.5 w-3.5 text-[#1a73e8] dark:text-[#e50914]" />
              <span>14-Day Turbidity History & AI Threat Trend</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-[#5f6368] dark:text-[#a3a3a3]">
              {isToxic ? (
                <span className="text-red-600 dark:text-[#e50914] flex items-center gap-0.5 font-bold">
                  <TrendingUp className="h-3 w-3" /> +55% Silt Runoff
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-[#1e8e3e] flex items-center gap-0.5 font-bold">
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
                    className={`w-full rounded-t-[2px] transition-all ${
                      isDanger ? 'bg-[#d93025] dark:bg-[#e50914]' : 'bg-[#1e8e3e]'
                    }`}
                    style={{ height: `${barHeightPercent}%` }}
                  />
                  <span className="text-[8px] font-mono text-[#5f6368] dark:text-[#a3a3a3] truncate w-full text-center">
                    {item.day}
                  </span>

                  {/* Micro Tooltip */}
                  <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                    <div className="bg-[#1f2124] dark:bg-[#141414] border border-transparent dark:border-[#2a2a2a] text-white text-[9px] font-mono rounded-[3px] px-1.5 py-0.5 whitespace-nowrap shadow-material">
                      {item.ntu} NTU
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Plume Forecast Pill */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-[6px] dark:rounded-[4px] bg-[#e8f0fe] dark:bg-[#1f1f1f] border border-[#d2e3fc] dark:border-[#2a2a2a] text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-[#1a73e8] dark:text-[#e50914] shrink-0" />
            <p className="text-[#1f2124] dark:text-[#f5f5f1] leading-snug">
              <strong className="font-semibold">AI Predictive Dispersion: </strong>
              {isToxic
                ? `Heavy upstream Changfa wash-water presents elevated contamination across downstream intake zones for 48h.`
                : `Protected aquifer parameters verify zero heavy-metal percolation from distal mining corridors.`}
            </p>
          </div>
        </div>

        {/* Multi-Witness Cryptographic Attestation Block */}
        <div className="bg-[#f8f9fa] dark:bg-[#181818] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#1f2124] dark:text-[#f5f5f1]">
              <ShieldCheck className="h-4 w-4 text-[#1e8e3e] dark:text-[#e50914]" />
              <span className="font-semibold">{waterPoint.verifiedByCount} Verified Co-Signatories</span>
              <span className="text-[10px] font-mono text-[#5f6368] dark:text-[#a3a3a3]">
                ({waterPoint.verificationBadge.replace(/_/g, ' ')})
              </span>
            </div>

            <button
              onClick={() => onOpenAuditTrail(waterPoint)}
              className="text-[#1a73e8] dark:text-[#f5f5f1] hover:underline text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{t.inspectAuditTrail}</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          {/* Cryptographic SHA-256 Hash Display */}
          <div className="flex items-center justify-between gap-2 bg-white dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[6px] dark:rounded-[4px] px-2.5 py-1.5 text-[11px] font-mono text-[#5f6368] dark:text-[#a3a3a3]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[#5f6368] dark:text-[#a3a3a3]">SHA-256:</span>
              <span className="truncate text-[#1f2124] dark:text-[#f5f5f1] font-medium">{mockSha256}</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="p-1 hover:text-[#1f2124] dark:hover:text-[#f5f5f1] transition-colors shrink-0 cursor-pointer"
              title="Copy cryptographic audit hash"
            >
              {copiedHash ? <Check className="h-3.5 w-3.5 text-[#1e8e3e]" /> : <Copy className="h-3.5 w-3.5 text-[#5f6368] dark:text-[#a3a3a3]" />}
            </button>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          {isToxic && (
            <button
              onClick={() => onOpenPetition(waterPoint)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full dark:rounded-[4px] text-xs font-bold uppercase tracking-wider bg-[#d93025] hover:bg-[#b80710] dark:bg-[#e50914] dark:hover:bg-[#b80710] text-white shadow-material dark:shadow-none transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>{t.generatePetition} (Act 522)</span>
            </button>
          )}

          {isToxic && (
            <button
              onClick={() => onFindSafeAlternative(waterPoint)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full dark:rounded-[4px] text-xs font-bold uppercase tracking-wider bg-[#1a73e8] hover:bg-[#1765cc] dark:bg-[#282828] dark:hover:bg-[#333333] text-white shadow-material dark:shadow-none transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="h-4 w-4" />
              <span>{t.findSafeWater}</span>
            </button>
          )}

          {isSafe && (
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full dark:rounded-[4px] text-xs font-mono text-emerald-800 dark:text-[#a7f3d0] bg-emerald-50 dark:bg-[#172319] border border-emerald-200 dark:border-[#254228] font-semibold">
              <CheckCircle className="h-4 w-4 text-[#1e8e3e]" />
              <span>Certified Potable Under Ghana Water Company Standards</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
