'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsBanner } from '@/components/StatsBanner';
import { MapWrapper } from '@/components/Map/MapWrapper';
import { WaterPointCard } from '@/components/Water/WaterPointCard';
import { SafeAlternativeFinder } from '@/components/Water/SafeAlternativeFinder';
import { VoiceBulletinPlayer } from '@/components/Audio/VoiceBulletinPlayer';
import { BasinRegistryTable } from '@/components/Basin/BasinRegistryTable';
import { ReportWizardModal } from '@/components/Report/ReportWizardModal';
import { PetitionModal } from '@/components/Civic/PetitionModal';
import { AuditTrailModal } from '@/components/Trust/AuditTrailModal';
import { AiAdvisorModal } from '@/components/AI/AiAdvisorModal';
import { INITIAL_WATER_POINTS, INITIAL_MINING_CONCESSIONS } from '@/data/mockData';
import { WaterPoint, SupportedLanguage, ContaminationStatus } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';
import {
  Map,
  Table as TableIcon,
  Scale,
  Filter,
  ShieldAlert,
  Droplets,
  Globe2,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function Home() {
  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>(INITIAL_WATER_POINTS);
  const [selectedWaterPoint, setSelectedWaterPoint] = useState<WaterPoint>(INITIAL_WATER_POINTS[0]);
  const [concessions] = useState(INITIAL_MINING_CONCESSIONS);
  const [showConcessions, setShowConcessions] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [statusFilter, setStatusFilter] = useState<'all' | ContaminationStatus>('all');
  const [activeView, setActiveView] = useState<'map' | 'table' | 'redress'>('map');

  // Modal Dialog States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPetitionModalOpen, setIsPetitionModalOpen] = useState(false);
  const [isAuditTrailModalOpen, setIsAuditTrailModalOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [targetPointForModal, setTargetPointForModal] = useState<WaterPoint | null>(null);

  const t = TRANSLATIONS[currentLanguage];

  // Filtered Water Points
  const filteredWaterPoints = useMemo(() => {
    if (statusFilter === 'all') return waterPoints;
    return waterPoints.filter((p) => p.currentStatus === statusFilter);
  }, [waterPoints, statusFilter]);

  // Find Safe Alternative for current point if unsafe
  const safeAlternative = useMemo(() => {
    if (!selectedWaterPoint || selectedWaterPoint.currentStatus === 'safe') return null;
    if (selectedWaterPoint.nearestSafeAlternativeId) {
      return waterPoints.find((p) => p.id === selectedWaterPoint.nearestSafeAlternativeId) || null;
    }
    return waterPoints.find((p) => p.currentStatus === 'safe') || null;
  }, [selectedWaterPoint, waterPoints]);

  const handleOpenPetition = (point: WaterPoint) => {
    setTargetPointForModal(point);
    setIsPetitionModalOpen(true);
  };

  const handleOpenAuditTrail = (point: WaterPoint) => {
    setTargetPointForModal(point);
    setIsAuditTrailModalOpen(true);
  };

  const handleAddNewReport = (newPoint: WaterPoint) => {
    setWaterPoints((prev) => [newPoint, ...prev]);
    setSelectedWaterPoint(newPoint);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#1f2124] dark:text-white font-sans selection:bg-blue-100 dark:selection:bg-[#331114] selection:text-[#1a73e8] dark:selection:text-[#e50914] transition-colors duration-150 relative">
      
      {/* 1. Global Command Navigation Bar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        showConcessions={showConcessions}
        onToggleConcessions={() => setShowConcessions(!showConcessions)}
      />

      {/* 2. Analytical KPI & Telemetry Bar */}
      <StatsBanner waterPoints={waterPoints} currentLanguage={currentLanguage} />

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Workspace Control Strip: Filters & View Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] p-2.5 sm:p-3 rounded-[12px] dark:rounded-[6px] shadow-material dark:shadow-none transition-colors duration-150">
          
          {/* Status Filter Segmented Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#4b5563] dark:text-[#cbd5e1] mr-1 hidden md:flex font-mono font-medium">
              <Filter className="h-3.5 w-3.5 text-[#4b5563] dark:text-[#cbd5e1]" />
              <span>FILTER:</span>
            </div>

            {[
              { id: 'all', label: 'All Sources' },
              { id: 'critical_toxic', label: 'Critical Hazard', dot: 'bg-[#d93025] dark:bg-[#e50914]' },
              { id: 'caution_turbid', label: 'Caution', dot: 'bg-[#f9ab00]' },
              { id: 'safe', label: 'Potable Safe', dot: 'bg-[#1e8e3e]' },
            ].map((f) => {
              const isActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-full dark:rounded-[4px] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#1a73e8] dark:bg-[#e50914] text-white font-medium dark:font-bold shadow-material dark:shadow-none'
                      : 'bg-[#f1f3f4] dark:bg-[#141414] text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white border border-[#e0e2e6] dark:border-[#2a2a2a] hover:bg-[#e8eaed] dark:hover:bg-[#252525]'
                  }`}
                >
                  {f.dot && <span className={`h-1.5 w-1.5 rounded-full ${f.dot}`} />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher (Spatial Map vs Table vs Redress) */}
          <div className="flex items-center gap-1 bg-[#f1f3f4] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-full dark:rounded-[4px] p-1 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full dark:rounded-[3px] text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'map'
                  ? 'bg-white dark:bg-[#1f1f1f] text-[#1f2124] dark:text-white font-semibold dark:font-bold shadow-material dark:shadow-none'
                  : 'text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white'
              }`}
            >
              <Map className="h-3.5 w-3.5 text-[#1e8e3e] dark:text-[#e50914]" />
              <span>Spatial Map</span>
            </button>

            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full dark:rounded-[3px] text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'table'
                  ? 'bg-white dark:bg-[#1f1f1f] text-[#1f2124] dark:text-white font-semibold dark:font-bold shadow-material dark:shadow-none'
                  : 'text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5 text-[#1a73e8] dark:text-white" />
              <span>Ledger Table</span>
            </button>

            <button
              onClick={() => setActiveView('redress')}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full dark:rounded-[3px] text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'redress'
                  ? 'bg-white dark:bg-[#1f1f1f] text-[#1f2124] dark:text-white font-semibold dark:font-bold shadow-material dark:shadow-none'
                  : 'text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white'
              }`}
            >
              <Scale className="h-3.5 w-3.5 text-[#f9ab00] dark:text-[#e50914]" />
              <span>Redress Hub</span>
            </button>
          </div>

        </div>

        {/* VIEW 1: SPATIAL MAP & TELEMETRY WORKSPACE */}
        {activeView === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (7 cols on lg): Interactive Map, Audio Bulletin & Basin Feed */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Geospatial Map Container */}
              <div className="h-[480px] w-full">
                <MapWrapper
                  waterPoints={filteredWaterPoints}
                  selectedWaterPoint={selectedWaterPoint}
                  onSelectWaterPoint={(pt) => setSelectedWaterPoint(pt)}
                  concessions={concessions}
                  showConcessions={showConcessions}
                />
              </div>

              {/* Emergency Civic Radio Voice Bulletin */}
              <VoiceBulletinPlayer
                waterPoint={selectedWaterPoint}
                currentLanguage={currentLanguage}
                safeAlternative={safeAlternative}
              />

              {/* Active Basin Monitoring Stations Feed */}
              <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-4 shadow-material dark:shadow-none transition-colors duration-150">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e0e2e6] dark:border-[#2a2a2a]">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#4b5563] dark:text-[#cbd5e1] font-bold">
                    Active River Basin Stations ({waterPoints.length})
                  </span>
                  <button
                    onClick={() => setActiveView('table')}
                    className="text-xs text-[#1a73e8] dark:text-white hover:underline flex items-center gap-1 font-mono font-medium transition-colors cursor-pointer"
                  >
                    <span>View all in table</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {waterPoints.map((pt) => {
                    const isCur = selectedWaterPoint?.id === pt.id;
                    const isTox = pt.currentStatus === 'critical_toxic';
                    const isSafe = pt.currentStatus === 'safe';

                    return (
                      <button
                        key={pt.id}
                        onClick={() => setSelectedWaterPoint(pt)}
                        className={`text-left p-3 rounded-[8px] dark:rounded-[4px] border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isCur
                            ? 'bg-[#e8f0fe] dark:bg-[#2a2123] border-[#1a73e8] dark:border-[#e50914] shadow-material dark:shadow-none'
                            : 'bg-white dark:bg-[#141414] border-[#e0e2e6] dark:border-[#2a2a2a] hover:bg-[#f8f9fa] dark:hover:bg-[#252525]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-xs sm:text-sm text-[#1f2124] dark:text-white truncate">{pt.name}</p>
                            {isCur && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#1a73e8] dark:bg-[#e50914] shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] truncate mt-0.5">
                            {pt.community} • {pt.riverBasin || pt.district}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`font-mono text-xs font-bold block ${
                            isTox
                              ? 'text-red-700 dark:text-[#e50914]'
                              : isSafe
                              ? 'text-emerald-700 dark:text-[#1e8e3e]'
                              : 'text-amber-700 dark:text-[#f9ab00]'
                          }`}>
                            {pt.metrics.turbidityNtu} NTU
                          </span>
                          <span className="text-[10px] font-mono text-[#4b5563] dark:text-[#cbd5e1] block">
                            {pt.upstreamMiningDistanceKm} km mine
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column (5 cols on lg): Water Point Inspector & Safe Alternative */}
            <div className="lg:col-span-5 space-y-4">
              {selectedWaterPoint && (
                <WaterPointCard
                  waterPoint={selectedWaterPoint}
                  onOpenPetition={handleOpenPetition}
                  onOpenAuditTrail={handleOpenAuditTrail}
                  onFindSafeAlternative={(pt) => {
                    if (safeAlternative) setSelectedWaterPoint(safeAlternative);
                  }}
                  currentLanguage={currentLanguage}
                />
              )}

              {/* Safe Alternative Quick Switcher (If point is contaminated) */}
              {selectedWaterPoint && selectedWaterPoint.currentStatus !== 'safe' && safeAlternative && (
                <SafeAlternativeFinder
                  currentWaterPoint={selectedWaterPoint}
                  safeAlternative={safeAlternative}
                  onSelectSafePoint={(safePt) => setSelectedWaterPoint(safePt)}
                  currentLanguage={currentLanguage}
                />
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: BASIN REGISTRY LEDGER TABLE */}
        {activeView === 'table' && (
          <BasinRegistryTable
            waterPoints={waterPoints}
            selectedWaterPoint={selectedWaterPoint}
            onSelectWaterPoint={(pt) => setSelectedWaterPoint(pt)}
            onOpenPetition={handleOpenPetition}
            onOpenAuditTrail={handleOpenAuditTrail}
            onSwitchToMap={() => setActiveView('map')}
            currentLanguage={currentLanguage}
          />
        )}

        {/* VIEW 3: STATUTORY REDRESS & LEGAL HUB */}
        {activeView === 'redress' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Legal Redress Header */}
            <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-6 shadow-material dark:shadow-none">
              <div className="max-w-3xl space-y-2">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-amber-50 dark:bg-[#282119] text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-[#523215] font-bold">
                  STATUTORY ACCOUNTABILITY FRAMEWORK
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1f2124] dark:text-white font-sans">
                  Civic Legal Redress & Executive Mobilization Engine
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] dark:text-[#cbd5e1] leading-relaxed">
                  Information without statutory enforcement cannot protect Ghana’s rivers. AsuoSafi transforms verified citizen environmental audits into formal legal instruments with verifiable citations under Ghanaian constitutional and statutory law.
                </p>
              </div>
            </div>

            {/* Statutory Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pillar 1: Water Resources Commission Act */}
              <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-5 space-y-3 shadow-material dark:shadow-none">
                <div className="h-9 w-9 rounded-[8px] dark:rounded-[4px] bg-emerald-50 dark:bg-[#172319] text-emerald-800 dark:text-[#a7f3d0] border border-emerald-200 dark:border-[#254228] flex items-center justify-center">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#1f2124] dark:text-white font-sans">Act 522 (Water Resources)</h4>
                  <p className="text-xs font-mono text-emerald-700 dark:text-[#a7f3d0] font-semibold mt-0.5">Section 24 & Section 29</p>
                </div>
                <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] leading-relaxed">
                  Grants statutory powers to prohibit the discharge of untreated industrial tailings, silt, or mining wash-water into national water bodies. Empowers District Assemblies to seal unlawful diversions.
                </p>
              </div>

              {/* Pillar 2: Minerals & Mining Act */}
              <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-5 space-y-3 shadow-material dark:shadow-none">
                <div className="h-9 w-9 rounded-[8px] dark:rounded-[4px] bg-amber-50 dark:bg-[#282119] text-amber-800 dark:text-[#fde68a] border border-amber-200 dark:border-[#523215] flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#1f2124] dark:text-white font-sans">Act 995 (Mining Amendment)</h4>
                  <p className="text-xs font-mono text-amber-700 dark:text-[#fde68a] font-semibold mt-0.5">Section 99 & Section 100</p>
                </div>
                <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] leading-relaxed">
                  Criminalizes dredging or mining within 100 meters of a water body without an EPA environmental permit. Prescribes mandatory prison sentences and confiscation of excavators to the State.
                </p>
              </div>

              {/* Pillar 3: Whistleblower Protection */}
              <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-5 space-y-3 shadow-material dark:shadow-none">
                <div className="h-9 w-9 rounded-[8px] dark:rounded-[4px] bg-[#e8f0fe] dark:bg-[#181818] text-[#1a73e8] dark:text-white border border-[#d2e3fc] dark:border-[#2a2a2a] flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#1f2124] dark:text-white font-sans">Act 720 (Whistleblower)</h4>
                  <p className="text-xs font-mono text-[#1a73e8] dark:text-[#cbd5e1] font-semibold mt-0.5">Section 12 & Section 18</p>
                </div>
                <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] leading-relaxed">
                  Guarantees full civil and criminal immunity to citizens reporting environmental degradation or public hazards to statutory authorities, protecting monitors from local cartel intimidation.
                </p>
              </div>

            </div>

            {/* Active Grievances List */}
            <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-5 space-y-4 shadow-material dark:shadow-none">
              <div className="flex items-center justify-between pb-3 border-b border-[#e0e2e6] dark:border-[#2a2a2a]">
                <h4 className="font-bold text-sm sm:text-base text-[#1f2124] dark:text-white font-sans">
                  Contaminated Basins Requiring Immediate Statutory Filing
                </h4>
                <span className="text-xs font-mono text-[#4b5563] dark:text-[#cbd5e1] font-semibold">
                  {waterPoints.filter(p => p.currentStatus === 'critical_toxic').length} Actions Pending
                </span>
              </div>

              <div className="space-y-3">
                {waterPoints.filter(p => p.currentStatus === 'critical_toxic').map((pt) => (
                  <div
                    key={pt.id}
                    className="p-3.5 bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[#1f2124] dark:text-white">{pt.name}</span>
                        <span className="text-[10px] font-mono text-red-800 dark:text-[#fca5a5] bg-red-100 dark:bg-[#3d1518] px-1.5 py-0.2 rounded-[3px] border border-red-200 dark:border-[#541e22] font-bold">
                          {pt.metrics.turbidityNtu} NTU
                        </span>
                      </div>
                      <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] mt-0.5">
                        Target: District Chief Executive ({pt.district}, {pt.region} Region)
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenPetition(pt)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full dark:rounded-[4px] text-xs font-semibold bg-[#d93025] hover:bg-[#b80710] dark:bg-[#e50914] dark:hover:bg-[#b80710] text-white shadow-material dark:shadow-none transition-all cursor-pointer shrink-0"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Prepare Statutory Petition</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 4. Strategic Governance & Impact Architecture */}
        <div className="mt-12 pt-8 border-t border-[#e0e2e6] dark:border-[#2a2a2a]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Pillar 1: Evidence-Based Peace */}
            <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-5 space-y-2.5 shadow-material dark:shadow-none">
              <div className="h-8 w-8 rounded-[6px] dark:rounded-[4px] bg-emerald-50 dark:bg-[#172319] text-emerald-800 dark:text-[#a7f3d0] border border-emerald-200 dark:border-[#254228] flex items-center justify-center">
                <Droplets className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#1f2124] dark:text-white font-sans">
                Evidence-Based Water Peace
              </h4>
              <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] leading-relaxed">
                By substituting unverified social media rumors with decentralized, multi-witness chemical assays, AsuoSafi builds verifiable consensus between farmers, miners, and traditional councils.
              </p>
            </div>

            {/* Pillar 2: Pan-African Extractive Scalability */}
            <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-5 space-y-2.5 shadow-material dark:shadow-none">
              <div className="h-8 w-8 rounded-[6px] dark:rounded-[4px] bg-[#e8f0fe] dark:bg-[#181818] text-[#1a73e8] dark:text-white border border-[#d2e3fc] dark:border-[#2a2a2a] flex items-center justify-center">
                <Globe2 className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#1f2124] dark:text-white font-sans">
                Pan-African Scalability
              </h4>
              <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] leading-relaxed">
                The core ledger architecture seamlessly extends to artisanal mining basins across Africa: Katanga cobalt corridors in DR Congo, Zama Zama acid-mine drainage in South Africa, and Kadoma gold belts in Zimbabwe.
              </p>
            </div>

            {/* Pillar 3: Grounded In Statutory Law */}
            <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-5 space-y-2.5 shadow-material dark:shadow-none">
              <div className="h-8 w-8 rounded-[6px] dark:rounded-[4px] bg-amber-50 dark:bg-[#282119] text-amber-800 dark:text-[#fde68a] border border-amber-200 dark:border-[#523215] flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#1f2124] dark:text-white font-sans">
                Actionable Statutory Redress
              </h4>
              <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] leading-relaxed">
                1-click statutory petitions cite Ghana's Act 522 and Act 995, equipping citizens with formal legal instruments to demand prompt enforcement by District Assemblies and the EPA.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* 5. Institutional Footer */}
      <footer className="border-t border-[#e0e2e6] dark:border-[#2a2a2a] bg-white dark:bg-[#141414] py-6 px-4 sm:px-6 text-xs text-[#4b5563] dark:text-[#cbd5e1] transition-colors duration-150">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#4b5563] dark:text-[#cbd5e1]">
            <strong className="text-[#1f2124] dark:text-white font-bold">AsuoSafi</strong> • National Extractive Water & Environmental Safety Ledger
          </p>
          <p className="text-xs font-mono text-[#4b5563] dark:text-[#cbd5e1]">
            OSF × Andela Hackathon Capstone • Open Civic Data Standard v1.2
          </p>
        </div>
      </footer>

      {/* 6. Modals */}
      {isReportModalOpen && (
        <ReportWizardModal
          onClose={() => setIsReportModalOpen(false)}
          onSubmitReport={handleAddNewReport}
          currentLanguage={currentLanguage}
        />
      )}

      {isPetitionModalOpen && targetPointForModal && (
        <PetitionModal
          waterPoint={targetPointForModal}
          onClose={() => {
            setIsPetitionModalOpen(false);
            setTargetPointForModal(null);
          }}
          currentLanguage={currentLanguage}
        />
      )}

      {isAuditTrailModalOpen && targetPointForModal && (
        <AuditTrailModal
          waterPoint={targetPointForModal}
          onClose={() => {
            setIsAuditTrailModalOpen(false);
            setTargetPointForModal(null);
          }}
          currentLanguage={currentLanguage}
        />
      )}

      {isAiAdvisorOpen && (
        <AiAdvisorModal
          onClose={() => setIsAiAdvisorOpen(false)}
          currentLanguage={currentLanguage}
        />
      )}

    </div>
  );
}
