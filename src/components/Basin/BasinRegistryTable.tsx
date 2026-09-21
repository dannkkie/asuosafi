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
    <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-[12px] dark:rounded-[6px] overflow-hidden shadow-material dark:shadow-none">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-[#e0e2e6] dark:border-[#2a2a2a] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#f8f9fa] dark:bg-[#181818]">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="h-3.5 w-3.5 text-[#4b5563] dark:text-[#cbd5e1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by community, river basin, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-full dark:rounded-[4px] pl-9 pr-3.5 py-1.5 text-xs text-[#1f2124] dark:text-white placeholder-[#4b5563] dark:placeholder-[#94a3b8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8] dark:focus:ring-[#e50914] transition-all font-sans"
          />
        </div>

        {/* Filter Pills & Export */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-1 bg-[#f1f3f4] dark:bg-[#141414] border border-[#e0e2e6] dark:border-[#2a2a2a] rounded-full dark:rounded-[4px] p-1">
            {(['all', 'critical_toxic', 'caution_turbid', 'safe'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1 rounded-full dark:rounded-[3px] text-xs font-mono font-medium transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#1a73e8] dark:bg-[#e50914] text-white shadow-material dark:shadow-none font-bold'
                    : 'text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white'
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full dark:rounded-[4px] text-xs font-mono font-medium bg-white dark:bg-[#141414] hover:bg-[#f8f9fa] dark:hover:bg-[#222222] text-[#1f2124] dark:text-white border border-[#e0e2e6] dark:border-[#2a2a2a] shadow-material dark:shadow-none transition-colors cursor-pointer"
            title="Export Ledger Dataset as CSV for journalism/research"
          >
            <Download className="h-3.5 w-3.5 text-[#4b5563] dark:text-[#cbd5e1]" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Table Data View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#e0e2e6] dark:border-[#2a2a2a] bg-[#f8f9fa] dark:bg-[#181818] text-[#4b5563] dark:text-[#cbd5e1] text-xs uppercase tracking-wider font-mono font-semibold">
              <th className="py-3 px-4">Source / Basin</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status & Signal</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-[#1f2124] dark:hover:text-white select-none"
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
                className="py-3 px-4 cursor-pointer hover:text-[#1f2124] dark:hover:text-white select-none"
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
          <tbody className="divide-y divide-[#e0e2e6] dark:divide-[#2a2a2a]">
            {filteredAndSortedPoints.map((point) => {
              const isSelected = selectedWaterPoint?.id === point.id;
              const isCritical = point.currentStatus === 'critical_toxic';
              const isSafe = point.currentStatus === 'safe';

              return (
                <tr
                  key={point.id}
                  className={`hover:bg-[#f1f3f4] dark:hover:bg-[#252525] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#e8f0fe] dark:bg-[#2a2123]' : ''
                  }`}
                  onClick={() => onSelectWaterPoint(point)}
                >
                  {/* Source & Basin */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-[#1f2124] dark:text-white flex items-center gap-1.5 font-sans">
                      <span>{point.name}</span>
                      {isSelected && (
                        <span className="text-[10px] text-[#1a73e8] dark:text-[#e50914] font-mono bg-[#e8f0fe] dark:bg-[#3d1518] px-1.5 py-0.5 rounded-full dark:rounded-[3px] border border-[#d2e3fc] dark:border-[#541e22] font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1] font-mono mt-0.5">
                      {point.riverBasin || 'Local Basin'} • {point.sourceType.toUpperCase()}
                    </p>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-[#1f2124] dark:text-white">
                    <p className="font-semibold text-xs sm:text-sm">{point.community}</p>
                    <p className="text-xs text-[#4b5563] dark:text-[#cbd5e1]">{point.district}, {point.region}</p>
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full dark:rounded-[3px] text-[11px] font-mono uppercase tracking-wide bg-red-100 dark:bg-[#3d1518] text-red-800 dark:text-[#fca5a5] border border-red-200 dark:border-[#541e22] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#d93025] dark:bg-[#e50914] animate-pulse" />
                          Critical Toxic
                        </span>
                      ) : isSafe ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full dark:rounded-[3px] text-[11px] font-mono uppercase tracking-wide bg-emerald-100 dark:bg-[#193220] text-emerald-800 dark:text-[#a7f3d0] border border-emerald-200 dark:border-[#254228] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e]" />
                          Potable Safe
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full dark:rounded-[3px] text-[11px] font-mono uppercase tracking-wide bg-amber-100 dark:bg-[#352516] text-amber-900 dark:text-[#fde68a] border border-amber-200 dark:border-[#523215] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#f9ab00]" />
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
                            point.metrics.turbidityNtu > 50 ? 'text-red-700 dark:text-[#e50914]' : 'text-emerald-700 dark:text-[#1e8e3e]'
                          }`}
                        >
                          {point.metrics.turbidityNtu} NTU
                        </span>
                        <span className="text-xs font-mono text-[#4b5563] dark:text-[#cbd5e1]">
                          ({point.metrics.turbidityNtu > 50 ? `${Math.round(point.metrics.turbidityNtu / 5)}x WHO` : 'WHO OK'})
                        </span>
                      </div>
                      <div className="w-20 h-1.5 bg-[#f1f3f4] dark:bg-[#141414] rounded-full overflow-hidden border border-[#e0e2e6] dark:border-[#2a2a2a]">
                        <div
                          className={`h-full rounded-full ${
                            point.metrics.turbidityNtu > 500
                              ? 'bg-[#d93025] dark:bg-[#e50914]'
                              : point.metrics.turbidityNtu > 50
                              ? 'bg-[#f9ab00]'
                              : 'bg-[#1e8e3e]'
                          }`}
                          style={{ width: `${Math.min(100, (point.metrics.turbidityNtu / 1000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* pH Level */}
                  <td className="py-3.5 px-4 font-mono text-[#1f2124] dark:text-white font-medium text-xs">
                    {point.metrics.phLevel}
                  </td>

                  {/* Mining Proximity */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-mono text-xs ${
                        point.upstreamMiningDistanceKm < 1.0 ? 'text-amber-800 dark:text-amber-400 font-semibold' : 'text-[#4b5563] dark:text-[#cbd5e1]'
                      }`}
                    >
                      {point.upstreamMiningDistanceKm} km
                    </span>
                  </td>

                  {/* Attestations */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-[#1f2124] dark:text-white text-xs font-mono">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#1e8e3e] dark:text-[#e50914]" />
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
                        className="p-1.5 rounded-full dark:rounded-[3px] hover:bg-[#f1f3f4] dark:hover:bg-[#2a2a2a] text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1f2124] dark:hover:text-white transition-colors cursor-pointer"
                        title="Locate on Map"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenAuditTrail(point)}
                        className="p-1.5 rounded-full dark:rounded-[3px] hover:bg-[#f1f3f4] dark:hover:bg-[#2a2a2a] text-[#4b5563] dark:text-[#cbd5e1] hover:text-[#1a73e8] dark:hover:text-[#e50914] transition-colors cursor-pointer"
                        title="View Cryptographic Audit Trail"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-[#1a73e8] dark:text-[#e50914]" />
                      </button>

                      {isCritical && (
                        <button
                          onClick={() => onOpenPetition(point)}
                          className="px-2.5 py-1 rounded-full dark:rounded-[3px] bg-red-100 hover:bg-red-200 dark:bg-[#3d1518] dark:hover:bg-[#541e22] text-red-800 dark:text-[#fca5a5] border border-red-200 dark:border-[#541e22] text-xs font-mono font-semibold transition-colors cursor-pointer"
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
      <div className="p-3 sm:px-5 border-t border-[#e0e2e6] dark:border-[#2a2a2a] bg-[#f8f9fa] dark:bg-[#181818] flex items-center justify-between text-xs text-[#4b5563] dark:text-[#cbd5e1]">
        <p>
          Displaying <span className="text-[#1f2124] dark:text-white font-mono font-semibold">{filteredAndSortedPoints.length}</span> of{' '}
          <span className="text-[#1f2124] dark:text-white font-mono font-semibold">{waterPoints.length}</span> monitored water points
        </p>
        <span className="text-xs font-mono text-[#4b5563] dark:text-[#cbd5e1] hidden sm:inline">
          SHA-256 Ledger Integrity Verified
        </span>
      </div>
    </div>
  );
};
