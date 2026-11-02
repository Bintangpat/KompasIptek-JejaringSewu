/**
 * Geo-Watermarking Utility for Selfie Proof-of-Work (PoW)
 * Burns cryptographic & geolocational metadata directly onto the captured canvas pixels.
 */

export interface WatermarkOptions {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  pekonName: string;
  userName: string;
  userId: string;
  transactionToken?: string;
  timestamp?: Date;
}

export async function applyGeoWatermark(
  imageSource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  options: WatermarkOptions
): Promise<{ dataUrl: string; blob: Blob }> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context tidak tersedia pada browser.");
  }

  // Determine source dimensions
  let width = 640;
  let height = 480;

  if (imageSource instanceof HTMLVideoElement) {
    width = imageSource.videoWidth || 640;
    height = imageSource.videoHeight || 480;
  } else if (imageSource instanceof HTMLImageElement) {
    width = imageSource.naturalWidth || 640;
    height = imageSource.naturalHeight || 480;
  } else if (imageSource instanceof HTMLCanvasElement) {
    width = imageSource.width;
    height = imageSource.height;
  }

  canvas.width = width;
  canvas.height = height;

  // 1. Draw original frame
  ctx.drawImage(imageSource, 0, 0, width, height);

  // 2. Draw Semi-Transparent Security Overlay Banner at bottom
  const bannerHeight = Math.max(90, Math.floor(height * 0.22));
  const gradient = ctx.createLinearGradient(0, height - bannerHeight, 0, height);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.3, "rgba(10, 25, 47, 0.85)");
  gradient.addColorStop(1, "rgba(5, 15, 30, 0.96)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

  // 3. Security Border (Green/Gold Proof of Work accent)
  ctx.strokeStyle = "#10b981"; // Emerald-500
  ctx.lineWidth = Math.max(3, Math.floor(width * 0.005));
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, width - ctx.lineWidth, height - ctx.lineWidth);

  // 4. Burn Text Metadata
  const now = options.timestamp || new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const fontSize = Math.max(12, Math.floor(width * 0.026));
  ctx.font = `600 ${fontSize}px sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 4;

  const startY = height - bannerHeight + fontSize * 1.5;
  const lineSpacing = fontSize * 1.35;

  // Header tag
  ctx.fillStyle = "#34d399";
  ctx.fillText("🛡️ PROOF-OF-WORK VERIFIED • KOMPAS IPTEK PRINGSEWU", 16, startY);

  // Pekon & User
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`📍 ${options.pekonName.toUpperCase()} | Warga: ${options.userName}`, 16, startY + lineSpacing);

  // GPS Coordinates & Accuracy
  const latStr = options.latitude.toFixed(6);
  const lngStr = options.longitude.toFixed(6);
  const accStr = options.accuracyMeters.toFixed(1);
  ctx.fillStyle = "#e2e8f0";
  ctx.fillText(`🌐 GPS: ${latStr}, ${lngStr} (±${accStr}m)`, 16, startY + lineSpacing * 2);

  // Timestamp & Token
  const tokenSnippet = options.transactionToken
    ? ` • Token: ${options.transactionToken.substring(0, 10)}...`
    : "";
  ctx.fillStyle = "#94a3b8";
  ctx.font = `400 ${fontSize * 0.85}px monospace`;
  ctx.fillText(`🕒 ${dateStr} ${timeStr} WIB${tokenSnippet}`, 16, startY + lineSpacing * 2.9);

  // Convert to Data URL and Blob
  const dataUrl = canvas.toDataURL("image/jpeg", 0.88);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Gagal mengonversi kanvas ke blob gambar."));
      },
      "image/jpeg",
      0.88
    );
  });

  return { dataUrl, blob };
}
