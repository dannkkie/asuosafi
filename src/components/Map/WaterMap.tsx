'use client';

import React, { useEffect, useRef, useState } from 'react';
import { WaterPoint, MiningConcession } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

      const markerColor = isToxic ? '#ef4444' : isSafe ? '#10b981' : '#f59e0b';
      const pulseClass = isToxic ? 'pulse-toxic' : isSafe ? 'pulse-safe' : '';

      // Create Custom SVG DivIcon
      const customIcon = L.divIcon({
        className: 'custom-water-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div class="${pulseClass}" style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background-color: ${markerColor}; opacity: ${isSelected ? '1' : '0.9'}; border: 2.5px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.35);">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
              </svg>
            </div>
            ${isSelected ? '<div style="position: absolute; bottom: -8px; width: 8px; height: 8px; background-color: white; transform: rotate(45deg); border-right: 2px solid #0f172a; border-bottom: 2px solid #0f172a;"></div>' : ''}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([point.coordinates.latitude, point.coordinates.longitude], {
        icon: customIcon,
      }).addTo(map);

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
        color: isIllegal ? '#dc2626' : '#059669',
        fillColor: isIllegal ? '#ef4444' : '#10b981',
        fillOpacity: isIllegal ? 0.35 : 0.2,
        weight: isIllegal ? 2.5 : 1.5,
        dashArray: isIllegal ? '6, 6' : undefined,
      }).addTo(layerGroup);

      polygon.bindPopup(`
        <div style="padding: 10px; font-family: sans-serif; font-size: 12px; max-width: 240px;">
          <strong style="color: ${isIllegal ? '#b91c1c' : '#047857'}; font-size: 13px; display: block; margin-bottom: 4px;">
            ${conc.concessionName}
          </strong>
          <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; background: ${isIllegal ? '#fee2e2' : '#d1fae5'}; color: ${isIllegal ? '#991b1b' : '#065f46'}; font-weight: bold; font-size: 10px; margin-bottom: 6px;">
            ${isIllegal ? '⚠️ ILLEGAL RIVER BUFFER BREACH' : '✓ LICENSED SMALL-SCALE SCHEME'}
          </span>
          <p style="margin: 0; color: #475569; font-size: 11px;">${conc.notes}</p>
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
      { duration: 1.2 }
    );
  }, [selectedWaterPoint]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Type Switcher (Streets vs Satellite) */}
      <div className="absolute top-4 right-4 z-20 flex items-center bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-1 rounded-xl shadow-xl">
        <button
          onClick={() => setMapType('streets')}
          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            mapType === 'streets'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Street Map
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            mapType === 'satellite'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Map Overlay Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-lg text-[11px] text-white flex flex-col gap-1.5">
        <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[9px]">
          AsuoSafi Ground Status
        </span>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-red-400/40" />
          <span>Toxic / Severe Galamsey (&gt;800 NTU)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-400/40" />
          <span>Caution / High Silt (50-200 NTU)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/40" />
          <span>Safe Mechanized Borehole (&lt;5 NTU)</span>
        </div>
        {showConcessions && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[10px] text-red-300">
            <span className="h-2.5 w-2.5 border-2 border-dashed border-red-500 bg-red-500/30" />
            <span>Illegal Mining in River Buffer (&lt;100m)</span>
          </div>
        )}
      </div>
    </div>
  );
};
