import { api } from "@/lib/api-client";
import { CommuterRoute, JastipOrder } from "@/types";
import { StartRoutePayload, NearbyRoutesParams, CreateJastipOrderPayload } from "./types";

export const commuterApi = {
  startRoute: (payload: StartRoutePayload): Promise<CommuterRoute> => {
    return api.post<CommuterRoute>("/commuters/routes/start", payload);
  },

  getNearbyRoutes: (params: NearbyRoutesParams): Promise<CommuterRoute[]> => {
    return api.get<CommuterRoute[]>("/commuters/routes/nearby", params);
  },

  createOrder: (payload: CreateJastipOrderPayload): Promise<JastipOrder> => {
    return api.post<JastipOrder>(`/commuters/routes/${payload.routeId}/orders`, {
      itemDescription: payload.itemDescription,
      fuelShareCost: payload.fuelShareCost,
      pickupLat: payload.pickupLat,
      pickupLng: payload.pickupLng,
    });
  },

  acceptOrder: (orderId: string): Promise<any> => {
    return api.patch(`/commuters/orders/${orderId}/accept`, {});
  },

  pingLocation: (routeId: string, currentLat: number, currentLng: number): Promise<any> => {
    return api.patch(`/commuters/routes/${routeId}/ping`, { currentLat, currentLng });
  },
};
