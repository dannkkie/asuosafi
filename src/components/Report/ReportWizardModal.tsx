'use client';

import React, { useState } from 'react';
import {
  X,
  Droplet,
  Camera,
  UserCheck,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  MapPin
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
  const [reporterRole, setReporterRole] = useState('community_monitor');
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

    const isContaminated = turbidityNtu > 100 || chemicalOdor || visualColor !== 'clear';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {t.reportWaterIssue}
              </h3>
              <p className="text-xs text-slate-400">
                Step {step} of 4 • Decentralized Multi-Witness Audit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 h-1 bg-slate-800">
          <div className={`h-full transition-all ${step >= 1 ? 'bg-emerald-500' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${step >= 2 ? 'bg-emerald-500' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${step >= 3 ? 'bg-emerald-500' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${step >= 4 ? 'bg-emerald-500' : 'bg-transparent'}`} />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200 bg-slate-950/60">
          
          {/* STEP 1: Water Location & Source Type */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                1. Water Source Identification
              </h4>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Water Body / Source Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pra River - Dunkwa Upper Crossing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Town / Community *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dunkwa-on-Offin"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    District Assembly
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
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
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Source Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['river', 'borehole', 'stream'] as WaterSourceType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSourceType(type)}
                      className={`p-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                        sourceType === type
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
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
              <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <Droplet className="h-4 w-4" />
                2. Physical Clarity & Observations
              </h4>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Observed Water Color
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'milky', label: 'Milky Yellow' },
                    { id: 'yellow_orange', label: 'Yellow Orange' },
                    { id: 'brown', label: 'Brown Silt' },
                    { id: 'clear', label: 'Clear' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setVisualColor(c.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        visualColor === c.id
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-300 font-semibold">
                    Estimated Turbidity: <span className="text-amber-400 font-bold">{turbidityNtu} NTU</span>
                  </label>
                  <span className="text-[10px] text-slate-400">WHO Limit: &lt;5 NTU</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="1500"
                  step="10"
                  value={turbidityNtu}
                  onChange={(e) => setTurbidityNtu(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Clean (&lt;5 NTU)</span>
                  <span>Moderate (50-200)</span>
                  <span className="text-red-400 font-bold">Severe Galamsey (&gt;800 NTU)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chemicalOdor}
                    onChange={(e) => setChemicalOdor(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    Chemical smell or fuel odor detected near water surface
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={upstreamExcavators}
                    onChange={(e) => setUpstreamExcavators(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    Active mining excavators or Changfa wash plants observed upstream
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Photo Evidence Upload & EXIF Verification */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <Camera className="h-4 w-4" />
                3. Photo Evidence & EXIF Verification
              </h4>

              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-900/50 transition-colors">
                {photoPreview ? (
                  <div className="space-y-3">
                    <img
                      src={photoPreview}
                      alt="Water preview"
                      className="max-h-40 mx-auto rounded-xl object-cover border border-slate-700"
                    />
                    <p className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Client-side compressed & ready for ledger
                    </p>
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove and re-upload
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-200">
                      Snap or upload photo of the water point
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      GPS coordinates and timestamps are automatically verified to prevent false reporting
                    </p>
                    <label className="mt-3 inline-block px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer border border-slate-700">
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
              <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                4. Multi-Witness Attestation & Protection
              </h4>

              {/* Anonymous Whistleblower Switch */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {t.anonymousToggle}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Protects your identity from local mining cartels and rogue operators
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-5 w-5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                {!isAnonymous && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Observer Name & Role
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Kwabena Mensah (Clinic Nurse)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                )}
              </div>

              {/* Co-Witness Attestation */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-slate-200 block flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  Independent Corroborating Witness (Consensus Gate)
                </span>
                <p className="text-[10px] text-slate-400">
                  Required to prevent false alerts: add an Assembly member, local elder, teacher, or water committee member who observed this condition.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    type="text"
                    required
                    placeholder="Witness Name"
                    value={witness1Name}
                    onChange={(e) => setWitness1Name(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Organization / Office"
                    value={witness1Org}
                    onChange={(e) => setWitness1Org(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all cursor-pointer active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
