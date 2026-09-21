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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Mark & Institutional Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-slate-900 text-white shadow-sm shrink-0">
              <Shield className="h-5 w-5 text-emerald-400 absolute stroke-[1.75]" />
              <Droplets className="h-3 w-3 text-white relative z-10 translate-y-0.5" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  GH-LEDGER v1.2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block tracking-normal">
                National Extractive Water & Environmental Safety Ledger
              </p>
            </div>
          </div>

          {/* Center Telemetry Status (Desktop only) */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-slate-800 font-medium">6 Mining Basins Monitored</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-mono text-[11px] font-semibold">Consensus Protocol Active</span>
          </div>

          {/* Right Action Command Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Galamsey Concessions Overlay Toggle */}
            <button
              onClick={onToggleConcessions}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                showConcessions
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={t.concessionLayerToggle}
            >
              <Layers className="h-3.5 w-3.5 text-amber-700" />
              <span>Concession Polygons</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                showConcessions ? 'bg-amber-200/70 text-amber-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {showConcessions ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* AI Environmental & Statutory Advisor */}
            <button
              onClick={onOpenAiAdvisor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-colors cursor-pointer"
              title="Access AI Environmental & Legal Rights Advisor"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">AI Legal Advisor</span>
            </button>

            {/* Primary Action: Submit Water Audit */}
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t.reportWaterIssue}</span>
              <span className="sm:hidden">Submit Audit</span>
            </button>

            {/* Multi-Lingual Dialect Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm">
              <Globe2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                aria-label="Select Local Dialect"
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="twi">Akan / Twi (AS)</option>
                <option value="ewe">Eʋegbe / Ewe (EW)</option>
                <option value="hausa">Hausa (HA)</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
