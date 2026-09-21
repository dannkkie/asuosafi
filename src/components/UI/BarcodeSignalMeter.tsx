'use client';

import React from 'react';

interface BarcodeSignalMeterProps {
  score: number; // 1 to 5 (or percentage 0 to 100)
  maxScore?: number;
  status?: 'safe' | 'caution' | 'critical' | 'auto';
  height?: number;
  barCount?: number;
}

export const BarcodeSignalMeter: React.FC<BarcodeSignalMeterProps> = ({
  score,
  maxScore = 5,
  status = 'auto',
  height = 14,
  barCount = 5,
}) => {
  // Normalize score between 0 and barCount
  const normalizedValue = score > maxScore ? Math.round((score / 100) * barCount) : Math.round(score);
  const activeCount = Math.max(0, Math.min(barCount, normalizedValue));

  const getBarColor = (index: number) => {
    const isActive = index < activeCount;
    if (!isActive) return 'bg-slate-200 dark:bg-slate-800';

    if (status === 'safe') return 'bg-emerald-600 dark:bg-emerald-500';
    if (status === 'caution') return 'bg-amber-600 dark:bg-amber-500';
    if (status === 'critical') return 'bg-red-600 dark:bg-red-500';

    // Auto coloring based on active ratio
    const ratio = activeCount / barCount;
    if (ratio >= 0.7) return 'bg-emerald-600 dark:bg-emerald-500';
    if (ratio >= 0.4) return 'bg-amber-600 dark:bg-amber-500';
    return 'bg-red-600 dark:bg-red-500';
  };

  return (
    <div className="inline-flex items-center gap-1 select-none" title={`Safety Signal: ${activeCount}/${barCount}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <span
          key={i}
          className={`w-1 rounded-full transition-all duration-200 ${getBarColor(i)}`}
          style={{
            height: `${height}px`,
          }}
        />
      ))}
    </div>
  );
};
