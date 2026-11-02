import { apiClient } from '@/services/api';
import { SecureStorage, STORAGE_KEYS } from '@/services/secure-storage';
import { CommuterRoute, JastipOrder } from '@/types/entities';
import {
  StartRouteRequest,
  PingGpsRequest,
  NearbyRoutesQuery,
  CreateJastipOrderRequest,
  AcceptOrderResponse,
} from './types';

export const commuterApi = {
  // Sesi Rute Kurir di SecureStore
  async getStoredActiveRouteId(): Promise<string | null> {
    return await SecureStorage.getItem(STORAGE_KEYS.ACTIVE_COMMUTER_ROUTE_ID);
  },

  async setStoredActiveRouteId(routeId: string): Promise<void> {
    await SecureStorage.setItem(STORAGE_KEYS.ACTIVE_COMMUTER_ROUTE_ID, routeId);
  },

  async clearStoredActiveRouteId(): Promise<void> {
    await SecureStorage.deleteItem(STORAGE_KEYS.ACTIVE_COMMUTER_ROUTE_ID);
  },

  // 1. Kurir Membuka Rute Baru
  async startRoute(payload: StartRouteRequest): Promise<CommuterRoute> {
    const res: any = await apiClient.post('/commuters/routes/start', payload);
    const createdRoute = res.data || res;
    if (createdRoute?.id) {
      await this.setStoredActiveRouteId(createdRoute.id);
    }
    return createdRoute;
  },

  // 2. Kurir Melakukan Ping GPS Real-Time
  async pingGps(routeId: string, coords: PingGpsRequest): Promise<void> {
    await apiClient.patch(`/commuters/routes/${routeId}/ping`, coords);
  },

  // 3. Selesaikan Rute Perjalanan
  async finishRoute(routeId: string): Promise<void> {
    await apiClient.patch(`/commuters/routes/${routeId}/finish`);
    await this.clearStoredActiveRouteId();
  },

  // 4. Pencarian Rute Terdekat (Warga & Kurir)
  async findNearbyRoutes(query: NearbyRoutesQuery): Promise<CommuterRoute[]> {
    const radius = query.radiusKm || 10;
    const res: any = await apiClient.get(
      `/commuters/routes/nearby?lat=${query.lat}&lng=${query.lng}&radiusKm=${radius}`
    );
    return res.data || res || [];
  },

  // Alias untuk kompatibilitas
  async getNearbyRoutes(query: NearbyRoutesQuery): Promise<CommuterRoute[]> {
    return this.findNearbyRoutes(query);
  },

  // 5. Warga Menitip Pesanan Jastip
  async createOrder(routeId: string, payload: CreateJastipOrderRequest): Promise<JastipOrder> {
    const res: any = await apiClient.post(`/commuters/routes/${routeId}/orders`, payload);
    return res.data || res;
  },

  async createJastipOrder(routeId: string, payload: CreateJastipOrderRequest): Promise<JastipOrder> {
    return this.createOrder(routeId, payload);
  },

  // 6. Kurir Menerima Pesanan Jastip
  async acceptOrder(orderId: string): Promise<AcceptOrderResponse> {
    const res: any = await apiClient.patch(
      `/commuters/orders/${orderId}/accept`,
      {},
      {
        headers: {
          'x-idempotency-key': `accept-commuter-${orderId}-${Date.now()}`,
        },
      }
    );
    return res.data || res;
  },

  async acceptJastipOrder(orderId: string): Promise<AcceptOrderResponse> {
    return this.acceptOrder(orderId);
  },
};
