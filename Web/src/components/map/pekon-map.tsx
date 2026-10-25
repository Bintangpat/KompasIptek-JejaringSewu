"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MOCK_PEKON_LIST } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Create custom colored HTML markers to avoid default leaflet asset 404s
const createCustomIcon = (name: string, score: number) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background-color: #059669;
        color: white;
        padding: 4px 8px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        border: 2px solid white;
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        transform: translate(-50%, -50%);
      ">
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:#34d399;"></span>
        ${name} (${score})
      </div>
    `,
    iconSize: [100, 30],
    iconAnchor: [50, 15],
  });
};

export default function PekonMap() {
  const [selectedPekon, setSelectedPekon] = useState(MOCK_PEKON_LIST[0]);
  const centerPosition: [number, number] = [-5.358, 104.975]; // Kabupaten Pringsewu center

  return (
    <div className="space-y-4">
      {/* Map Card */}
      <div className="h-[520px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
        <MapContainer
          center={centerPosition}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {MOCK_PEKON_LIST.map((pekon) => (
            <Marker
              key={pekon.id}
              position={[pekon.latitude, pekon.longitude]}
              icon={createCustomIcon(pekon.namaPekon.replace("Pekon ", ""), pekon.avgCreditScore)}
              eventHandlers={{
                click: () => setSelectedPekon(pekon),
              }}
            >
              <Popup>
                <div className="p-2 space-y-1.5 font-sans min-w-[200px]">
                  <div className="font-bold text-sm text-slate-900">
                    {pekon.namaPekon}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Kec. {pekon.kecamatan}, Kab. Pringsewu
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 p-1.5 rounded">
                    {pekon.namaBumdes}
                  </div>
                  <div className="pt-1 text-xs space-y-1 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Warga Aktif:</span>
                      <span className="font-semibold text-slate-800">{pekon.totalWarga}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rata-rata Skor:</span>
                      <span className="font-bold text-emerald-600">{pekon.avgCreditScore} / 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pinjaman Cair:</span>
                      <span className="font-semibold text-blue-700">
                        {formatRupiah(pekon.totalLoansApproved * 1500000)}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Selected Pekon Quick Insight Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-slate-200">
        <div>
          <span className="text-xs text-slate-400">Pekon Terpilih:</span>
          <h3 className="font-bold text-slate-900 text-base">{selectedPekon.namaPekon}</h3>
          <p className="text-xs text-emerald-600 font-medium">{selectedPekon.namaBumdes}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400">Populasi Warga Terdaftar:</span>
          <p className="font-bold text-slate-900 text-lg">{selectedPekon.totalWarga} Warga</p>
          <p className="text-xs text-slate-500">Kecamatan {selectedPekon.kecamatan}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400">Penyaluran Modal Tanpa Agunan:</span>
          <p className="font-bold text-blue-700 text-lg">
            {formatRupiah(selectedPekon.totalLoansApproved * 1500000)}
          </p>
          <p className="text-xs text-slate-500">{selectedPekon.totalLoansApproved} Penerima Mandiri</p>
        </div>
        <div>
          <span className="text-xs text-slate-400">Intervensi Gizi Stunting:</span>
          <p className="font-bold text-amber-700 text-lg">{selectedPekon.stuntingRiskCount} Balita</p>
          <p className="text-xs text-slate-500">Program Penyerapan Panen Desa</p>
        </div>
      </div>
    </div>
  );
}
