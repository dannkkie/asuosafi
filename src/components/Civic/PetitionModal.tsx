'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Share2,
  Printer,
  Copy,
  Check,
  ShieldAlert,
  Scale,
  Building2,
  ExternalLink
} from 'lucide-react';
import { WaterPoint, SupportedLanguage } from '@/types';
import { generatePetitionForWaterPoint, PetitionDetails } from '@/utils/petitionGenerator';
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
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(petition.whatsappSummaryText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 border-b border-red-900/60 p-4 sm:p-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-900/60 text-red-400 border border-red-800">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {t.petitionTitle}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-red-900 text-red-200 border border-red-700">
                  Act 522 & 995
                </span>
              </div>
              <p className="text-xs text-red-200/80 mt-0.5">
                {t.petitionCiting}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={t.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Petition Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm font-sans text-slate-200 bg-slate-950/70">
          {/* Official Addressee Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Target Executive Official
              </span>
              <p className="font-extrabold text-white text-sm mt-0.5 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-400" />
                {petition.recipientName} ({petition.recipientOffice})
              </p>
              <p className="text-slate-400">{waterPoint.district}, {waterPoint.region} Region</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Official Reference Code
              </span>
              <p className="font-mono font-bold text-amber-400 text-xs mt-0.5">
                {petition.referenceNumber}
              </p>
              <p className="text-slate-400 text-[11px]">{petition.date}</p>
            </div>
          </div>

          {/* Statutory Citations Pill List */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
              Statutory Legal Authority
            </span>
            <div className="grid gap-1.5">
              {petition.statutoryCitations.map((citation, index) => (
                <div key={index} className="flex items-start gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-xs text-slate-300">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{citation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demands for Redress */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
              Citizen Demands for Immediate Executive Action
            </span>
            <div className="space-y-2">
              {petition.citizenDemands.map((demand, index) => (
                <div key={index} className="bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg text-xs text-red-200 flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-red-900/60 text-red-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{demand}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Letter Preview Container */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Full Petition Text
            </span>
            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {petition.bodyMarkdown}
            </pre>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print Dossier</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Mobilize on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
