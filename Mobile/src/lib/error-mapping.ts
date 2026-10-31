export const ERROR_MESSAGES: Record<string, string> = {
  ERR_VALIDATION_FAILED: 'Data yang dimasukkan tidak valid. Silakan periksa kembali formulir Anda.',
  ERR_INSUFFICIENT_POINTS: 'Saldo Poin Gizi Anda tidak mencukupi untuk melakukan transaksi ini.',
  ERR_INSUFFICIENT_FUNDS: 'Saldo Tunai Anda tidak mencukupi untuk transaksi ini.',
  ERR_OTP_INVALID_OR_EXPIRED: 'Kode OTP salah atau telah kadaluarsa. Silakan minta kode baru.',
  ERR_AUTH_INVALID_CREDENTIALS: 'Nomor telepon/email atau kata sandi yang Anda masukkan salah.',
  ERR_AUTH_TOKEN_EXPIRED: 'Sesi Anda telah berakhir. Silakan masuk kembali.',
  ERR_FORBIDDEN_ROLE_ACCESS: 'Anda tidak memiliki akses ke fitur ini (hak akses terbatas).',
  ERR_RESOURCE_NOT_FOUND: 'Data yang Anda cari tidak ditemukan.',
  ERR_DUPLICATE_ENTRY: 'Data ini sudah terdaftar di sistem (NIK, nomor telepon, atau email sudah digunakan).',
  ERR_CONCURRENCY_LOCK: 'Pekerjaan atau transaksi ini baru saja diambil/diproses oleh pengguna lain. Silakan coba yang lain.',
  ERR_CONFLICT_STATE: 'Status transaksi atau data tidak sesuai untuk aksi ini.',
  ERR_STOCK_DEPLETED: 'Stok paket pangan gizi telah habis di pekon ini.',
  ERR_NIK_VERIFICATION_FAILED: 'Verifikasi NIK tidak berhasil atau tidak sesuai dengan basis data Pekon.',
  ERR_SELFIE_INTEGRITY_MISMATCH: 'Validasi integritas foto Selfie PoW gagal. Pastikan foto diambil langsung dan berada di lokasi yang tepat.',
  ERR_RATE_LIMIT_EXCEEDED: 'Terlalu banyak permintaan. Mohon tunggu beberapa saat sebelum mencoba kembali.',
  ERR_INTERNAL_SERVER: 'Terjadi kendala pada server. Tim teknis sedang menanganinya.',
  NETWORK_ERROR: 'Koneksi internet bermasalah. Periksa jaringan Anda atau coba lagi nanti.',
};

export function getErrorMessage(errorCode?: string, defaultMessage?: string): string {
  if (errorCode && ERROR_MESSAGES[errorCode]) {
    return ERROR_MESSAGES[errorCode];
  }
  return defaultMessage || 'Terjadi kesalahan. Silakan coba lagi.';
}
