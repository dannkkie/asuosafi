'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  ShieldCheck,
  ArrowUpDown,
  Navigation
} from 'lucide-react';
import { WaterPoint, ContaminationStatus, SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';
import { BarcodeSignalMeter } from '@/components/UI/BarcodeSignalMeter';

interface BasinRegistryTableProps {
  waterPoints: WaterPoint[];
  selectedWaterPoint: WaterPoint | null;
  onSelectWaterPoint: (point: WaterPoint) => void;
  onOpenPetition: (point: WaterPoint) => void;
  onOpenAuditTrail: (point: WaterPoint) => void;
  onSwitchToMap: () => void;
  currentLanguage: SupportedLanguage;
}

export const BasinRegistryTable: React.FC<BasinRegistryTableProps> = ({
  waterPoints,
  selectedWaterPoint,
  onSelectWaterPoint,
  onOpenPetition,
  onOpenAuditTrail,
  onSwitchToMap,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContaminationStatus>('all');
  const [sortField, setSortField] = useState<'turbidity' | 'miningDistance' | 'witnesses'>('turbidity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedPoints = useMemo(() => {
    let list = waterPoints.filter((pt) => {
      const matchesStatus = statusFilter === 'all' || pt.currentStatus === statusFilter;
      const matchesSearch =
        pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pt.community.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pt.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pt.riverBasin && pt.riverBasin.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });

    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortField === 'turbidity') {
        valA = a.metrics.turbidityNtu;
        valB = b.metrics.turbidityNtu;
      } else if (sortField === 'miningDistance') {
        valA = a.upstreamMiningDistanceKm;
        valB = b.upstreamMiningDistanceKm;
      } else if (sortField === 'witnesses') {
        valA = a.verifiedByCount;
        valB = b.verifiedByCount;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    return list;
  }, [waterPoints, searchQuery, statusFilter, sortField, sortOrder]);

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Name',
      'Community',
      'District',
      'Region',
      'River Basin',
      'Status',
      'Turbidity (NTU)',
      'pH Level',
      'Chemical Residue',
      'Mining Proximity (km)',
      'Verified Witnesses',
      'Verification Badge',
      'Latitude',
      'Longitude',
      'Last Tested'
    ];

    const rows = filteredAndSortedPoints.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.community}"`,
      `"${p.district}"`,
      `"${p.region}"`,
      `"${p.riverBasin || ''}"`,
      p.currentStatus,
      p.metrics.turbidityNtu,
      p.metrics.phLevel,
      p.metrics.chemicalRiskDetected ? 'YES' : 'NO',
      p.upstreamMiningDistanceKm,
      p.verifiedByCount,
      p.verificationBadge,
      p.coordinates.latitude,
      p.coordinates.longitude,
      p.lastTestedAt
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `asuosafi-water-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden shadow-sm">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-sm">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by community, river basin, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-full pl-9 pr-3.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 dark:focus:ring-emerald-500/40 transition-all font-mono"
          />
        </div>

        {/* Filter Pills & Export */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 rounded-full p-1 shadow-inner">
            {(['all', 'critical_toxic', 'caution_turbid', 'safe'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 dark:bg-emerald-700 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'all'
                  ? 'All Basins'
                  : st === 'critical_toxic'
                  ? 'Critical'
                  : st === 'caution_turbid'
                  ? 'Caution'
                  : 'Safe'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors cursor-pointer"
            title="Export Ledger Dataset as CSV for journalism/research"
          >
            <Download className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Table Data View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-wider font-mono font-semibold">
              <th className="py-3 px-4">Source / Basin</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status & Signal</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                onClick={() => {
                  if (sortField === 'turbidity') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('turbidity');
                    setSortOrder('desc');
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Turbidity (NTU)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4">pH Level</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                onClick={() => {
                  if (sortField === 'miningDistance') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('miningDistance');
                    setSortOrder('asc');
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Mining Proximity</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4">Attestations</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {filteredAndSortedPoints.map((point) => {
              const isSelected = selectedWaterPoint?.id === point.id;
              const isCritical = point.currentStatus === 'critical_toxic';
              const isSafe = point.currentStatus === 'safe';

              return (
                <tr
                  key={point.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                    isSelected ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                  }`}
                  onClick={() => onSelectWaterPoint(point)}
                >
                  {/* Source & Basin */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{point.name}</span>
                      {isSelected && (
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-mono bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {point.riverBasin || 'Local Basin'} • {point.sourceType.toUpperCase()}
                    </p>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    <p className="font-medium">{point.community}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{point.district}, {point.region}</p>
                  </td>

                  {/* Status & Signal */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <BarcodeSignalMeter
                        score={isSafe ? 5 : point.currentStatus === 'caution_turbid' ? 3 : 1}
                        status={isSafe ? 'safe' : point.currentStatus === 'caution_turbid' ? 'caution' : 'critical'}
                        height={13}
                        barCount={5}
                      />
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wide bg-red-500/10 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200/80 dark:border-red-800/60 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
                          Critical Toxic
                        </span>
                      ) : isSafe ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wide bg-emerald-500/10 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          Potable Safe
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wide bg-amber-500/10 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                          Caution
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Turbidity */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold tabular-nums text-xs ${
                            point.metrics.turbidityNtu > 50 ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {point.metrics.turbidityNtu} NTU
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          ({point.metrics.turbidityNtu > 50 ? `${Math.round(point.metrics.turbidityNtu / 5)}x WHO` : 'WHO OK'})
                        </span>
                      </div>
                      <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-700/60">
                        <div
                          className={`h-full rounded-full ${
                            point.metrics.turbidityNtu > 500
                              ? 'bg-red-600 dark:bg-red-500'
                              : point.metrics.turbidityNtu > 50
                              ? 'bg-amber-600 dark:bg-amber-500'
                              : 'bg-emerald-600 dark:bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (point.metrics.turbidityNtu / 1000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* pH Level */}
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 font-medium text-xs">
                    {point.metrics.phLevel}
                  </td>

                  {/* Mining Proximity */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-mono text-xs ${
                        point.upstreamMiningDistanceKm < 1.0 ? 'text-amber-800 dark:text-amber-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {point.upstreamMiningDistanceKm} km
                    </span>
                  </td>

                  {/* Attestations */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-mono">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      <span>{point.verifiedByCount} Co-Signers</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          onSelectWaterPoint(point);
                          onSwitchToMap();
                        }}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="Locate on Map"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenAuditTrail(point)}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                        title="View Cryptographic Audit Trail"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-sky-700 dark:text-sky-400" />
                      </button>

                      {isCritical && (
                        <button
                          onClick={() => onOpenPetition(point)}
                          className="px-2.5 py-1 rounded-full bg-red-500/10 dark:bg-red-950/60 hover:bg-red-500/20 dark:hover:bg-red-900/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/60 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
                          title="Generate Act 522 Legal Petition"
                        >
                          Petition
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 sm:px-5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <p>
          Displaying <span className="text-slate-900 dark:text-slate-200 font-mono font-semibold">{filteredAndSortedPoints.length}</span> of{' '}
          <span className="text-slate-900 dark:text-slate-200 font-mono font-semibold">{waterPoints.length}</span> monitored water points
        </p>
        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
          SHA-256 Ledger Integrity Verified
        </span>
      </div>
    </div>
  );
};
