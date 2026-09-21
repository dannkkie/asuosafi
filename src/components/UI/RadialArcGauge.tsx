'use client';

import React from 'react';

interface RadialArcGaugeProps {
  percentage: number; // 0 to 100
  label: string;
  sublabel?: string;
  size?: number;
  variant?: 'emerald' | 'amber' | 'crimson' | 'dynamic' | 'opspulse' | 'exon';
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

  // Exon Spring Mint gradient palette (from dark emerald to glowing mint)
  const exonMintPalette = [
    '#047857', '#059669', '#059669', '#10b981', '#10b981',
    '#10b981', '#34d399', '#34d399', '#6ee7b7', '#a7f3d0'
  ];

  // Determine color theme based on score or variant
  const getColor = (tickIndex: number) => {
    if (variant === 'exon') {
      const idx = Math.min(exonMintPalette.length - 1, Math.floor((tickIndex / totalTicks) * exonMintPalette.length));
      return exonMintPalette[idx];
    }

    if (variant === 'opspulse') {
      const ratio = tickIndex / totalTicks;
      if (ratio < 0.35) return '#f97316'; // OpsPulse Warm Orange
      if (ratio < 0.75) return '#10b981'; // OpsPulse Lush Emerald
      return '#2563eb'; // OpsPulse Cobalt Blue
    }

    if (variant === 'dynamic') {
      if (percentage >= 65) {
        const idx = Math.min(exonMintPalette.length - 1, Math.floor((tickIndex / totalTicks) * exonMintPalette.length));
        return exonMintPalette[idx];
      }
      if (percentage >= 35) {
        return tickIndex < totalTicks * 0.5 ? '#f59e0b' : '#d97706'; // Golden Amber
      }
      return tickIndex < totalTicks * 0.4 ? '#ef4444' : '#dc2626'; // Alert Crimson
    }

    if (variant === 'crimson') return '#ef4444';
    if (variant === 'amber') return '#f59e0b';
    return '#10b981';
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
                stroke={isActive ? color : undefined}
                strokeWidth={5}
                strokeLinecap="round"
                className={`transition-all duration-300 ${
                  isActive
                    ? 'opacity-100'
                    : 'stroke-slate-200 dark:stroke-[#1E2536] opacity-70'
                }`}
              />
            );
          })}
        </svg>

        {/* Center Readout Text */}
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center text-center">
          <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums text-slate-900 dark:text-white">
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
