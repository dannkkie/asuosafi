'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Volume2, VolumeX, ChevronDown, ChevronUp, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { WaterPoint, SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';

interface VoiceBulletinPlayerProps {
  waterPoint: WaterPoint | null;
  currentLanguage: SupportedLanguage;
  safeAlternative?: WaterPoint | null;
}

export const VoiceBulletinPlayer: React.FC<VoiceBulletinPlayerProps> = ({
  waterPoint,
  currentLanguage,
  safeAlternative,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const t = TRANSLATIONS[currentLanguage];

  // Stop speech when water point or language changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [waterPoint, currentLanguage]);

  if (!waterPoint) return null;

  const generateSpokenText = (): string => {
    if (currentLanguage === 'twi') {
      if (waterPoint.currentStatus === 'critical_toxic') {
        return `Kɔkɔbɔ kɛseɛ fi AsuoSafi: ${waterPoint.name} a ɛwɔ ${waterPoint.community} no asɛe koraa esiane galamsey nti. Nsuo no fi tebea yɛ boro ahyɛnsodeɛ ahanu. Nnom na nnoa aduane. Kɔ nsuo pa a ɛbɛn wo no nkyɛn wɔ ${safeAlternative ? safeAlternative.name : 'borɔhool a ɛbɛn wo'}.`;
      } else {
        return `Amanneɛbɔ fi AsuoSafi: ${waterPoint.name} a ɛwɔ ${waterPoint.community} no yɛ nsuo pa a Ghana Water Company ahwɛ so. Ɛyɛ ma nom.`;
      }
    } else if (currentLanguage === 'ewe') {
      if (waterPoint.currentStatus === 'critical_toxic') {
        return `Nuxɔlɔ̃ame tso AsuoSafi: Tsi si le ${waterPoint.name} me kɔ o. Galamsey gblẽ tsi la katã. Mègakɔe ano o. Yi tsi nyui si le ${safeAlternative ? safeAlternative.name : 'tsi vudo nyui'} gbɔ.`;
      } else {
        return `Nyatakaka tso AsuoSafi: ${waterPoint.name} le nyuie na nono. Ghana Water Company kpɔ egbɔ.`;
      }
    } else if (currentLanguage === 'hausa') {
      if (waterPoint.currentStatus === 'critical_toxic') {
        return `Gargadi daga AsuoSafi: Ruwan ${waterPoint.name} a garin ${waterPoint.community} ya gurbace sakamakon aikin galamsey. Kada ku sha wannan ruwan. Ku je zuwa ${safeAlternative ? safeAlternative.name : 'rijiyar burtsatse mai tsabta'}.`;
      } else {
        return `Sanarwa daga AsuoSafi: Ruwan ${waterPoint.name} yana da tsabta sosai kuma yana da kyau don sha.`;
      }
    }

    // Default English
    if (waterPoint.currentStatus === 'critical_toxic') {
      return `Emergency Water Advisory from AsuoSafi: ${waterPoint.name} in ${waterPoint.community} is critically contaminated with toxic galamsey mining silt. Measured turbidity is ${waterPoint.metrics.turbidityNtu} NTU, which is dangerous. Do not drink, cook, or bathe with this water. Safe alternative drinking water is located at ${safeAlternative ? safeAlternative.name : 'the nearest verified borehole'}.`;
    } else {
      return `Water Status Notice from AsuoSafi: ${waterPoint.name} in ${waterPoint.community} is verified safe for domestic use and drinking, tested at ${waterPoint.metrics.turbidityNtu} NTU by the Ghana Water Company Limited.`;
    }
  };

  const spokenText = generateSpokenText();

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      alert("Audio speech synthesis is not supported on this browser device.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="bg-[#0E1524] border border-white/[0.08] rounded-xl p-4 text-slate-100 shadow-xl space-y-3">
      
      {/* Top Dispatch Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${
            isPlaying
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-[#141D2D] text-slate-400 border-white/[0.06]'
          }`}>
            <Radio className={`h-4 w-4 ${isPlaying ? 'animate-pulse text-emerald-400' : ''}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
                Civic Radio Voice Dispatch
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                {currentLanguage.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Low-literacy audio notice for <strong className="text-slate-300">{waterPoint.name}</strong>
            </p>
          </div>
        </div>

        {/* Controls: Speed + Play/Stop */}
        <div className="flex items-center gap-2">
          
          {/* Playback speed toggle */}
          <button
            onClick={() => setPlaybackSpeed(prev => prev === 1.0 ? 0.85 : 1.0)}
            className="hidden sm:inline-flex items-center px-2 py-1 rounded bg-[#141D2D] hover:bg-[#1B263B] text-[10px] font-mono text-slate-300 border border-white/[0.06] transition-colors"
            title="Adjust speech rate (slower for clarity)"
          >
            {playbackSpeed}x Speed
          </button>

          {/* Primary Audio Toggle */}
          <button
            onClick={handleToggleSpeech}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="h-4 w-4" />
                <span>Stop Broadcast</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" />
                <span>Play Voice Bulletin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animated Waveform Studio Bar */}
      <div className="bg-[#141D2D] border border-white/[0.04] rounded-lg px-3 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          {[4, 12, 8, 16, 10, 6, 14, 9, 15, 7, 11, 5].map((height, idx) => (
            <span
              key={idx}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
              }`}
              style={{
                height: isPlaying ? `${height}px` : '4px',
                animationDelay: `${idx * 80}ms`
              }}
            />
          ))}
          <span className="text-[11px] font-mono text-slate-400 ml-2">
            {isPlaying ? 'Broadcasting audio bulletin...' : 'Ready for local playback'}
          </span>
        </div>

        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono transition-colors"
        >
          <span>{showTranscript ? 'Hide Script' : 'View Script'}</span>
          {showTranscript ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Transcript Accordion */}
      {showTranscript && (
        <div className="bg-[#0B0F17] border border-white/[0.06] rounded-lg p-3 text-xs text-slate-300 space-y-1.5 animate-in fade-in duration-150">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">
            Broadcast Transcript ({currentLanguage.toUpperCase()}):
          </span>
          <p className="leading-relaxed text-slate-200 italic">
            "{spokenText}"
          </p>
        </div>
      )}

    </div>
  );
};
