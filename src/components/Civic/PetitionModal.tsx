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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141414]/80 p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl dark:shadow-none overflow-hidden text-[#1f2124] dark:text-[#f5f5f1] animate-in fade-in duration-150">
        
        {/* Modal Header */}
        <div className="bg-[#f8f9fa] dark:bg-[#181818] border-b border-[#e0e2e6] dark:border-[#2a2a2a] p-4 sm:p-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-[8px] dark:rounded-[4px] bg-amber-50 dark:bg-[#282119] text-amber-800 dark:text-[#fde68a] border border-amber-200 dark:border-[#523215]">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#1f2124] dark:text-[#f5f5f1] font-sans dark:font-display dark:text-xl dark:tracking-wide">
                  Statutory Redress & Civic Petition
                </h3>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-[4px] bg-amber-100 dark:bg-[#282119] text-amber-900 dark:text-[#fde68a] border border-amber-200 dark:border-[#523215] font-semibold">
                  Act 522 & 995
                </span>
              </div>
              <p className="text-xs text-[#5f6368] dark:text-[#a3a3a3] mt-0.5">
                Official citizen legal instrument for <strong className="text-[#1f2124] dark:text-[#f5f5f1]">{waterPoint.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-[#5f6368] dark:text-[#a3a3a3] hover:text-[#1f2124] dark:hover:text-white hover:bg-[#e8eaed] dark:hover:bg-[#282828] transition-colors cursor-pointer"
            title={t.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Official Document Layout */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#1f2124] dark:text-[#f5f5f1] bg-white dark:bg-[#1f1f1f]">
          
          {/* Official Addressee Header Card */}
          <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold block">
                Target Statutory Executive
              </span>
              <p className="font-bold text-[#1f2124] dark:text-[#f5f5f1] text-sm mt-0.5 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-[#1e8e3e] dark:text-[#e50914] shrink-0" />
                <span>{petition.recipientName} ({petition.recipientOffice})</span>
              </p>
              <p className="text-[#5f6368] dark:text-[#a3a3a3] mt-0.5">{waterPoint.district}, {waterPoint.region} Region</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold block">
                Formal Reference ID
              </span>
              <p className="font-mono font-bold text-amber-800 dark:text-[#fde68a] text-xs mt-0.5">
                {petition.referenceNumber}
              </p>
              <p className="text-[#5f6368] dark:text-[#a3a3a3] text-[11px] font-mono mt-0.5">{petition.date}</p>
            </div>
          </div>

          {/* Statutory Citations Callout */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold block">
              Invoked Statutory Framework
            </span>
            <div className="grid gap-1.5">
              {petition.statutoryCitations.map((citation, index) => (
                <div key={index} className="flex items-start gap-2 bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] p-2.5 rounded-[6px] dark:rounded-[4px] text-xs text-[#1f2124] dark:text-[#f5f5f1]">
                  <ShieldAlert className="h-3.5 w-3.5 text-[#f9ab00] dark:text-[#e50914] shrink-0 mt-0.5" />
                  <span>{citation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Demands */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold block">
              Citizen Demands for Enforcement
            </span>
            <div className="space-y-2">
              {petition.citizenDemands.map((demand, index) => (
                <div key={index} className="bg-red-50 dark:bg-[#2e1517] border border-red-200 dark:border-[#541e22] p-3 rounded-[8px] dark:rounded-[4px] text-xs text-red-900 dark:text-[#fca5a5] flex items-start gap-2.5">
                  <span className="h-4 w-4 rounded-[4px] bg-red-200 dark:bg-[#3d1518] text-red-900 dark:text-[#fca5a5] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{demand}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Letter Preview */}
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-semibold block mb-1">
              Statutory Instrument Full Text
            </span>
            <pre className="bg-[#f8f9fa] dark:bg-[#141414] p-4 rounded-[8px] dark:rounded-[4px] border border-[#e0e2e6] dark:border-[#2a2a2a] font-mono text-[11px] leading-relaxed text-[#1f2124] dark:text-[#f5f5f1] whitespace-pre-wrap max-h-44 overflow-y-auto">
              {petition.bodyMarkdown}
            </pre>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#f8f9fa] dark:bg-[#181818] border-t border-[#e0e2e6] dark:border-[#2a2a2a] p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full dark:rounded-[4px] text-xs font-medium bg-white dark:bg-[#141414] hover:bg-[#f1f3f4] dark:hover:bg-[#252525] text-[#1f2124] dark:text-[#f5f5f1] border border-[#e0e2e6] dark:border-[#2a2a2a] shadow-material dark:shadow-none transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#1e8e3e]" /> : <Copy className="h-3.5 w-3.5 text-[#5f6368] dark:text-[#a3a3a3]" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full dark:rounded-[4px] text-xs font-medium bg-white dark:bg-[#141414] hover:bg-[#f1f3f4] dark:hover:bg-[#252525] text-[#1f2124] dark:text-[#f5f5f1] border border-[#e0e2e6] dark:border-[#2a2a2a] shadow-material dark:shadow-none transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-[#5f6368] dark:text-[#a3a3a3]" />
              <span>Print Official Letter</span>
            </button>
          </div>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full dark:rounded-[4px] text-xs font-semibold bg-[#1e8e3e] hover:bg-[#177232] dark:bg-[#e50914] dark:hover:bg-[#b80710] text-white shadow-material dark:shadow-none transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Mobilize Community on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};
