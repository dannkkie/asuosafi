'use client';

import React, { useState } from 'react';
import {
  X,
  Droplet,
  Camera,
  UserCheck,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  MapPin,
  Sparkles
} from 'lucide-react';
import { WaterPoint, WaterSourceType, SupportedLanguage } from '@/types';
import { generateAuditHash } from '@/utils/crypto';
import { TRANSLATIONS } from '@/utils/translations';

interface ReportWizardModalProps {
  onClose: () => void;
  onSubmitReport: (newPoint: WaterPoint) => void;
  currentLanguage: SupportedLanguage;
}

export const ReportWizardModal: React.FC<ReportWizardModalProps> = ({
  onClose,
  onSubmitReport,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [community, setCommunity] = useState('');
  const [district, setDistrict] = useState('Upper Denkyira East');
  const [region, setRegion] = useState<'Central' | 'Western' | 'Eastern' | 'Ashanti'>('Central');
  const [sourceType, setSourceType] = useState<WaterSourceType>('river');
  const [visualColor, setVisualColor] = useState<'milky' | 'yellow_orange' | 'brown' | 'clear'>('milky');
  const [turbidityNtu, setTurbidityNtu] = useState<number>(850);
  const [chemicalOdor, setChemicalOdor] = useState(true);
  const [upstreamExcavators, setUpstreamExcavators] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('Citizen Observer');
  const [witness1Name, setWitness1Name] = useState('Ebenezer T. (Assembly Member)');
  const [witness1Org, setWitness1Org] = useState('Local Unit Committee');

  // Handle Photo selection with mock compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const isContaminated = turbidityNtu > 50 || chemicalOdor || visualColor !== 'clear';
    const uniqueId = `wp-user-${Date.now().toString().slice(-4)}`;

    const newWaterPoint: WaterPoint = {
      id: uniqueId,
      name: name || `Community Water Source - ${community || 'Local'}`,
      riverBasin: `${district} Basin`,
      community: community || 'Offin Basin Settlement',
      district,
      region,
      sourceType,
      coordinates: {
        latitude: 5.9680 + (Math.random() - 0.5) * 0.05,
        longitude: -1.9800 + (Math.random() - 0.5) * 0.05,
      },
      currentStatus: isContaminated ? 'critical_toxic' : 'safe',
      lastTestedAt: new Date().toISOString(),
      metrics: {
        turbidityNtu,
        phLevel: isContaminated ? 5.5 : 7.2,
        chemicalRiskDetected: chemicalOdor,
        visualColor,
        coliformBacteria: isContaminated ? 'high' : 'none',
      },
      verifiedByCount: 2,
      verificationBadge: 'Community_MultiWitness',
      upstreamMiningDistanceKm: upstreamExcavators ? 0.6 : 3.5,
      description: `Citizen water audit submitted by ${isAnonymous ? 'Anonymous Whistleblower' : reporterName}. Color observed: ${visualColor}, odor: ${chemicalOdor ? 'Chemical scent' : 'None'}. Verified with ${witness1Name}.`,
      photoUrl: photoPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60',
    };

    // Simulate cryptographic stamp generation
    await generateAuditHash(JSON.stringify(newWaterPoint));

    setTimeout(() => {
      onSubmitReport(newWaterPoint);
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141414]/80 p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl dark:shadow-none overflow-hidden text-[#1f2124] dark:text-white animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="bg-[#f8f9fa] dark:bg-[#181818] border-b border-[#e0e2e6] dark:border-[#2a2a2a] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[8px] dark:rounded-[4px] bg-[#e8f0fe] dark:bg-[#181818] text-[#1a73e8] dark:text-white border border-[#d2e3fc] dark:border-[#2a2a2a]">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#1f2124] dark:text-white font-sans">
                {t.reportWaterIssue}
              </h3>
              <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] font-mono">
                Step {step} of 4 • Decentralized Field Audit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white hover:bg-[#e8eaed] dark:hover:bg-[#282828] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 h-1 bg-[#e0e2e6] dark:bg-[#2a2a2a]">
          <div className={`h-full transition-all ${step >= 1 ? 'bg-[#1a73e8] dark:bg-[#e50914]' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${step >= 2 ? 'bg-[#1a73e8] dark:bg-[#e50914]' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${step >= 3 ? 'bg-[#1a73e8] dark:bg-[#e50914]' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${step >= 4 ? 'bg-[#1a73e8] dark:bg-[#e50914]' : 'bg-transparent'}`} />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#1f2124] dark:text-white bg-white dark:bg-[#1f1f1f]">
          
          {/* STEP 1: Water Location & Source Type */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-[#1a73e8] dark:text-[#e50914] flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                1. Water Source Identification
              </h4>

              <div>
                <label className="text-xs text-[#4b5563] dark:text-[#cbd5e1] font-medium block mb-1.5">
                  Water Body / Source Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pra River - Dunkwa Upper Crossing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#141414] border border-[#dadce0] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-2.5 text-xs text-[#1f2124] dark:text-white placeholder-[#4b5563] dark:placeholder-[#94a3b8] focus:outline-none focus:border-[#1a73e8] dark:focus:border-[#e50914] focus:bg-white dark:focus:bg-[#141414] transition-colors font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#4b5563] dark:text-[#cbd5e1] font-medium block mb-1.5">
                    Town / Settlement *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dunkwa-on-Offin"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#141414] border border-[#dadce0] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-2.5 text-xs text-[#1f2124] dark:text-white placeholder-[#4b5563] dark:placeholder-[#94a3b8] focus:outline-none focus:border-[#1a73e8] dark:focus:border-[#e50914] focus:bg-white dark:focus:bg-[#141414] transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#4b5563] dark:text-[#cbd5e1] font-medium block mb-1.5">
                    District Assembly
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#141414] border border-[#dadce0] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-2.5 text-xs text-[#1f2124] dark:text-white focus:outline-none focus:border-[#1a73e8] dark:focus:border-[#e50914] cursor-pointer font-sans"
                  >
                    <option value="Upper Denkyira East">Upper Denkyira East (Central)</option>
                    <option value="Abuakwa South">Abuakwa South (Eastern)</option>
                    <option value="Prestea-Huni Valley">Prestea-Huni Valley (Western)</option>
                    <option value="Amansie South">Amansie South (Ashanti)</option>
                    <option value="Obuasi Municipal">Obuasi Municipal (Ashanti)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#4b5563] dark:text-[#cbd5e1] font-medium block mb-1.5">
                  Source Infrastructure Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['river', 'borehole', 'stream'] as WaterSourceType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSourceType(type)}
                      className={`p-2 rounded-[8px] dark:rounded-[4px] text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                        sourceType === type
                          ? 'bg-[#1a73e8] dark:bg-[#e50914] text-white border-[#1a73e8] dark:border-[#e50914] font-bold shadow-material dark:shadow-none'
                          : 'bg-[#f8f9fa] dark:bg-[#141414] text-[#4b5563] dark:text-[#cbd5e1] border-[#e0e2e6] dark:border-[#2a2a2a] hover:bg-[#e8eaed] dark:hover:bg-[#252525]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Physical & Chemical Sensory Parameters */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-[#1a73e8] dark:text-[#e50914] flex items-center gap-1.5">
                <Droplet className="h-4 w-4" />
                2. Physical Clarity & Chemical Sensors
              </h4>

              <div>
                <label className="text-xs text-[#4b5563] dark:text-[#cbd5e1] font-medium block mb-1.5">
                  Observed Water Color
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'milky', label: 'Milky Silt' },
                    { id: 'yellow_orange', label: 'Yellow Orange' },
                    { id: 'brown', label: 'Heavy Mud' },
                    { id: 'clear', label: 'Clear' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setVisualColor(c.id as any)}
                      className={`p-2.5 rounded-[8px] dark:rounded-[4px] text-xs font-medium border transition-all text-center cursor-pointer ${
                        visualColor === c.id
                          ? 'bg-[#1a73e8] dark:bg-[#e50914] text-white border-[#1a73e8] dark:border-[#e50914] font-bold shadow-material dark:shadow-none'
                          : 'bg-[#f8f9fa] dark:bg-[#141414] text-[#4b5563] dark:text-[#cbd5e1] border-[#e0e2e6] dark:border-[#2a2a2a] hover:bg-[#e8eaed] dark:hover:bg-[#252525]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-[#4b5563] dark:text-[#cbd5e1] font-medium">
                    Estimated Turbidity:{' '}
                    <span className="text-[#1a73e8] dark:text-[#e50914] font-mono font-bold">{turbidityNtu} NTU</span>
                  </label>
                  <span className="text-xs font-mono text-[#4b5563] dark:text-[#cbd5e1]">WHO Safe: &lt;5 NTU</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="1500"
                  step="10"
                  value={turbidityNtu}
                  onChange={(e) => setTurbidityNtu(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#e0e2e6] dark:bg-[#2a2a2a] rounded-[4px] appearance-none cursor-pointer accent-[#1a73e8] dark:accent-[#e50914]"
                />
                <div className="flex justify-between text-xs font-mono text-[#4b5563] dark:text-[#cbd5e1] mt-1">
                  <span>Potable (&lt;5 NTU)</span>
                  <span>Moderate (50–200)</span>
                  <span className="text-[#d93025] dark:text-[#e50914] font-bold">Critical Hazard (&gt;800)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#e0e2e6] dark:border-[#2a2a2a]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chemicalOdor}
                    onChange={(e) => setChemicalOdor(e.target.checked)}
                    className="rounded-[4px] bg-white dark:bg-[#141414] border-[#dadce0] dark:border-[#2a2a2a] text-[#1a73e8] dark:text-[#e50914] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#1f2124] dark:text-[#f1f5f9]">
                    Chemical smell or fuel odor detected near water surface
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={upstreamExcavators}
                    onChange={(e) => setUpstreamExcavators(e.target.checked)}
                    className="rounded-[4px] bg-white dark:bg-[#141414] border-[#dadce0] dark:border-[#2a2a2a] text-[#1a73e8] dark:text-[#e50914] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#1f2124] dark:text-[#f1f5f9]">
                    Active mining excavators or Changfa wash plants observed upstream
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Photo Evidence Upload & EXIF Verification */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-[#1a73e8] dark:text-[#e50914] flex items-center gap-1.5">
                <Camera className="h-4 w-4" />
                3. Photo Evidence & EXIF Verification
              </h4>

              <div className="border border-dashed border-[#dadce0] dark:border-[#2a2a2a] hover:border-[#1a73e8] dark:hover:border-[#e50914] rounded-[12px] dark:rounded-[6px] p-6 text-center bg-[#f8f9fa] dark:bg-[#141414] transition-colors">
                {photoPreview ? (
                  <div className="space-y-3">
                    <img
                      src={photoPreview}
                      alt="Water preview"
                      className="max-h-40 mx-auto rounded-[8px] dark:rounded-[4px] object-cover border border-[#e0e2e6] dark:border-[#2a2a2a]"
                    />
                    <p className="text-xs text-[#1e8e3e] dark:text-[#e50914] font-mono font-medium flex items-center justify-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Client-side compressed & verified
                    </p>
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="text-xs text-[#d93025] dark:text-[#e50914] hover:underline cursor-pointer"
                    >
                      Remove and re-upload
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="h-8 w-8 text-[#4b5563] dark:text-[#cbd5e1] mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#1f2124] dark:text-white">
                      Snap or upload photo of the water point
                    </p>
                    <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] mt-1">
                      GPS coordinates and timestamps are automatically verified to prevent false reporting
                    </p>
                    <label className="mt-3 inline-block px-4 py-1.5 rounded-full dark:rounded-[4px] text-xs font-semibold bg-white dark:bg-[#1f1f1f] hover:bg-[#f1f3f4] dark:hover:bg-[#2a2a2a] text-[#1f2124] dark:text-white cursor-pointer border border-[#dadce0] dark:border-[#2a2a2a] shadow-material dark:shadow-none transition-colors">
                      Browse File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Multi-Witness Attestation & Whistleblower Privacy */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-[#1a73e8] dark:text-[#e50914] flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                4. Multi-Witness Attestation & Whistleblower Privacy
              </h4>

              {/* Anonymous Whistleblower Switch */}
              <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#f9ab00] dark:text-[#e50914] shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-[#1f2124] dark:text-white block">
                        {t.anonymousToggle}
                      </span>
                      <span className="text-xs text-[#4b5563] dark:text-[#cbd5e1] block">
                        Protects your identity under Ghana Whistleblower Protection Act, 2006 (Act 720)
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded-[4px] bg-white dark:bg-[#1f1f1f] border-[#dadce0] dark:border-[#2a2a2a] text-[#1a73e8] dark:text-[#e50914] focus:ring-0 cursor-pointer"
                  />
                </div>

                {!isAnonymous && (
                  <div className="mt-3 pt-3 border-t border-[#e0e2e6] dark:border-[#2a2a2a]">
                    <label className="text-xs text-[#4b5563] dark:text-[#cbd5e1] block mb-1">
                      Observer Name & Official Role
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Kwabena Mensah (Clinic Nurse)"
                      className="w-full bg-white dark:bg-[#1f1f1f] border border-[#dadce0] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-2 text-xs text-[#1f2124] dark:text-white placeholder-[#4b5563] dark:placeholder-[#94a3b8] focus:outline-none focus:border-[#1a73e8] dark:focus:border-[#e50914] font-sans"
                    />
                  </div>
                )}
              </div>

              {/* Co-Witness Attestation */}
              <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-3.5 space-y-2">
                <span className="text-xs font-semibold text-[#1f2124] dark:text-white flex items-center gap-1.5 font-sans">
                  <UserCheck className="h-4 w-4 text-[#1e8e3e] dark:text-[#e50914]" />
                  Independent Corroborating Witness (Consensus Gate)
                </span>
                <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1]">
                  Required to prevent false alerts: add an Assembly member, local elder, teacher, or water committee member who observed this condition.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    type="text"
                    required
                    placeholder="Witness Name"
                    value={witness1Name}
                    onChange={(e) => setWitness1Name(e.target.value)}
                    className="bg-white dark:bg-[#1f1f1f] border border-[#dadce0] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-2 text-xs text-[#1f2124] dark:text-white placeholder-[#4b5563] dark:placeholder-[#94a3b8] focus:outline-none focus:border-[#1a73e8] dark:focus:border-[#e50914] font-sans"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Organization / Office"
                    value={witness1Org}
                    onChange={(e) => setWitness1Org(e.target.value)}
                    className="bg-white dark:bg-[#1f1f1f] border border-[#dadce0] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-2 text-xs text-[#1f2124] dark:text-white placeholder-[#4b5563] dark:placeholder-[#94a3b8] focus:outline-none focus:border-[#1a73e8] dark:focus:border-[#e50914] font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Navigation Controls */}
          <div className="pt-4 border-t border-[#e0e2e6] dark:border-[#2a2a2a] flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full dark:rounded-[4px] text-xs font-medium bg-[#f1f3f4] dark:bg-[#141414] hover:bg-[#e8eaed] dark:hover:bg-[#252525] text-[#4b5563] dark:text-[#cbd5e1] border border-[#e0e2e6] dark:border-[#2a2a2a] transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full dark:rounded-[4px] text-xs font-semibold bg-[#1a73e8] hover:bg-[#1765cc] dark:bg-[#e50914] dark:hover:bg-[#b80710] text-white shadow-material dark:shadow-none transition-all cursor-pointer active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full dark:rounded-[4px] text-xs font-semibold bg-[#1a73e8] hover:bg-[#1765cc] dark:bg-[#e50914] dark:hover:bg-[#b80710] text-white shadow-material dark:shadow-none transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Hashing to Ledger...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{t.submitAudit}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
