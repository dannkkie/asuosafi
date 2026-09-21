'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsBanner } from '@/components/StatsBanner';
import { MapWrapper } from '@/components/Map/MapWrapper';
import { WaterPointCard } from '@/components/Water/WaterPointCard';
import { SafeAlternativeFinder } from '@/components/Water/SafeAlternativeFinder';
import { VoiceBulletinPlayer } from '@/components/Audio/VoiceBulletinPlayer';
import { ReportWizardModal } from '@/components/Report/ReportWizardModal';
import { PetitionModal } from '@/components/Civic/PetitionModal';
import { AuditTrailModal } from '@/components/Trust/AuditTrailModal';
import { AiAdvisorModal } from '@/components/AI/AiAdvisorModal';
import { INITIAL_WATER_POINTS, INITIAL_MINING_CONCESSIONS } from '@/data/mockData';
import { WaterPoint, SupportedLanguage, ContaminationStatus } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';
import {
  Droplets,
  Filter,
  ShieldAlert,
  HelpCircle,
  Award,
  Globe2,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function Home() {
  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>(INITIAL_WATER_POINTS);
  const [selectedWaterPoint, setSelectedWaterPoint] = useState<WaterPoint>(INITIAL_WATER_POINTS[0]);
  const [concessions] = useState(INITIAL_MINING_CONCESSIONS);
  const [showConcessions, setShowConcessions] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [statusFilter, setStatusFilter] = useState<'all' | ContaminationStatus>('all');

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        showConcessions={showConcessions}
        onToggleConcessions={() => setShowConcessions(!showConcessions)}
      />

      {/* 2. Key Stats & Summary Banner */}
      <StatsBanner waterPoints={waterPoints} currentLanguage={currentLanguage} />

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
            <Filter className="h-4 w-4 text-emerald-400" />
            <span>Filter Water Sources:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Sources' },
              { id: 'critical_toxic', label: 'Critical Toxic', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
              { id: 'caution_turbid', label: 'Caution / Turbid', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
              { id: 'safe', label: 'Verified Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  statusFilter === f.id
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Map & Voice Bulletin (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Geospatial Map */}
            <div className="h-[480px] w-full">
              <MapWrapper
                waterPoints={filteredWaterPoints}
                selectedWaterPoint={selectedWaterPoint}
                onSelectWaterPoint={(pt) => setSelectedWaterPoint(pt)}
                concessions={concessions}
                showConcessions={showConcessions}
              />
            </div>

            {/* Voice Bulletin Component for Audio Accessibility */}
            <VoiceBulletinPlayer
              waterPoint={selectedWaterPoint}
              currentLanguage={currentLanguage}
              safeAlternative={safeAlternative}
            />

            {/* Quick Community Switcher Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2.5">
                Observed Ghana Mining Basins & Sources
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {waterPoints.slice(0, 4).map((pt) => {
                  const isCur = selectedWaterPoint.id === pt.id;
                  const isTox = pt.currentStatus === 'critical_toxic';
                  return (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedWaterPoint(pt)}
                      className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        isCur
                          ? 'bg-slate-800 border-emerald-500 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate">{pt.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{pt.community}</p>
                      </div>
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${isTox ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Water Point Inspection Card & Safe Alternative (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Water Point Full Detail Card */}
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

            {/* Safe Alternative Finder (If selected point is contaminated) */}
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

        {/* 4. Strategic Context & Hackathon Alignment Section */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Root Cause & Peace Building */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Droplets className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white">
                Galamsey & Water Peace
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                By replacing unverified rumors with decentralized, multi-witness water quality data, AsuoSafi defuses tensions between rural farming communities, mining task forces, and traditional authorities.
              </p>
            </div>

            {/* Pillar 2: Pan-African Scalability */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Globe2 className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white">
                Pan-African Scalability
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The core ledger schema seamlessly extends to artisanal mining basins across the DRC (coltan/cobalt in Katanga), South Africa (Zama Zama gold runoff in Gauteng), and Zimbabwe.
              </p>
            </div>

            {/* Pillar 3: Actionable Statutory Redress */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white">
                Statutory Redress Engine
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Information is only the start: 1-click legal petitions cite Section 24 of Ghana’s Act 522 and Act 995, mobilizing District Assemblies and EPA officers into real-world enforcement.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong className="text-slate-300">AsuoSafi</strong> • OSF × Andela Hackathon Capstone Project
          </p>
          <p className="text-[11px]">
            Information You Can Trust • Built for African Communities Affected by Artisanal Mining
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
