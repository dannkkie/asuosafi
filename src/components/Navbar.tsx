'use client';

import React from 'react';
import {
  Droplets,
  Shield,
  Layers,
  Sparkles,
  Plus,
  Globe2,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';
import { useTheme } from '@/components/Theme/ThemeProvider';

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
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Mark & Institutional Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-sm shrink-0 border border-slate-700/60 dark:border-slate-700">
              <Shield className="h-5 w-5 text-emerald-400 absolute stroke-[1.75]" />
              <Droplets className="h-3 w-3 text-white relative z-10 translate-y-0.5" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  GH-LEDGER v1.2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block tracking-normal">
                National Extractive Water & Environmental Safety Ledger
              </p>
            </div>
          </div>

          {/* Center Telemetry Status Pill (Desktop only) */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-[#141824] border border-slate-200/80 dark:border-[#202738] text-xs text-slate-600 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-[#10B981] animate-pulse" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">6 Mining Basins Monitored</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-emerald-700 dark:text-[#34D399] font-mono text-[11px] font-semibold">Consensus Protocol Active</span>
          </div>

          {/* Right Action Command Controls (Pill Cluster) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Galamsey Concessions Overlay Toggle Pill */}
            <button
              onClick={onToggleConcessions}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
                showConcessions
                  ? 'bg-amber-500/10 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800/60 shadow-sm'
                  : 'bg-white/90 dark:bg-[#161924] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#232938] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={t.concessionLayerToggle}
            >
              <Layers className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Concession Buffer</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                showConcessions ? 'bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {showConcessions ? 'ACTIVE' : 'OFF'}
              </span>
            </button>

            {/* AI Environmental & Statutory Advisor Pill */}
            <button
              onClick={onOpenAiAdvisor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sky-500/10 dark:bg-sky-950/40 hover:bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/50 shadow-sm transition-all cursor-pointer"
              title="Access AI Environmental & Legal Rights Advisor"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span className="hidden sm:inline">AI Legal Advisor</span>
            </button>

            {/* Primary Action Pill: OpsPulse Marigold Golden Button */}
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 border border-amber-400/40 shadow-sm shadow-amber-400/20 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{t.reportWaterIssue}</span>
              <span className="sm:hidden">Report</span>
            </button>

            {/* Multi-Lingual Dialect Selector Pill */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full px-2.5 py-1.5 shadow-sm">
              <Globe2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                aria-label="Select Local Dialect"
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">EN</option>
                <option value="twi" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Twi</option>
                <option value="ewe" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Ewe</option>
                <option value="hausa" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Hausa</option>
              </select>
            </div>

            {/* Theme Switcher Toggle Pill (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors cursor-pointer"
              title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-slate-600" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
