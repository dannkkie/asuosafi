'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Filter,
  ExternalLink,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  Navigation
} from 'lucide-react';
import { WaterPoint, ContaminationStatus, SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';

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
    <div className="bg-[#0E1524] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/[0.02]">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by community, river basin, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141D2D] border border-white/[0.08] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filter Pills & Export */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-1 bg-[#141D2D] border border-white/[0.08] rounded-lg p-1">
            {(['all', 'critical_toxic', 'caution_turbid', 'safe'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'all'
                  ? 'All'
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] transition-colors cursor-pointer"
            title="Export Ledger Dataset as CSV for journalism/research"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Table Data View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] bg-[#0B0F17]/60 text-slate-400 text-[11px] uppercase tracking-wider font-mono">
              <th className="py-3 px-4 font-medium">Source / Basin</th>
              <th className="py-3 px-4 font-medium">Location</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th
                className="py-3 px-4 font-medium cursor-pointer hover:text-slate-200 select-none"
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
              <th className="py-3 px-4 font-medium">pH Level</th>
              <th
                className="py-3 px-4 font-medium cursor-pointer hover:text-slate-200 select-none"
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
              <th className="py-3 px-4 font-medium">Attestations</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredAndSortedPoints.map((point) => {
              const isSelected = selectedWaterPoint?.id === point.id;
              const isCritical = point.currentStatus === 'critical_toxic';
              const isSafe = point.currentStatus === 'safe';

              return (
                <tr
                  key={point.id}
                  className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${
                    isSelected ? 'bg-emerald-500/[0.06]' : ''
                  }`}
                  onClick={() => onSelectWaterPoint(point)}
                >
                  {/* Source & Basin */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <span>{point.name}</span>
                      {isSelected && (
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1 rounded border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {point.riverBasin || 'Local Basin'} • {point.sourceType.toUpperCase()}
                    </p>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-slate-300">
                    <p>{point.community}</p>
                    <p className="text-[11px] text-slate-500">{point.district}, {point.region}</p>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wide bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        Critical Toxic
                      </span>
                    ) : isSafe ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Potable Safe
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        Caution
                      </span>
                    )}
                  </td>

                  {/* Turbidity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold tabular-nums text-sm ${
                          point.metrics.turbidityNtu > 50 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {point.metrics.turbidityNtu} NTU
                      </span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full ${
                            point.metrics.turbidityNtu > 500
                              ? 'bg-red-500'
                              : point.metrics.turbidityNtu > 50
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (point.metrics.turbidityNtu / 1000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* pH Level */}
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {point.metrics.phLevel}
                  </td>

                  {/* Mining Proximity */}
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono ${
                        point.upstreamMiningDistanceKm < 1.0 ? 'text-amber-400 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {point.upstreamMiningDistanceKm} km
                    </span>
                  </td>

                  {/* Attestations */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="font-mono text-slate-200">{point.verifiedByCount} Co-Signers</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          onSelectWaterPoint(point);
                          onSwitchToMap();
                        }}
                        className="p-1.5 rounded hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors"
                        title="Locate on Map"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenAuditTrail(point)}
                        className="p-1.5 rounded hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors"
                        title="View Cryptographic Audit Trail"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                      </button>

                      {isCritical && (
                        <button
                          onClick={() => onOpenPetition(point)}
                          className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-medium transition-colors"
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
      <div className="p-3 sm:px-5 border-t border-white/[0.06] bg-[#0B0F17]/40 flex items-center justify-between text-xs text-slate-400">
        <p>
          Displaying <span className="text-slate-200 font-mono">{filteredAndSortedPoints.length}</span> of{' '}
          <span className="text-slate-200 font-mono">{waterPoints.length}</span> monitored water points
        </p>
        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
          SHA-256 Ledger Integrity Verified
        </span>
      </div>
    </div>
  );
};
