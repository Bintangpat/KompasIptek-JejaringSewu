import { CommuterRoute, JastipOrder } from '@/types/entities';

export interface StartRouteRequest {
  originName: string;
  destinationName: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}

export interface PingGpsRequest {
  currentLat: number;
  currentLng: number;
}

export interface NearbyRoutesQuery {
  lat: number;
  lng: number;
  radiusKm?: number;
}

export interface CreateJastipOrderRequest {
  itemDescription: string;
  fuelShareCost: number;
  pickupLat: number;
  pickupLng: number;
}

export interface AcceptOrderResponse {
  order: JastipOrder;
  transactionId: string;
  status: string;
}
