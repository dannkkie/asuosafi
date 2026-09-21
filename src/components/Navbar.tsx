'use client';

import React from 'react';
import { Droplets, ShieldAlert, Globe, Radio, PlusCircle } from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenReportModal: () => void;
  showConcessions: boolean;
  onToggleConcessions: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenReportModal,
  showConcessions,
  onToggleConcessions,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-950/30">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  Ghana Trust Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Action Controls & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Concession Overlay Toggle */}
            <button
              onClick={onToggleConcessions}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                showConcessions
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={t.concessionLayerToggle}
            >
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>Galamsey Zones</span>
            </button>

            {/* Report Water Condition Button */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition-all active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden xs:inline">{t.reportWaterIssue}</span>
              <span className="xs:hidden">Report</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                aria-label="Language selection"
                className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-900 text-white">English (EN)</option>
                <option value="twi" className="bg-slate-900 text-white">Twi (Akan)</option>
                <option value="ewe" className="bg-slate-900 text-white">Eʋegbe (Ewe)</option>
                <option value="hausa" className="bg-slate-900 text-white">Hausa (HA)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
