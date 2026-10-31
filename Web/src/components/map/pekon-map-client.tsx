"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_PEKON_LIST } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-map-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    "><div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

export default function PekonMapClient({
  selectedPekonId,
  showHeatmap = false,
  className = "h-[360px] w-full rounded-xl overflow-hidden border border-border/60",
}: {
  selectedPekonId?: string;
  showHeatmap?: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} bg-muted/40 animate-pulse flex items-center justify-center text-xs text-muted-foreground`}>
        Memuat Peta Geospasial Pekon...
      </div>
    );
  }

  const defaultCenter: [number, number] = [-5.358, 104.975]; // Pringsewu

  return (
    <div className={className}>
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {MOCK_PEKON_LIST.map((pekon) => {
          const isSelected = selectedPekonId === pekon.id;
          const markerColor = isSelected ? "#00D285" : "#3DE6F2";

          return (
            <React.Fragment key={pekon.id}>
              <Marker
                position={[pekon.latitude, pekon.longitude]}
                icon={createCustomIcon(markerColor)}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <div className="font-bold text-slate-900">{pekon.namaPekon}</div>
                    <div className="text-slate-600">Kecamatan: {pekon.kecamatan}</div>
                    <div className="text-slate-600">{pekon.namaBumdes}</div>
                    <div className="pt-1 flex gap-1">
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
                        {pekon.totalLoansApproved} Modal Disetujui
                      </Badge>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {showHeatmap && (
                <Circle
                  center={[pekon.latitude, pekon.longitude]}
                  radius={pekon.totalLoansApproved * 120}
                  pathOptions={{
                    fillColor: markerColor,
                    fillOpacity: 0.15,
                    color: markerColor,
                    weight: 1,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
