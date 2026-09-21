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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-sans">
                {t.reportWaterIssue}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Step {step} of 4 • Decentralized Field Audit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 h-1 bg-slate-100 dark:bg-slate-800">
          <div className={`h-full transition-all ${step >= 1 ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${step >= 2 ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${step >= 3 ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${step >= 4 ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-transparent'}`} />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-[#121927]">
          
          {/* STEP 1: Water Location & Source Type */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                1. Water Source Identification
              </h4>

              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium block mb-1.5">
                  Water Body / Source Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pra River - Dunkwa Upper Crossing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-medium block mb-1.5">
                    Town / Settlement *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dunkwa-on-Offin"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-medium block mb-1.5">
                    District Assembly
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 cursor-pointer"
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
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium block mb-1.5">
                  Source Infrastructure Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['river', 'borehole', 'stream'] as WaterSourceType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSourceType(type)}
                      className={`p-2 rounded-lg text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                        sourceType === type
                          ? 'bg-slate-900 dark:bg-emerald-700 text-white border-slate-900 dark:border-emerald-700 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
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
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <Droplet className="h-4 w-4" />
                2. Physical Clarity & Chemical Sensors
              </h4>

              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium block mb-1.5">
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
                      className={`p-2.5 rounded-lg text-xs font-medium border transition-all text-center cursor-pointer ${
                        visualColor === c.id
                          ? 'bg-amber-800 dark:bg-amber-700 text-white border-amber-900 dark:border-amber-600 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Estimated Turbidity:{' '}
                    <span className="text-amber-800 dark:text-amber-400 font-mono font-bold">{turbidityNtu} NTU</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">WHO Safe: &lt;5 NTU</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="1500"
                  step="10"
                  value={turbidityNtu}
                  onChange={(e) => setTurbidityNtu(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                  <span>Potable (&lt;5 NTU)</span>
                  <span>Moderate (50–200)</span>
                  <span className="text-red-700 dark:text-red-400 font-bold">Critical Hazard (&gt;800)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chemicalOdor}
                    onChange={(e) => setChemicalOdor(e.target.checked)}
                    className="rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-emerald-700 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    Chemical smell or fuel odor detected near water surface
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={upstreamExcavators}
                    onChange={(e) => setUpstreamExcavators(e.target.checked)}
                    className="rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-emerald-700 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    Active mining excavators or Changfa wash plants observed upstream
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Photo Evidence Upload & EXIF Verification */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <Camera className="h-4 w-4" />
                3. Photo Evidence & EXIF Verification
              </h4>

              <div className="border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/40 transition-colors">
                {photoPreview ? (
                  <div className="space-y-3">
                    <img
                      src={photoPreview}
                      alt="Water preview"
                      className="max-h-40 mx-auto rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-medium flex items-center justify-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Client-side compressed & verified
                    </p>
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="text-xs text-red-700 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      Remove and re-upload
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="h-8 w-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Snap or upload photo of the water point
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      GPS coordinates and timestamps are automatically verified to prevent false reporting
                    </p>
                    <label className="mt-3 inline-block px-4 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
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
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                4. Multi-Witness Attestation & Whistleblower Privacy
              </h4>

              {/* Anonymous Whistleblower Switch */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                        {t.anonymousToggle}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        Protects your identity under Ghana Whistleblower Protection Act, 2006 (Act 720)
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-emerald-700 focus:ring-0 cursor-pointer"
                  />
                </div>

                {!isAnonymous && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                      Observer Name & Official Role
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Kwabena Mensah (Clinic Nurse)"
                      className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Co-Witness Attestation */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  Independent Corroborating Witness (Consensus Gate)
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Required to prevent false alerts: add an Assembly member, local elder, teacher, or water committee member who observed this condition.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    type="text"
                    required
                    placeholder="Witness Name"
                    value={witness1Name}
                    onChange={(e) => setWitness1Name(e.target.value)}
                    className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Organization / Office"
                    value={witness1Org}
                    onChange={(e) => setWitness1Org(e.target.value)}
                    className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Navigation Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
