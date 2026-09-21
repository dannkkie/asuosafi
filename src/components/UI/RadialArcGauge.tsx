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

  // Google Material & Netflix Cinematic palette
  const getColor = (tickIndex: number) => {
    const ratio = tickIndex / totalTicks;

    if (variant === 'crimson') return '#d93025';
    if (variant === 'amber') return '#f9ab00';
    if (variant === 'emerald') return '#1e8e3e';

    if (percentage >= 65) {
      // Safe / Potable: Google Green to Blue gradient
      return ratio < 0.6 ? '#1e8e3e' : '#1a73e8';
    }
    if (percentage >= 35) {
      // Moderate Caution: Google Amber / Gold
      return ratio < 0.5 ? '#f9ab00' : '#ea8600';
    }
    // Critical: Netflix Red / Google Red
    return ratio < 0.5 ? '#d93025' : '#b80710';
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

            const xInner = Number((center + (radius - tickLength) * Math.cos(angleRad)).toFixed(2));
            const yInner = Number((center - (radius - tickLength) * Math.sin(angleRad)).toFixed(2));
            const xOuter = Number((center + radius * Math.cos(angleRad)).toFixed(2));
            const yOuter = Number((center - radius * Math.sin(angleRad)).toFixed(2));

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
                    : 'stroke-[#e0e2e6] dark:stroke-[#2a2a2a] opacity-70'
                }`}
              />
            );
          })}
        </svg>

        {/* Center Readout Text */}
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center text-center">
          <span className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight tabular-nums text-[#1f2124] dark:text-white">
            {percentage}%
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-[#4b5563] dark:text-[#cbd5e1] font-bold mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {sublabel && (
        <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] text-center mt-1.5 font-medium">
          {sublabel}
        </p>
      )}
    </div>
  );
};
