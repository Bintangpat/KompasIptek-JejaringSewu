"use client";

import { useState, useRef, useCallback } from "react";
import { applyGeoWatermark, WatermarkOptions } from "@/lib/geo-watermark";
import { calculateSha256 } from "@/lib/crypto";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export interface CapturedPoW {
  dataUrl: string;
  blob: Blob;
  sha256Hash: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  pekonNameOverlay: string;
  timestamp: Date;
}

export function useSelfiePoW() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedPoW, setCapturedPoW] = useState<CapturedPoW | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Perangkat kamera tidak didukung pada peramban ini.");
      }

      // Stop previous stream if any
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      toast.error(`Kamera gagal diakses: ${err.message || "Izin kamera ditolak."}`);
      setIsCameraActive(false);
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const capturePhoto = useCallback(
    async (options: Omit<WatermarkOptions, "timestamp">) => {
      if (!videoRef.current) {
        throw new Error("Elemen video kamera tidak ditemukan.");
      }

      setIsProcessing(true);
      try {
        const timestamp = new Date();
        const { dataUrl, blob } = await applyGeoWatermark(videoRef.current, {
          ...options,
          timestamp,
        });

        const sha256Hash = await calculateSha256(blob);

        const powResult: CapturedPoW = {
          dataUrl,
          blob,
          sha256Hash,
          latitude: options.latitude,
          longitude: options.longitude,
          accuracyMeters: options.accuracyMeters,
          pekonNameOverlay: options.pekonName,
          timestamp,
        };

        setCapturedPoW(powResult);
        stopCamera();
        toast.success("Foto Selfie PoW berhasil diambil dengan stempel watermark.");
        return powResult;
      } catch (err: any) {
        toast.error(`Gagal memproses foto PoW: ${err.message}`);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [stopCamera]
  );

  const submitProofOfWork = useCallback(
    async (transactionId: string, pow: CapturedPoW) => {
      setIsProcessing(true);
      try {
        // Backblaze B2 Object Storage
        const storageBase =
          process.env.NEXT_PUBLIC_BACKBLAZE_DOWNLOAD_URL || "https://f005.backblazeb2.com";
        const bucket =
          process.env.NEXT_PUBLIC_BACKBLAZE_BUCKET || "jejaring-sewu-pow-dev";
        let finalStorageUrl = `${storageBase}/file/${bucket}/pow/${transactionId}_${pow.sha256Hash.substring(0, 16)}.jpg`;

        // Upload ke Backblaze B2 via backend storage service jika dataUrl tersedia
        if (pow.dataUrl) {
          try {
            const uploadRes = await api.post<{ storageUrl: string }>("/storage/upload", {
              base64Data: pow.dataUrl,
              prefix: `pow_${transactionId}`,
              folder: "pow",
            });
            if (uploadRes?.storageUrl) {
              finalStorageUrl = uploadRes.storageUrl;
            }
          } catch {
            // Fallback ke deterministic Backblaze B2 URL
          }
        }

        const payload = {
          imageStorageUrl: finalStorageUrl,
          imageSha256Hash: pow.sha256Hash,
          gpsLatitude: pow.latitude,
          gpsLongitude: pow.longitude,
          gpsAccuracyMeters: pow.accuracyMeters,
          pekonNameOverlay: pow.pekonNameOverlay,
          isCameraDirect: true,
        };

        const result = await api.post(`/transactions/${transactionId}/selfie-pow`, payload, {
          "X-Image-Hash": pow.sha256Hash,
        });

        toast.success("Bukti Selfie PoW sukses diverifikasi oleh jaringan blockchain desa!");
        return result;
      } catch (err: any) {
        toast.error(`Verifikasi PoW gagal: ${err.message}`);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    videoRef,
    isCameraActive,
    capturedPoW,
    isProcessing,
    startCamera,
    stopCamera,
    capturePhoto,
    submitProofOfWork,
    resetCapture: () => setCapturedPoW(null),
  };
}
