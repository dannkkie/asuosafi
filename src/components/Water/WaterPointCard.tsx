'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  FileText,
  Navigation,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  Clock
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
    <div className="bg-[#0E1524] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl text-slate-100 transition-all">
      
      {/* Top Header / Hazard Status Strip */}
      <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 ${
        isToxic
          ? 'bg-red-500/[0.06] border-red-500/20'
          : isSafe
          ? 'bg-emerald-500/[0.06] border-emerald-500/20'
          : 'bg-amber-500/[0.06] border-amber-500/20'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            {waterPoint.sourceType.toUpperCase()} • {waterPoint.riverBasin || 'LOCAL BASIN'}
          </span>
        </div>

        {/* Hazard Level Badge */}
        <div className="flex items-center gap-1.5">
          {isToxic ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide bg-red-500/20 text-red-300 border border-red-500/40 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
              WHO Class 4: Critical Toxic
            </span>
          ) : isSafe ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              WHO Class 1: Potable
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Caution / Turbid
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5">
        
        {/* Title & Geospatial Coordinates */}
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            {waterPoint.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {waterPoint.community}, {waterPoint.district} ({waterPoint.region} Region)
            </span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-slate-400">
              {waterPoint.coordinates.latitude.toFixed(4)}° N, {Math.abs(waterPoint.coordinates.longitude).toFixed(4)}° W
            </span>
          </div>
        </div>

        {/* Critical Contamination Warning Notice if Toxic */}
        {isToxic && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3.5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-red-200 uppercase tracking-wide">
                Severe Galamsey Silt & Chemical Risk Detected
              </p>
              <p className="text-xs text-red-200/80 leading-relaxed">
                Turbidity exceeds WHO safety guidelines by <strong className="text-red-100">{Math.round(waterPoint.metrics.turbidityNtu / 5)}x</strong>. Heavy silt, mercury, and cyanide residue render this source unfit for human consumption or bathing.
              </p>
            </div>
          </div>
        )}

        {/* Narrative Description */}
        <p className="text-xs text-slate-300 leading-relaxed bg-[#141D2D]/60 p-3 rounded-lg border border-white/[0.04]">
          {waterPoint.description}
        </p>

        {/* Precision Scientific Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* Metric 1: Turbidity Gauge */}
          <div className="bg-[#141D2D] border border-white/[0.06] rounded-lg p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Turbidity (NTU)
            </span>
            <span className={`text-xl font-bold font-mono tabular-nums block mt-0.5 ${
              waterPoint.metrics.turbidityNtu > 50 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {waterPoint.metrics.turbidityNtu}
            </span>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${
                  waterPoint.metrics.turbidityNtu > 50 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (waterPoint.metrics.turbidityNtu / 1000) * 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 font-mono mt-1 block">WHO Safe: &lt;5 NTU</span>
          </div>

          {/* Metric 2: pH Acidity Strip */}
          <div className="bg-[#141D2D] border border-white/[0.06] rounded-lg p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              pH Acidity
            </span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-100 block mt-0.5">
              {waterPoint.metrics.phLevel}
            </span>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${
                  waterPoint.metrics.phLevel < 6.5 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${(waterPoint.metrics.phLevel / 14) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 font-mono mt-1 block">Standard: 6.5–8.5</span>
          </div>

          {/* Metric 3: Upstream Mining Threat */}
          <div className="bg-[#141D2D] border border-white/[0.06] rounded-lg p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Mining Proximity
            </span>
            <span className={`text-xl font-bold font-mono tabular-nums block mt-0.5 ${
              waterPoint.upstreamMiningDistanceKm < 1.0 ? 'text-amber-400' : 'text-slate-200'
            }`}>
              {waterPoint.upstreamMiningDistanceKm} km
            </span>
            <span className="text-[9px] text-slate-400 mt-2 block">
              {waterPoint.upstreamMiningDistanceKm < 1.0 ? '⚠️ Active Upstream' : 'Distal Basin'}
            </span>
          </div>

          {/* Metric 4: Chemical Residue Risk */}
          <div className="bg-[#141D2D] border border-white/[0.06] rounded-lg p-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Chemical Residue
            </span>
            <span className={`text-sm font-bold block mt-1.5 ${
              waterPoint.metrics.chemicalRiskDetected ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {waterPoint.metrics.chemicalRiskDetected ? 'Hazard Detected' : 'Clear / Negligible'}
            </span>
            <span className="text-[9px] text-slate-500 mt-2 block">
              {waterPoint.metrics.visualColor.replace('_', ' ').toUpperCase()}
            </span>
          </div>

        </div>

        {/* Multi-Witness Cryptographic Attestation Block */}
        <div className="bg-[#0B0F17]/90 border border-white/[0.06] rounded-lg p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span className="font-semibold">{waterPoint.verifiedByCount} Verified Co-Signatories</span>
              <span className="text-[10px] font-mono text-slate-500">
                ({waterPoint.verificationBadge.replace(/_/g, ' ')})
              </span>
            </div>

            <button
              onClick={() => onOpenAuditTrail(waterPoint)}
              className="text-cyan-400 hover:text-cyan-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{t.inspectAuditTrail}</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          {/* Cryptographic SHA-256 Hash Display */}
          <div className="flex items-center justify-between gap-2 bg-[#141D2D] border border-white/[0.06] rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-500">SHA-256:</span>
              <span className="truncate text-slate-300">{mockSha256}</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="p-1 hover:text-white transition-colors shrink-0"
              title="Copy cryptographic audit hash"
            >
              {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          {isToxic && (
            <button
              onClick={() => onOpenPetition(waterPoint)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>{t.generatePetition} (Act 522)</span>
            </button>
          )}

          {isToxic && (
            <button
              onClick={() => onFindSafeAlternative(waterPoint)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="h-4 w-4" />
              <span>{t.findSafeWater}</span>
            </button>
          )}

          {isSafe && (
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="h-4 w-4" />
              <span>Certified Potable Under Ghana Water Company Standards</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
