'use client';

import React, { useEffect, useRef, useState } from 'react';
import { WaterPoint, MiningConcession } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair } from 'lucide-react';

interface WaterMapProps {
  waterPoints: WaterPoint[];
  selectedWaterPoint: WaterPoint | null;
  onSelectWaterPoint: (point: WaterPoint) => void;
  concessions: MiningConcession[];
  showConcessions: boolean;
}

export const WaterMap: React.FC<WaterMapProps> = ({
  waterPoints,
  selectedWaterPoint,
  onSelectWaterPoint,
  concessions,
  showConcessions,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const concessionLayersRef = useRef<L.LayerGroup | null>(null);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center around Ghana mining belt (Dunkwa / Kyebi / Prestea region)
    const initialLat = selectedWaterPoint ? selectedWaterPoint.coordinates.latitude : 5.9667;
    const initialLng = selectedWaterPoint ? selectedWaterPoint.coordinates.longitude : -1.9833;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 11,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 100% Free, Open-Source & Watermark-Free OpenStreetMap Layer
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;
    concessionLayersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Map Type (Streets vs Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapType === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri World Imagery &mdash; Source: Esri, Maxar, Earthstar Geographics',
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
    }
  }, [mapType]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    waterPoints.forEach((point) => {
      const isToxic = point.currentStatus === 'critical_toxic';
      const isSafe = point.currentStatus === 'safe';
      const isSelected = selectedWaterPoint?.id === point.id;

      // Natural, grounded tones (zero neon!)
      const markerColor = isToxic ? '#b91c1c' : isSafe ? '#15803d' : '#b45309';
      const badgeBg = isToxic ? '#fee2e2' : isSafe ? '#dcfce7' : '#fef3c7';
      const badgeText = isToxic ? '#991b1b' : isSafe ? '#166534' : '#92400e';
      const statusLabel = isToxic ? 'CRITICAL HAZARD' : isSafe ? 'POTABLE SAFE' : 'CAUTION';

      // Tactile SVG Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-water-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${isSelected ? `<div style="position: absolute; width: 42px; height: 42px; border-radius: 9999px; background-color: ${markerColor}20; border: 1.5px solid ${markerColor}60;"></div>` : ''}
            <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background-color: #ffffff; border: 3px solid ${markerColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.18);">
              <div style="width: 8px; height: 8px; border-radius: 9999px; background-color: ${markerColor};"></div>
            </div>
            ${isSelected ? `<div style="position: absolute; bottom: -3px; width: 6px; height: 6px; background-color: ${markerColor}; transform: rotate(45deg);"></div>` : ''}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([point.coordinates.latitude, point.coordinates.longitude], {
        icon: customIcon,
      }).addTo(map);

      // Clean, professional white popup
      marker.bindPopup(`
        <div style="background-color: #ffffff; color: #0f172a; padding: 12px; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px; min-width: 220px; border-radius: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #64748b; font-weight: 600;">${point.sourceType}</span>
            <span style="font-size: 10px; font-family: monospace; font-weight: 700; padding: 1px 6px; border-radius: 4px; background: ${badgeBg}; color: ${badgeText};">
              ${statusLabel}
            </span>
          </div>
          <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 2px;">${point.name}</strong>
          <p style="margin: 0 0 8px 0; color: #64748b; font-size: 11px;">${point.community}, ${point.district}</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 8px; border-radius: 6px; display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; margin-bottom: 8px;">
            <span style="color: #64748b;">Turbidity:</span>
            <strong style="color: ${point.metrics.turbidityNtu > 50 ? '#b91c1c' : '#15803d'}; font-weight: 700;">${point.metrics.turbidityNtu} NTU</strong>
          </div>
        </div>
      `);

      marker.on('click', () => {
        onSelectWaterPoint(point);
      });

      markersRef.current[point.id] = marker;
    });
  }, [waterPoints, selectedWaterPoint, onSelectWaterPoint]);

  // Update Mining Concessions Layer
  useEffect(() => {
    const layerGroup = concessionLayersRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    if (!showConcessions) return;

    concessions.forEach((conc) => {
      const isIllegal = conc.licenseStatus === 'illegal_encroachment';

      const polygon = L.polygon(conc.boundaryPolygon, {
        color: isIllegal ? '#b91c1c' : '#15803d',
        fillColor: isIllegal ? '#fee2e2' : '#dcfce7',
        fillOpacity: isIllegal ? 0.35 : 0.3,
        weight: 2,
        dashArray: isIllegal ? '5, 5' : undefined,
      }).addTo(layerGroup);

      polygon.bindPopup(`
        <div style="background-color: #ffffff; color: #0f172a; padding: 12px; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px; max-width: 240px; border-radius: 8px;">
          <strong style="color: ${isIllegal ? '#b91c1c' : '#15803d'}; font-size: 13px; display: block; margin-bottom: 4px;">
            ${conc.concessionName}
          </strong>
          <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; background: ${isIllegal ? '#fee2e2' : '#dcfce7'}; color: ${isIllegal ? '#991b1b' : '#166534'}; font-weight: bold; font-family: monospace; font-size: 10px; margin-bottom: 6px;">
            ${isIllegal ? '⚠️ ILLEGAL BUFFER ENCROACHMENT' : '✓ LICENSED CONCESSION'}
          </span>
          <p style="margin: 0; color: #475569; font-size: 11px; line-height: 1.4;">${conc.notes}</p>
        </div>
      `);
    });
  }, [concessions, showConcessions]);

  // Center map on selected water point
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedWaterPoint) return;

    map.flyTo(
      [selectedWaterPoint.coordinates.latitude, selectedWaterPoint.coordinates.longitude],
      13,
      { duration: 1.0 }
    );
  }, [selectedWaterPoint]);

  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([5.9667, -1.9833], 10, { duration: 1.0 });
  };

  return (
    <div className="relative w-full h-full min-h-[440px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        
        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          className="p-2 rounded-lg bg-white/95 dark:bg-[#121927]/95 backdrop-blur border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors cursor-pointer"
          title="Reset to Ghana Mining Belt"
        >
          <Crosshair className="h-4 w-4" />
        </button>

        {/* Basemap Switcher Segmented Control */}
        <div className="flex items-center bg-white/95 dark:bg-[#121927]/95 backdrop-blur border border-slate-200 dark:border-slate-700 p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setMapType('streets')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
              mapType === 'streets'
                ? 'bg-slate-900 dark:bg-emerald-700 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Street
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-slate-900 dark:bg-emerald-700 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>

      </div>

      {/* Floating Coordinate Telemetry HUD (Bottom Right) */}
      {selectedWaterPoint && (
        <div className="absolute bottom-3 right-3 z-20 bg-white/95 dark:bg-[#121927]/95 backdrop-blur border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg shadow-sm text-[10px] font-mono text-slate-600 dark:text-slate-400 hidden sm:flex items-center gap-2">
          <span className="text-slate-400 dark:text-slate-500">LOC:</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {selectedWaterPoint.coordinates.latitude.toFixed(4)}°N, {Math.abs(selectedWaterPoint.coordinates.longitude).toFixed(4)}°W
          </span>
        </div>
      )}

      {/* Bottom Floating Legend Drawer */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 dark:bg-[#121927]/95 backdrop-blur border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-md text-xs text-slate-700 dark:text-slate-300 space-y-1.5 max-w-[260px]">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            Ledger Ground Status
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2.5 w-2.5 rounded-full bg-red-700 ring-2 ring-red-100 dark:ring-red-950" />
          <span>Critical Hazard / Toxic Silt (&gt;50 NTU)</span>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-600 ring-2 ring-amber-100 dark:ring-amber-950" />
          <span>Caution / High Turbidity</span>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-700 ring-2 ring-emerald-100 dark:ring-emerald-950" />
          <span>Potable Tested Source (&lt;5 NTU)</span>
        </div>

        {showConcessions && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700 text-[10px] text-red-700 dark:text-red-400 font-mono font-medium">
            <span className="h-2 w-3 border border-dashed border-red-600 dark:border-red-500 bg-red-100 dark:bg-red-950" />
            <span>Galamsey River Buffer Encroachment</span>
          </div>
        )}
      </div>

    </div>
  );
};
