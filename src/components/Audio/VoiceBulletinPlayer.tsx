'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] p-4 text-[#1f2124] dark:text-white shadow-material dark:shadow-none space-y-3">
      
      {/* Top Dispatch Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-[8px] dark:rounded-[4px] border ${
            isPlaying
              ? 'bg-[#e8f0fe] dark:bg-[#281819] text-[#1a73e8] dark:text-[#fca5a5] border-[#d2e3fc] dark:border-[#541e22]'
              : 'bg-[#f1f3f4] dark:bg-[#141414] text-[#4b5563] dark:text-[#cbd5e1] border-[#e0e2e6] dark:border-[#2a2a2a]'
          }`}>
            <Radio className={`h-4 w-4 ${isPlaying ? 'text-[#1a73e8] dark:text-[#e50914]' : ''}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1f2124] dark:text-white font-sans">
                Civic Radio Voice Dispatch
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-[4px] bg-[#f1f3f4] dark:bg-[#141414] text-[#4b5563] dark:text-[#cbd5e1] border border-[#e0e2e6] dark:border-[#2a2a2a] font-semibold">
                {currentLanguage.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] mt-0.5">
              Low-literacy audio notice for <strong className="text-[#1f2124] dark:text-white font-bold">{waterPoint.name}</strong>
            </p>
          </div>
        </div>

        {/* Controls: Speed + Play/Stop */}
        <div className="flex items-center gap-2">
          
          {/* Playback speed toggle */}
          <button
            onClick={() => setPlaybackSpeed(prev => prev === 1.0 ? 0.85 : 1.0)}
            className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full dark:rounded-[4px] bg-[#f1f3f4] dark:bg-[#141414] hover:bg-[#e8eaed] dark:hover:bg-[#252525] text-xs font-mono text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white border border-[#e0e2e6] dark:border-[#2a2a2a] transition-colors cursor-pointer"
            title="Adjust speech rate (slower for clarity)"
          >
            {playbackSpeed}x Speed
          </button>

          {/* Primary Audio Toggle */}
          <button
            onClick={handleToggleSpeech}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full dark:rounded-[4px] text-xs font-semibold shadow-material dark:shadow-none transition-all active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-[#d93025] hover:bg-[#b80710] dark:bg-[#e50914] dark:hover:bg-[#b80710] text-white'
                : 'bg-[#1a73e8] hover:bg-[#1765cc] dark:bg-[#e50914] dark:hover:bg-[#b80710] text-white'
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

      {/* Waveform Studio Bar */}
      <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] px-3 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          {[4, 12, 8, 16, 10, 6, 14, 9, 15, 7, 11, 5].map((height, idx) => (
            <span
              key={idx}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-[#1a73e8] dark:bg-[#e50914]' : 'bg-[#e0e2e6] dark:bg-[#2a2a2a]'
              }`}
              style={{
                height: isPlaying ? `${height}px` : '4px',
              }}
            />
          ))}
          <span className="text-xs font-mono text-[#4b5563] dark:text-[#cbd5e1] ml-2">
            {isPlaying ? 'Broadcasting verified audio bulletin...' : 'Ready for playback in selected dialect'}
          </span>
        </div>

        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="text-xs text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
        >
          <span>{showTranscript ? 'Hide Script' : 'View Script'}</span>
          {showTranscript ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Transcript Accordion */}
      {showTranscript && (
        <div className="bg-[#f8f9fa] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[8px] dark:rounded-[4px] p-3 text-xs text-[#1f2124] dark:text-[#e2e8f0] space-y-1.5 animate-in fade-in duration-150">
          <span className="text-xs font-mono uppercase text-[#4b5563] dark:text-[#cbd5e1] font-bold block">
            Broadcast Transcript ({currentLanguage.toUpperCase()}):
          </span>
          <p className="leading-relaxed text-[#1f2124] dark:text-[#f1f5f9] italic">
            "{spokenText}"
          </p>
        </div>
      )}

    </div>
  );
};
