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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-950 selection:text-emerald-900 dark:selection:text-emerald-300 transition-colors duration-150">
      
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 rounded-xl shadow-sm transition-colors duration-150">
          
          {/* Status Filter Segmented Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-1 hidden md:flex font-mono font-medium">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>FILTER:</span>
            </div>

            {[
              { id: 'all', label: 'All Sources' },
              { id: 'critical_toxic', label: 'Critical Hazard', dot: 'bg-red-600 dark:bg-red-400' },
              { id: 'caution_turbid', label: 'Caution', dot: 'bg-amber-600 dark:bg-amber-400' },
              { id: 'safe', label: 'Potable Safe', dot: 'bg-emerald-600 dark:bg-emerald-400' },
            ].map((f) => {
              const isActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-slate-900 dark:bg-emerald-700 text-white font-semibold shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {f.dot && <span className={`h-1.5 w-1.5 rounded-full ${f.dot}`} />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher (Spatial Map vs Table vs Redress) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'map'
                  ? 'bg-white dark:bg-[#121927] text-slate-900 dark:text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Map className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Spatial Map</span>
            </button>

            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'table'
                  ? 'bg-white dark:bg-[#121927] text-slate-900 dark:text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5 text-sky-700 dark:text-sky-400" />
              <span>Ledger Table</span>
            </button>

            <button
              onClick={() => setActiveView('redress')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'redress'
                  ? 'bg-white dark:bg-[#121927] text-slate-900 dark:text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Scale className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
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
              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors duration-150">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    Active River Basin Stations ({waterPoints.length})
                  </span>
                  <button
                    onClick={() => setActiveView('table')}
                    className="text-xs text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 flex items-center gap-1 font-mono font-medium transition-colors cursor-pointer"
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
                        className={`text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isCur
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 shadow-sm'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">{pt.name}</p>
                            {isCur && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {pt.community} • {pt.riverBasin || pt.district}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`font-mono text-xs font-bold block ${
                            isTox
                              ? 'text-red-700 dark:text-red-400'
                              : isSafe
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-amber-700 dark:text-amber-400'
                          }`}>
                            {pt.metrics.turbidityNtu} NTU
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 block">
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
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="max-w-3xl space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-bold">
                  STATUTORY ACCOUNTABILITY FRAMEWORK
                </span>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                  Civic Legal Redress & Executive Mobilization Engine
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Information without statutory enforcement cannot protect Ghana’s rivers. AsuoSafi transforms verified citizen environmental audits into formal legal instruments with verifiable citations under Ghanaian constitutional and statutory law.
                </p>
              </div>
            </div>

            {/* Statutory Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pillar 1: Water Resources Commission Act */}
              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
                <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Act 522 (Water Resources)</h4>
                  <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Section 24 & Section 29</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Grants statutory powers to prohibit the discharge of untreated industrial tailings, silt, or mining wash-water into national water bodies. Empowers District Assemblies to seal unlawful diversions.
                </p>
              </div>

              {/* Pillar 2: Minerals & Mining Act */}
              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
                <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Act 995 (Mining Amendment)</h4>
                  <p className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-semibold mt-0.5">Section 99 & Section 100</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Criminalizes dredging or mining within 100 meters of a water body without an EPA environmental permit. Prescribes mandatory prison sentences and confiscation of excavators to the State.
                </p>
              </div>

              {/* Pillar 3: Whistleblower Protection */}
              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
                <div className="h-9 w-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Act 720 (Whistleblower)</h4>
                  <p className="text-[11px] font-mono text-sky-700 dark:text-sky-400 font-semibold mt-0.5">Section 12 & Section 18</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Guarantees full civil and criminal immunity to citizens reporting environmental degradation or public hazards to statutory authorities, protecting monitors from local cartel intimidation.
                </p>
              </div>

            </div>

            {/* Active Grievances List */}
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Contaminated Basins Requiring Immediate Statutory Filing
                </h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  {waterPoints.filter(p => p.currentStatus === 'critical_toxic').length} Actions Pending
                </span>
              </div>

              <div className="space-y-3">
                {waterPoints.filter(p => p.currentStatus === 'critical_toxic').map((pt) => (
                  <div
                    key={pt.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{pt.name}</span>
                        <span className="text-[10px] font-mono text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-950/60 px-1.5 py-0.2 rounded border border-red-200 dark:border-red-800/60 font-bold">
                          {pt.metrics.turbidityNtu} NTU
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Target: District Chief Executive ({pt.district}, {pt.region} Region)
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenPetition(pt)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-700 hover:bg-red-800 text-white shadow-sm transition-all cursor-pointer shrink-0"
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
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Pillar 1: Evidence-Based Peace */}
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2.5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center">
                <Droplets className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-sans">
                Evidence-Based Water Peace
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                By substituting unverified social media rumors with decentralized, multi-witness chemical assays, AsuoSafi builds verifiable consensus between farmers, miners, and traditional councils.
              </p>
            </div>

            {/* Pillar 2: Pan-African Extractive Scalability */}
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2.5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center">
                <Globe2 className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-sans">
                Pan-African Scalability
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The core ledger architecture seamlessly extends to artisanal mining basins across Africa: Katanga cobalt corridors in DR Congo, Zama Zama acid-mine drainage in South Africa, and Kadoma gold belts in Zimbabwe.
              </p>
            </div>

            {/* Pillar 3: Grounded In Statutory Law */}
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2.5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-sans">
                Actionable Statutory Redress
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                1-click statutory petitions cite Ghana's Act 522 and Act 995, equipping citizens with formal legal instruments to demand prompt enforcement by District Assemblies and the EPA.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* 5. Institutional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] py-6 px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-150">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">AsuoSafi</strong> • National Extractive Water & Environmental Safety Ledger
          </p>
          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
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
