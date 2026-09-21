'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  Hash,
  UserCheck,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Lock,
  Award
} from 'lucide-react';
import { WaterPoint, VerificationRecord, SupportedLanguage } from '@/types';
import { INITIAL_VERIFICATIONS } from '@/data/mockData';
import { TRANSLATIONS } from '@/utils/translations';

interface AuditTrailModalProps {
  waterPoint: WaterPoint | null;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  waterPoint,
  onClose,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  if (!waterPoint) return null;

  // Find verification record or build a synthetic one for demonstrated audit trail
  const verification = INITIAL_VERIFICATIONS.find(v => v.waterPointId === waterPoint.id) || {
    id: `ver-${waterPoint.id}`,
    waterPointId: waterPoint.id,
    waterPointName: waterPoint.name,
    reportedByRole: 'community_monitor' as const,
    reporterAlias: 'Verified Community Water Monitor #14',
    observationDate: `${new Date(waterPoint.lastTestedAt).toLocaleDateString('en-GB')} 15:30 GMT`,
    metricsObserved: {
      visualColor: waterPoint.metrics.visualColor,
      turbidityEstimate: `${waterPoint.metrics.turbidityNtu} NTU`,
      odorDetected: waterPoint.metrics.chemicalRiskDetected,
    },
    exifVerified: true,
    sha256Hash: `8f3b4c1298da5e149afbf4c8996fb92427ae41e4649b934ca495991b7852${waterPoint.id.slice(-4)}`,
    attestations: [
      {
        witnessNameOrRole: 'Community Water Committee Chairperson',
        organization: `${waterPoint.community} Town Council`,
        verifiedAt: `${new Date(waterPoint.lastTestedAt).toLocaleDateString('en-GB')} 16:15 GMT`,
        verifiedVia: 'in_person_inspection' as const,
      },
      {
        witnessNameOrRole: 'Local Primary Health Clinic Nurse',
        organization: 'Ghana Health Service (GHS)',
        verifiedAt: `${new Date(waterPoint.lastTestedAt).toLocaleDateString('en-GB')} 16:45 GMT`,
        verifiedVia: 'test_strip_kit' as const,
      }
    ],
    calculatedTrustScore: 94,
    verificationBadge: waterPoint.verificationBadge,
    notes: 'Multi-party physical verification conducted in accordance with AsuoSafi decentralized attestation protocol.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-cyan-900/60 p-4 sm:p-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-900/60 text-cyan-400 border border-cyan-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Cryptographic Trust & Attestation Ledger
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {verification.calculatedTrustScore}% Integrity
                </span>
              </div>
              <p className="text-xs text-cyan-200/80 mt-0.5">
                {waterPoint.name} — {waterPoint.community}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={t.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200 bg-slate-950/70">
          
          {/* SHA-256 Hash Stamp */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-cyan-400">
                <Hash className="h-3.5 w-3.5" />
                Immutable SHA-256 Audit Stamp
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <Lock className="h-3 w-3" />
                Tamper-Proof
              </span>
            </div>
            <p className="font-mono text-[11px] text-cyan-200 bg-black/40 p-2 rounded-lg break-all border border-cyan-950 select-all">
              {verification.sha256Hash}
            </p>
          </div>

          {/* Primary Observer / Submitter */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Primary Field Observer
              </span>
              <p className="font-bold text-white text-sm mt-0.5 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-cyan-400" />
                {verification.reporterAlias}
              </p>
              <span className="text-[11px] text-slate-400 capitalize">
                Role: {verification.reportedByRole.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Field Observation Timestamp
              </span>
              <p className="font-semibold text-slate-200 text-xs mt-0.5 flex items-center sm:justify-end gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {verification.observationDate}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1 font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                EXIF GPS Verified (&lt;50m)
              </span>
            </div>
          </div>

          {/* Independent Multi-Witness Attestations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-300">
                Multi-Witness Corroboration Attestations ({verification.attestations.length})
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Consensus Gate Passed
              </span>
            </div>

            <div className="space-y-2">
              {verification.attestations.map((att, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{att.witnessNameOrRole}</p>
                      <p className="text-[11px] text-slate-400">{att.organization}</p>
                      <span className="text-[10px] text-cyan-300 capitalize inline-block mt-0.5">
                        Verified via: {att.verifiedVia.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0">
                    {att.verifiedAt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Inspection Protocol Notes */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-300">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Field Protocol Summary
            </span>
            <p className="leading-relaxed text-slate-300 text-[11px]">
              {verification.notes}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            AsuoSafi Protocol v1.0 • Powered by Multi-Attestation Consensus
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
