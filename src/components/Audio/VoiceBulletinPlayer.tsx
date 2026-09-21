'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';
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

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      alert("Audio synthesis is not supported on this browser device.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = generateSpokenText();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 text-white shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${isPlaying ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
            <Radio className={`h-4 w-4 ${isPlaying ? 'animate-pulse text-emerald-400' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                {t.audioWarningTitle}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {currentLanguage.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              {waterPoint.name} — {waterPoint.community}
            </p>
          </div>
        </div>

        {/* Play/Pause button */}
        <button
          onClick={handleToggleSpeech}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40'
          }`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="h-4 w-4" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              <span>{t.audioPlayPrompt}</span>
            </>
          )}
        </button>
      </div>

      {/* Audio Waveform visualization indicator when playing */}
      {isPlaying && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs text-emerald-300">
          <div className="flex items-center gap-1">
            <span className="h-2 w-1 bg-emerald-400 animate-bounce rounded-full" style={{ animationDelay: '0ms' }} />
            <span className="h-4 w-1 bg-emerald-400 animate-bounce rounded-full" style={{ animationDelay: '150ms' }} />
            <span className="h-3 w-1 bg-emerald-400 animate-bounce rounded-full" style={{ animationDelay: '300ms' }} />
            <span className="h-5 w-1 bg-emerald-400 animate-bounce rounded-full" style={{ animationDelay: '75ms' }} />
            <span className="h-2 w-1 bg-emerald-400 animate-bounce rounded-full" style={{ animationDelay: '220ms' }} />
            <span className="ml-2 text-[11px] font-medium">{t.audioPlaying}</span>
          </div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            Audio Accessibility Mode
          </span>
        </div>
      )}
    </div>
  );
};
