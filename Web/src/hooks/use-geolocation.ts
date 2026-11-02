"use client";

import { useState, useEffect, useCallback } from "react";

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeofenceCheck {
  distanceMeters: number;
  isInside: boolean;
  pekonName?: string;
}

// Haversine formula to compute distance in meters between two lat/lng coordinates
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function useGeolocation(options?: PositionOptions) {
  const [position, setPosition] = useState<GeoPosition>({
    latitude: -5.3475,
    longitude: 104.9822, // Default Pekon Pagelaran coordinates
    accuracy: 10,
    timestamp: Date.now(),
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getCoordinates = useCallback((): Promise<GeoPosition> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        setError("Perangkat atau peramban tidak mendukung fitur Geolocation.");
        setIsLoading(false);
        resolve(position);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: GeoPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          };
          setPosition(newPos);
          setIsLoading(false);
          resolve(newPos);
        },
        (err) => {
          // Geolocation warning/fallback to Pekon Pagelaran default
          setError(`Gagal membaca GPS: ${err.message}. Menggunakan koordinat pusat pekon.`);
          setIsLoading(false);
          resolve(position);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
          ...options,
        }
      );
    });
  }, [options, position]);

  useEffect(() => {
    getCoordinates();
  }, []);

  const checkGeofence = useCallback(
    (targetLat: number, targetLng: number, maxRadiusMeters = 2500): GeofenceCheck => {
      const distance = calculateDistanceMeters(
        position.latitude,
        position.longitude,
        targetLat,
        targetLng
      );
      return {
        distanceMeters: distance,
        isInside: distance <= maxRadiusMeters,
      };
    },
    [position]
  );

  return {
    position,
    error,
    isLoading,
    refreshPosition: getCoordinates,
    checkGeofence,
  };
}
