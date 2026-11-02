import { CommuterRoute, JastipOrder } from "@/types";

export interface StartRoutePayload {
  originName: string;
  destinationName: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}

export interface NearbyRoutesParams {
  lat: number;
  lng: number;
  radiusKm?: number;
}

export interface CreateJastipOrderPayload {
  routeId: string;
  itemDescription: string;
  fuelShareCost: number;
  pickupLat: number;
  pickupLng: number;
}
