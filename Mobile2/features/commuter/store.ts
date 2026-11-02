import { create } from 'zustand';
import { CommuterRoute, JastipOrder } from '@/types/entities';
import { commuterApi } from './api';

interface CommuterState {
  activeMode: 'warga' | 'kurir';
  activeRoute: CommuterRoute | null;
  nearbyRoutes: CommuterRoute[];
  radiusKm: number;
  isBroadcastingGps: boolean;
  lastPingTime: string | null;

  setActiveMode: (mode: 'warga' | 'kurir') => void;
  setActiveRoute: (route: CommuterRoute | null) => void;
  setNearbyRoutes: (routes: CommuterRoute[]) => void;
  setRadiusKm: (radius: number) => void;
  setIsBroadcastingGps: (broadcasting: boolean) => void;
  setLastPingTime: (time: string | null) => void;
  restoreActiveRoute: () => Promise<void>;
  finishActiveRoute: () => Promise<void>;
}

export const useCommuterStore = create<CommuterState>((set, get) => ({
  activeMode: 'warga',
  activeRoute: null,
  nearbyRoutes: [],
  radiusKm: 25,
  isBroadcastingGps: false,
  lastPingTime: null,

  setActiveMode: (mode) => set({ activeMode: mode }),
  setActiveRoute: (route) => set({ activeRoute: route }),
  setNearbyRoutes: (routes) => set({ nearbyRoutes: routes }),
  setRadiusKm: (radius) => set({ radiusKm: radius }),
  setIsBroadcastingGps: (broadcasting) => set({ isBroadcastingGps: broadcasting }),
  setLastPingTime: (time) => set({ lastPingTime: time }),

  restoreActiveRoute: async () => {
    const routeId = await commuterApi.getStoredActiveRouteId();
    if (routeId) {
      // Set active route stub id hingga rute tervalidasi
      set({
        activeRoute: {
          id: routeId,
          isActive: true,
          commuterId: '',
          originName: '',
          destinationName: '',
          originLat: 0,
          originLng: 0,
          destLat: 0,
          destLng: 0,
          createdAt: new Date().toISOString(),
        },
      });
    }
  },

  finishActiveRoute: async () => {
    await commuterApi.clearStoredActiveRouteId();
    set({
      activeRoute: null,
      isBroadcastingGps: false,
      lastPingTime: null,
    });
  },
}));
