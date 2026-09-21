'use client';

import React from 'react';

interface RadialArcGaugeProps {
  percentage: number; // 0 to 100
  label: string;
  sublabel?: string;
  size?: number;
  variant?: 'emerald' | 'amber' | 'crimson' | 'dynamic';
}

export const RadialArcGauge: React.FC<RadialArcGaugeProps> = ({
  percentage,
  label,
  sublabel,
  size = 180,
  variant = 'dynamic',
}) => {
  // Total number of discrete tick segments along the 180-degree semicircle
  const totalTicks = 20;
  const activeTicks = Math.round((Math.min(100, Math.max(0, percentage)) / 100) * totalTicks);

  // Determine color theme based on score or variant
  const getColor = (tickIndex: number) => {
    if (variant === 'dynamic') {
      const ratio = tickIndex / totalTicks;
      if (ratio < 0.35) return '#b91c1c'; // Red
      if (ratio < 0.65) return '#b45309'; // Amber
      return '#15803d'; // Forest Green
    }
    if (variant === 'crimson') return '#b91c1c';
    if (variant === 'amber') return '#b45309';
    return '#15803d';
  };

  const getActiveColor = () => {
    if (percentage >= 70) return 'text-emerald-700 dark:text-emerald-400';
    if (percentage >= 40) return 'text-amber-700 dark:text-amber-400';
    return 'text-red-700 dark:text-red-400';
  };

  // Generate tick paths along a semicircle from 180deg to 0deg (left to right)
  const radius = 64;
  const center = 90;
  const tickLength = 12;

  return (
    <div className="flex flex-col items-center justify-center select-none" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size * 0.58 }}>
        <svg
          viewBox="0 0 180 110"
          className="w-full h-full overflow-visible"
        >
          {/* Semicircular Tick Arc */}
          {Array.from({ length: totalTicks }).map((_, index) => {
            // Angle goes from 180 deg (left) to 0 deg (right)
            const angleDeg = 180 - (index / (totalTicks - 1)) * 180;
            const angleRad = (angleDeg * Math.PI) / 180;

            const xInner = center + (radius - tickLength) * Math.cos(angleRad);
            const yInner = center - (radius - tickLength) * Math.sin(angleRad);
            const xOuter = center + radius * Math.cos(angleRad);
            const yOuter = center - radius * Math.sin(angleRad);

            const isActive = index < activeTicks;
            const color = getColor(index);

            return (
              <line
                key={index}
                x1={xInner}
                y1={yInner}
                x2={xOuter}
                y2={yOuter}
                stroke={isActive ? color : 'currentColor'}
                strokeWidth={4.5}
                strokeLinecap="round"
                className={`transition-all duration-300 ${
                  isActive
                    ? 'opacity-100'
                    : 'text-slate-200 dark:text-slate-800 opacity-60'
                }`}
              />
            );
          })}
        </svg>

        {/* Center Readout Text */}
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center text-center">
          <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums ${getActiveColor()}`}>
            {percentage}%
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {sublabel && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-1">
          {sublabel}
        </p>
      )}
    </div>
  );
};
