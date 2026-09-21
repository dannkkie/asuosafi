'use client';

import React, { useEffect, useRef, useState } from 'react';
import { WaterPoint, MiningConcession } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Layers, Crosshair } from 'lucide-react';

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
      const ringColor = isToxic ? 'rgba(239, 68, 68, 0.4)' : isSafe ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)';

      // Precision SVG Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-water-marker',
        html: `
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${isSelected ? `<div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background-color: ${ringColor}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
            <div style="position: relative; width: 32px; height: 32px; border-radius: 9999px; background-color: #0b0f17; border: 2.5px solid ${markerColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
              <div style="width: 10px; height: 10px; border-radius: 9999px; background-color: ${markerColor};"></div>
            </div>
            ${isSelected ? `<div style="position: absolute; bottom: -4px; width: 6px; height: 6px; background-color: ${markerColor}; transform: rotate(45deg);"></div>` : ''}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([point.coordinates.latitude, point.coordinates.longitude], {
        icon: customIcon,
      }).addTo(map);

      // Clean, professional dark popup
      marker.bindPopup(`
        <div style="background-color: #0e1524; color: #f1f5f9; padding: 12px; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px; min-width: 220px; border-radius: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #94a3b8;">${point.sourceType}</span>
            <span style="font-size: 10px; font-family: monospace; font-weight: bold; padding: 1px 6px; border-radius: 4px; background: ${isToxic ? 'rgba(239,68,68,0.2)' : isSafe ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${markerColor};">
              ${isToxic ? 'CRITICAL TOXIC' : isSafe ? 'POTABLE SAFE' : 'CAUTION'}
            </span>
          </div>
          <strong style="font-size: 13px; color: #ffffff; display: block; margin-bottom: 2px;">${point.name}</strong>
          <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 11px;">${point.community}, ${point.district}</p>
          <div style="background-color: #141d2d; padding: 6px 8px; border-radius: 6px; display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; margin-bottom: 8px;">
            <span style="color: #94a3b8;">Turbidity:</span>
            <strong style="color: ${point.metrics.turbidityNtu > 50 ? '#f87171' : '#34d399'};">${point.metrics.turbidityNtu} NTU</strong>
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
        color: isIllegal ? '#ef4444' : '#10b981',
        fillColor: isIllegal ? '#ef4444' : '#10b981',
        fillOpacity: isIllegal ? 0.25 : 0.15,
        weight: isIllegal ? 2 : 1.5,
        dashArray: isIllegal ? '5, 5' : undefined,
      }).addTo(layerGroup);

      polygon.bindPopup(`
        <div style="background-color: #0e1524; color: #f1f5f9; padding: 12px; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px; max-width: 240px; border-radius: 8px;">
          <strong style="color: ${isIllegal ? '#f87171' : '#34d399'}; font-size: 13px; display: block; margin-bottom: 4px;">
            ${conc.concessionName}
          </strong>
          <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; background: ${isIllegal ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}; color: ${isIllegal ? '#fca5a5' : '#6ee7b7'}; font-weight: bold; font-family: monospace; font-size: 10px; margin-bottom: 6px;">
            ${isIllegal ? '⚠️ ILLEGAL BUFFER ENCROACHMENT' : '✓ LICENSED CONCESSION'}
          </span>
          <p style="margin: 0; color: #94a3b8; font-size: 11px; line-height: 1.4;">${conc.notes}</p>
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
    <div className="relative w-full h-full min-h-[440px] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#06090F]">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        
        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          className="p-1.5 rounded-lg bg-[#0E1524]/90 backdrop-blur-md border border-white/[0.1] text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
          title="Reset to Ghana Mining Belt"
        >
          <Crosshair className="h-4 w-4" />
        </button>

        {/* Basemap Switcher Segmented Control */}
        <div className="flex items-center bg-[#0E1524]/90 backdrop-blur-md border border-white/[0.1] p-1 rounded-lg shadow-lg">
          <button
            onClick={() => setMapType('streets')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              mapType === 'streets'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Street
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Satellite
          </button>
        </div>

      </div>

      {/* Floating Coordinate Telemetry HUD (Bottom Right) */}
      {selectedWaterPoint && (
        <div className="absolute bottom-3 right-3 z-20 bg-[#0E1524]/90 backdrop-blur-md border border-white/[0.08] px-2.5 py-1.5 rounded-lg shadow-lg text-[10px] font-mono text-slate-400 hidden sm:flex items-center gap-2">
          <span className="text-slate-500">LOC:</span>
          <span className="text-slate-300">
            {selectedWaterPoint.coordinates.latitude.toFixed(4)}°N, {Math.abs(selectedWaterPoint.coordinates.longitude).toFixed(4)}°W
          </span>
        </div>
      )}

      {/* Bottom Floating Legend Drawer */}
      <div className="absolute bottom-3 left-3 z-20 bg-[#0E1524]/90 backdrop-blur-md border border-white/[0.08] p-3 rounded-lg shadow-xl text-xs text-slate-300 space-y-1.5 max-w-[260px]">
        <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
            Ledger Ground Classification
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-red-500/20" />
          <span>Critical Toxic / Silt (&gt;50 NTU)</span>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />
          <span>Caution / High Turbidity</span>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
          <span>Potable Tested Source (&lt;5 NTU)</span>
        </div>

        {showConcessions && (
          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06] text-[10px] text-red-300 font-mono">
            <span className="h-2 w-3 border border-dashed border-red-500 bg-red-500/20" />
            <span>Galamsey River Buffer Encroachment</span>
          </div>
        )}
      </div>

    </div>
  );
};
