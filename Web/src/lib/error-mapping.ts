/**
 * Katalog Pemetaan Kode Error Backend NestJS (AllExceptionsFilter)
 * Mengubah kode error teknis menjadi pesan humanis yang ramah petugas desa dan perencana daerah.
 */
export const ERROR_CODE_MAP: Record<string, string> = {
  ERR_VALIDATION_FAILED: "Data yang dimasukkan tidak lengkap atau format tidak sesuai.",
  ERR_INSUFFICIENT_POINTS: "Poin reputasi warga tidak mencukupi untuk penukaran paket pangan gizi ini.",
  ERR_INSUFFICIENT_FUNDS: "Saldo kas mikro warga tidak mencukupi untuk transaksi ini.",
  ERR_OTP_INVALID_OR_EXPIRED: "Kode OTP 6-digit salah, tidak ditemukan, atau telah kedaluwarsa (>5 menit).",
  ERR_AUTH_INVALID_CREDENTIALS: "Nomor WhatsApp/Email atau kata sandi yang Anda masukkan tidak cocok.",
  ERR_AUTH_TOKEN_EXPIRED: "Sesi login Anda telah berakhir. Sistem telah mencoba memperbarui sesi secara aman.",
  ERR_FORBIDDEN_ROLE_ACCESS: "Akun Anda tidak memiliki hak akses otoritas untuk mengakses data ini.",
  ERR_RESOURCE_NOT_FOUND: "Data yang Anda cari tidak ditemukan di basis data pekon.",
  ERR_DUPLICATE_ENTRY: "Data NIK, Nomor WhatsApp, atau Email sudah terdaftar di sistem pekon.",
  ERR_CONCURRENCY_LOCK: "Terjadi perebutan akses data secara bersamaan. Silakan muat ulang halaman.",
  ERR_CONFLICT_STATE: "Status transaksi saat ini tidak valid untuk diproses lebih lanjut.",
  ERR_STOCK_DEPLETED: "Stok paket pangan bergizi di pekon ini telah habis.",
  ERR_NIK_VERIFICATION_FAILED: "Nomor NIK fisik KTP asli tidak cocok dengan hash enkripsi pendaftaran warga.",
  ERR_SELFIE_INTEGRITY_MISMATCH: "Bukti Selfie PoW wajib berupa foto kamera langsung, bukan unggahan galeri.",
  ERR_RATE_LIMIT_EXCEEDED: "Terlalu banyak permintaan dalam waktu singkat. Harap tunggu beberapa saat.",
  ERR_INTERNAL_SERVER: "Terjadi gangguan internal pada server pekon. Hubungi admin teknis.",
};

export function getErrorMessage(errorCode?: string, fallbackMessage?: string): string {
  if (errorCode && ERROR_CODE_MAP[errorCode]) {
    return ERROR_CODE_MAP[errorCode];
  }
  return fallbackMessage || "Terjadi kendala saat memproses data. Silakan coba lagi.";
}
