'use client';

import React from 'react';
import {
  Droplets,
  Shield,
  Layers,
  Sparkles,
  Plus,
  Globe2,
  Activity
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenReportModal: () => void;
  onOpenAiAdvisor: () => void;
  showConcessions: boolean;
  onToggleConcessions: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenReportModal,
  onOpenAiAdvisor,
  showConcessions,
  onToggleConcessions,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-white/[0.08] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Mark & Institutional Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-inner">
              <Shield className="h-6 w-6 text-emerald-400 absolute stroke-[1.75]" />
              <Droplets className="h-3.5 w-3.5 text-cyan-300 relative z-10 translate-y-0.5" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-sans">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  GH-LEDGER v1.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block tracking-normal">
                National Extractive Water & Environmental Safety Ledger
              </p>
            </div>
          </div>

          {/* Center Telemetry Status (Desktop only) */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium">6 Mining Basins Monitored</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-mono text-[11px]">Consensus Protocol Live</span>
          </div>

          {/* Right Action Command Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Galamsey Concessions Overlay Toggle */}
            <button
              onClick={onToggleConcessions}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                showConcessions
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-sm'
                  : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08]'
              }`}
              title={t.concessionLayerToggle}
            >
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>Concession Polygons</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-amber-300 font-mono">
                {showConcessions ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* AI Environmental & Statutory Advisor */}
            <button
              onClick={onOpenAiAdvisor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] transition-all cursor-pointer active:scale-95"
              title="Access AI Environmental & Legal Rights Advisor"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">AI Legal Advisor</span>
            </button>

            {/* Primary Action: Submit Water Audit */}
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t.reportWaterIssue}</span>
              <span className="sm:hidden">Submit Audit</span>
            </button>

            {/* Multi-Lingual Dialect Selector */}
            <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5">
              <Globe2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                aria-label="Select Local Dialect"
                className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-[#0B0F17] text-slate-200">English (EN)</option>
                <option value="twi" className="bg-[#0B0F17] text-slate-200">Akan / Twi (AS)</option>
                <option value="ewe" className="bg-[#0B0F17] text-slate-200">Eʋegbe / Ewe (EW)</option>
                <option value="hausa" className="bg-[#0B0F17] text-slate-200">Hausa (HA)</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
