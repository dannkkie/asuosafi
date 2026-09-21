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
    <div className="relative w-full h-full min-h-[440px] rounded-[12px] dark:rounded-[6px] overflow-hidden border border-[#e0e2e6] dark:border-[#2a2a2a] shadow-material dark:shadow-none bg-[#f8f9fa] dark:bg-[#141414]">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        
        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          className="p-2 rounded-[8px] dark:rounded-[4px] bg-white dark:bg-[#1f1f1f] border border-[#dadce0] dark:border-[#2a2a2a] text-[#5f6368] dark:text-[#a3a3a3] hover:text-[#1f2124] dark:hover:text-[#f5f5f1] shadow-material dark:shadow-none transition-colors cursor-pointer"
          title="Reset to Ghana Mining Belt"
        >
          <Crosshair className="h-4 w-4" />
        </button>

        {/* Basemap Switcher Segmented Control */}
        <div className="flex items-center bg-white dark:bg-[#1f1f1f] border border-[#dadce0] dark:border-[#2a2a2a] p-1 rounded-[8px] dark:rounded-[4px] shadow-material dark:shadow-none">
          <button
            onClick={() => setMapType('streets')}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
              mapType === 'streets'
                ? 'bg-[#1a73e8] text-white font-semibold rounded-[6px] dark:bg-[#e50914] dark:rounded-[4px]'
                : 'text-[#5f6368] dark:text-[#a3a3a3] hover:text-[#1f2124] dark:hover:text-[#f5f5f1]'
            }`}
          >
            Street
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-[#1a73e8] text-white font-semibold rounded-[6px] dark:bg-[#e50914] dark:rounded-[4px]'
                : 'text-[#5f6368] dark:text-[#a3a3a3] hover:text-[#1f2124] dark:hover:text-[#f5f5f1]'
            }`}
          >
            Satellite
          </button>
        </div>

      </div>

      {/* Floating Coordinate Telemetry HUD (Bottom Right) */}
      {selectedWaterPoint && (
        <div className="absolute bottom-3 right-3 z-20 bg-white dark:bg-[#1f1f1f] border border-[#dadce0] dark:border-[#2a2a2a] px-2.5 py-1.5 rounded-[8px] dark:rounded-[4px] shadow-material dark:shadow-none text-[10px] font-mono text-[#5f6368] dark:text-[#a3a3a3] hidden sm:flex items-center gap-2">
          <span className="text-[#5f6368] dark:text-[#a3a3a3]">LOC:</span>
          <span className="text-[#1f2124] dark:text-[#f5f5f1] font-semibold">
            {selectedWaterPoint.coordinates.latitude.toFixed(4)}°N, {Math.abs(selectedWaterPoint.coordinates.longitude).toFixed(4)}°W
          </span>
        </div>
      )}

      {/* Bottom Floating Legend Drawer */}
      <div className="absolute bottom-3 left-3 z-20 bg-white dark:bg-[#1f1f1f] border border-[#dadce0] dark:border-[#2a2a2a] p-3 rounded-[12px] dark:rounded-[6px] shadow-material dark:shadow-none text-xs text-[#1f2124] dark:text-[#f5f5f1] space-y-1.5 max-w-[260px]">
        <div className="flex items-center justify-between pb-1 border-b border-[#e0e2e6] dark:border-[#2a2a2a]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#5f6368] dark:text-[#a3a3a3] font-bold">
            Ledger Ground Status
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#c5221f] ring-2 ring-red-100 dark:ring-red-950" />
          <span>Critical Hazard / Toxic Silt (&gt;50 NTU)</span>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e37400] ring-2 ring-amber-100 dark:ring-amber-950" />
          <span>Caution / High Turbidity</span>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#137333] ring-2 ring-emerald-100 dark:ring-emerald-950" />
          <span>Potable Tested Source (&lt;5 NTU)</span>
        </div>

        {showConcessions && (
          <div className="flex items-center gap-2 pt-1 border-t border-[#e0e2e6] dark:border-[#2a2a2a] text-[10px] text-[#c5221f] dark:text-[#e50914] font-mono font-medium">
            <span className="h-2 w-3 border border-dashed border-[#c5221f] dark:border-[#e50914] bg-[#fce8e6] dark:bg-[#221f1f]" />
            <span>Galamsey River Buffer Encroachment</span>
          </div>
        )}
      </div>

    </div>
  );
};
