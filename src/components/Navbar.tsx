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
    <header className="sticky top-0 z-40 bg-white dark:bg-[#141414] border-b border-[#e0e2e6] dark:border-[#2a2a2a] text-[#1f2124] dark:text-white shadow-material dark:shadow-none transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Mark & Institutional Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-[10px] dark:rounded-[6px] bg-[#1a73e8] dark:bg-[#1f1f1f] text-white shrink-0 border border-[#1765cc] dark:border-[#2a2a2a]">
              <Shield className="h-5 w-5 text-emerald-300 dark:text-[#e50914] absolute stroke-[1.75]" />
              <Droplets className="h-3 w-3 text-white relative z-10 translate-y-0.5" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-normal text-[#1f2124] dark:text-white font-sans">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full dark:rounded-[4px] bg-[#f1f3f4] dark:bg-[#1f1f1f] text-[#4b5563] dark:text-[#cbd5e1] border border-[#e0e2e6] dark:border-[#2a2a2a] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e] dark:bg-[#e50914] animate-pulse" />
                  GH-LEDGER v1.2
                </span>
              </div>
              <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] hidden md:block">
                National Extractive Water & Environmental Safety Ledger
              </p>
            </div>
          </div>

          {/* Center Telemetry Status Pill (Desktop only) */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:rounded-[4px] bg-[#f8f9fa] dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] text-xs text-[#4b5563] dark:text-[#cbd5e1]">
            <span className="h-2 w-2 rounded-full bg-[#1e8e3e] dark:bg-[#e50914] animate-pulse" />
            <span className="text-[#1f2124] dark:text-white font-semibold">6 Mining Basins Monitored</span>
            <span className="text-[#e0e2e6] dark:text-[#383838]">•</span>
            <span className="text-[#1e8e3e] dark:text-emerald-400 font-mono text-xs font-bold">Consensus Protocol Active</span>
          </div>

          {/* Right Action Command Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Galamsey Concessions Overlay Toggle Pill */}
            <button
              onClick={onToggleConcessions}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full dark:rounded-[4px] text-xs font-semibold transition-all border cursor-pointer ${
                showConcessions
                  ? 'bg-amber-50 dark:bg-[#282119] text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800/80 shadow-xs'
                  : 'bg-white dark:bg-[#1f1f1f] text-[#4b5563] dark:text-[#cbd5e1] border-[#e0e2e6] dark:border-[#2a2a2a] hover:bg-[#f8f9fa] dark:hover:bg-[#282828]'
              }`}
              title={t.concessionLayerToggle}
            >
              <Layers className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Concession Buffer</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full dark:rounded-[3px] font-mono font-bold ${
                showConcessions ? 'bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200' : 'bg-[#f1f3f4] dark:bg-[#2a2a2a] text-[#4b5563] dark:text-[#cbd5e1]'
              }`}>
                {showConcessions ? 'ACTIVE' : 'OFF'}
              </span>
            </button>

            {/* AI Environmental & Statutory Advisor Pill */}
            <button
              onClick={onOpenAiAdvisor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full dark:rounded-[4px] text-xs font-semibold bg-[#e8f0fe] hover:bg-[#d2e3fc] dark:bg-[#1f1f1f] dark:hover:bg-[#282828] text-[#1a73e8] dark:text-white border border-[#d2e3fc] dark:border-[#2a2a2a] transition-all cursor-pointer"
              title="Access AI Environmental & Legal Rights Advisor"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#1a73e8] dark:text-[#e50914]" />
              <span className="hidden sm:inline">AI Legal Advisor</span>
            </button>

            {/* Primary Action Button: Google Blue (Light) / Netflix Red (Dark) */}
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full dark:rounded-[4px] text-xs font-bold bg-[#1a73e8] hover:bg-[#1765cc] dark:bg-[#e50914] dark:hover:bg-[#b80710] text-white shadow-material dark:shadow-none transition-all cursor-pointer active:scale-95 uppercase tracking-wider"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{t.reportWaterIssue}</span>
              <span className="sm:hidden">Report</span>
            </button>

            {/* Multi-Lingual Dialect Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-full dark:rounded-[4px] px-2.5 py-1.5 shadow-material dark:shadow-none">
              <Globe2 className="h-3.5 w-3.5 text-[#4b5563] dark:text-[#cbd5e1] shrink-0" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                aria-label="Select Local Dialect"
                className="bg-transparent text-xs font-semibold text-[#1f2124] dark:text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-white dark:bg-[#1f1f1f] text-[#1f2124] dark:text-white">EN</option>
                <option value="twi" className="bg-white dark:bg-[#1f1f1f] text-[#1f2124] dark:text-white">Twi</option>
                <option value="ewe" className="bg-white dark:bg-[#1f1f1f] text-[#1f2124] dark:text-white">Ewe</option>
                <option value="hausa" className="bg-white dark:bg-[#1f1f1f] text-[#1f2124] dark:text-white">Hausa</option>
              </select>
            </div>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full dark:rounded-[4px] bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white shadow-material dark:shadow-none transition-colors cursor-pointer"
              title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-[#5f6368]" />
              ) : (
                <Sun className="h-4 w-4 text-[#e50914]" />
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
