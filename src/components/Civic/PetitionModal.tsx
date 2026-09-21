'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Printer,
  Copy,
  Check,
  Scale,
  Building2,
  ShieldAlert,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { WaterPoint, SupportedLanguage } from '@/types';
import { generatePetitionForWaterPoint } from '@/utils/petitionGenerator';
import { TRANSLATIONS } from '@/utils/translations';

interface PetitionModalProps {
  waterPoint: WaterPoint | null;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
}

export const PetitionModal: React.FC<PetitionModalProps> = ({
  waterPoint,
  onClose,
  currentLanguage,
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[currentLanguage];

  if (!waterPoint) return null;

  const petition = generatePetitionForWaterPoint(waterPoint);

  const handleCopyText = () => {
    navigator.clipboard.writeText(petition.bodyMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(petition.whatsappSummaryText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0E1524] border border-white/[0.1] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#0B0F17] border-b border-white/[0.08] p-4 sm:p-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                  Statutory Redress & Civic Petition
                </h3>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Act 522 & 995
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official citizen legal instrument for <strong className="text-slate-300">{waterPoint.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            title={t.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Official Document Layout */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200 bg-[#06090F]/90">
          
          {/* Official Addressee Header Card */}
          <div className="bg-[#141D2D] border border-white/[0.06] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                Target Statutory Executive
              </span>
              <p className="font-bold text-white text-sm mt-0.5 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{petition.recipientName} ({petition.recipientOffice})</span>
              </p>
              <p className="text-slate-400 mt-0.5">{waterPoint.district}, {waterPoint.region} Region</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                Formal Reference ID
              </span>
              <p className="font-mono font-bold text-amber-400 text-xs mt-0.5">
                {petition.referenceNumber}
              </p>
              <p className="text-slate-500 text-[11px] font-mono mt-0.5">{petition.date}</p>
            </div>
          </div>

          {/* Statutory Citations Callout */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Invoked Statutory Framework
            </span>
            <div className="grid gap-1.5">
              {petition.statutoryCitations.map((citation, index) => (
                <div key={index} className="flex items-start gap-2 bg-[#0B0F17] border border-white/[0.06] p-2.5 rounded-lg text-xs text-slate-300">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{citation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Demands */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Citizen Demands for Enforcement
            </span>
            <div className="space-y-2">
              {petition.citizenDemands.map((demand, index) => (
                <div key={index} className="bg-red-950/20 border border-red-900/30 p-3 rounded-lg text-xs text-red-200 flex items-start gap-2.5">
                  <span className="h-4 w-4 rounded bg-red-900/60 text-red-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{demand}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Letter Preview */}
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
              Statutory Instrument Full Text
            </span>
            <pre className="bg-[#0B0F17] p-4 rounded-xl border border-white/[0.06] font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap max-h-44 overflow-y-auto">
              {petition.bodyMarkdown}
            </pre>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#0B0F17] border-t border-white/[0.08] p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141D2D] hover:bg-[#1B263B] text-slate-200 border border-white/[0.08] transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141D2D] hover:bg-[#1B263B] text-slate-200 border border-white/[0.08] transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>Print Official Letter</span>
            </button>
          </div>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Mobilize Community on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};
