# Technical Specification Document (TSD) — Backend
# JEJARING-SEWU (SINERGI-PEKON)

> Dokumen ini berisi spesifikasi implementasi backend NestJS: kode, DTO, controller, unit test, dan katalog REST API.
> Untuk arsitektur, schema database, dan pola keamanan, lihat [ArchitectureTechnicalDocument.md](./ArchitectureTechnicalDocument.md).

Technical Specification Document (TSD) Backend untuk ekosistem JEJARING-SEWU (SINERGI-PEKON) ini dirancang menggunakan kerangka kerja NestJS (Enterprise Modular Pattern) dengan Feature-Centered Design. Seluruh spesifikasi di bawah ini siap diimplementasikan untuk melayani aplikasi Mobile (React Native Expo) dan Web Dashboard (Next.js BUMDes/BAPPERIDA & PWA Warga).

## 1. Struktur Direktori Feature-Centered Design (NestJS)

Arsitektur memisahkan domain fitur secara mandiri (high cohesion, low coupling).

> **Referensi:** Peta direktori lengkap tersedia di [AGENTS.md](./AGENTS.md#3-directory-structure-map-backend-nestjs). Schema database lengkap tersedia di [ArchitectureTechnicalDocument.md](./ArchitectureTechnicalDocument.md#2-desain-skema-database).

Setiap modul fitur di `src/features/` memiliki struktur internal:
```text
src/features/<module>/
├── <module>.module.ts
├── <module>.controller.ts
├── <module>.service.ts
├── <module>.service.spec.ts
└── dto/
    └── <module>.dto.ts
```

## 2. Keamanan Berlapis: Middleware, CORS, Rate Limiting, Anti-SQLi, & Validasi Data

### A. Konfigurasi Bootstrap, Strict CORS, Cookie, & Global Validation (src/main.ts)

Menggunakan `ValidationPipe` ketat untuk memvalidasi tipe data secara otomatis dan menolak property asing (*mass-assignment protection*).

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Security Headers & Cookie Parser (Wajib untuk HttpOnly Refresh Token)
  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // 2. Strict CORS Middleware (Mengizinkan Kredensial Cookie untuk Web & Mobile)
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://dashboard.jejaringsewu.id',
    'https://app.jejaringsewu.id',
    'http://localhost:3000',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (seperti aplikasi Mobile React Native Expo) atau origin yang terdaftar
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS Policy: Origin tidak diizinkan oleh server'));
      }
    },
    credentials: true, // Wajib agar cookie Refresh Token terkirim otomatis
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key', 'X-Device-Id', 'X-Image-Hash'],
  });

  // 3. API Versioning (/api/v1/...)
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // 4. Validasi Tipe Data Ketat & Sanitasi Input
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Hapus otomatis field yang tidak ada di DTO
      forbidNonWhitelisted: true, // Lempar error 400 jika ada field mencurigakan/ilegal
      transform: true,            // Konversi tipe primitif otomatis (string -> number/boolean)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 5. Full Catch Error Filter Global
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
```

### B. Multi-Tier Rate Limiting (@nestjs/throttler + Redis Storage)

Melindungi endpoint sensitif (seperti pengiriman OTP dan Login) dari serangan Brute Force atau Spam.

```typescript
// Konfigurasi di app.module.ts
ThrottlerModule.forRoot([
  { name: 'short', ttl: 1000, limit: 5 },       // Maks 5 req / detik per IP
  { name: 'medium', ttl: 60000, limit: 60 },    // Maks 60 req / menit per IP
  { name: 'otp_strict', ttl: 300000, limit: 3 } // Khusus OTP & Lupa Sandi: Maks 3 req / 5 menit
])
```

### C. Pertahanan Mutlak Anti-SQL Injection (Prisma ORM)

- **Parameterized Queries Otomatis:** Seluruh operasi CRUD menggunakan Prisma Client API (`findMany`, `create`, `update`) yang memisahkan struktur kueri SQL dari input pengguna di level driver PostgreSQL.
- **Safe Tagged Template untuk Raw SQL:** Pada operasi penguncian baris (`SELECT ... FOR UPDATE NOWAIT`) atau kalkulasi radius geospasial PostGIS, dilarang keras menggunakan `$queryRawUnsafe`. Wajib menggunakan Tagged Template `Prisma.sql` atau `tx.$queryRaw` yang mengubah variabel menjadi prepared statement parameters (`$1`, `$2`):

```typescript
// AMAN DARI SQL INJECTION: Parameter di-binding sebagai $1 oleh PostgreSQL
const [job] = await tx.$queryRaw<MiniJob[]>`
  SELECT * FROM "MiniJob" WHERE id = ${jobId}::uuid AND status = 'OPEN' FOR UPDATE NOWAIT
`;
```

## 3. Penanganan Error Menyeluruh (Full Catch Error Code)

Semua error yang terjadi di sistem (validasi DTO gagal, duplikasi data Prisma, token kedaluwarsa, hingga gagal kunci baris database) ditangkap oleh `AllExceptionsFilter` dan dipetakan ke kode error standar aplikasi.

### A. Tabel Standar Error Code Internal

| Kode Error Aplikasi | HTTP Status | Kondisi Pemicu / Penjelasan |
| :--- | :--- | :--- |
| `ERR_VALIDATION_FAILED` | `400` Bad Request | Tipe data request salah, format email/UUID tidak valid, atau field wajib kosong. |
| `ERR_OTP_INVALID_OR_EXPIRED` | `400` Bad Request | Kode OTP 6 digit salah, sudah dipakai, atau melewati batas waktu 5 menit. |
| `ERR_INSUFFICIENT_POINTS` | `400` Bad Request | Saldo poin tidak cukup untuk penukaran paket gizi. |
| `ERR_AUTH_INVALID_CREDENTIALS` | `401` Unauthorized | Nomor HP/email/kata sandi salah atau akun Google tidak terverifikasi. |
| `ERR_AUTH_TOKEN_EXPIRED` | `401` Unauthorized | Access Token atau Refresh Token di Cookie sudah kedaluwarsa / dicabut (*revoked*). |
| `ERR_FORBIDDEN_ROLE_ACCESS` | `403` Forbidden | Warga biasa mencoba mengakses endpoint Admin BUMDes atau Mini-Job khusus disabilitas. |
| `ERR_RESOURCE_NOT_FOUND` | `404` Not Found | Data (User, Listing Panen, Rute Jastip, atau Transaksi) tidak ditemukan (Prisma P2025). |
| `ERR_DUPLICATE_ENTRY` | `409` Conflict | Email, Nomor HP, NIK, atau Idempotency-Key sudah terdaftar (Prisma P2002). |
| `ERR_CONCURRENCY_LOCK` | `409` Conflict | Race condition terdeteksi: Mini-Job sudah dikunci pekerja lain milidetik sebelumnya (55P03). |
| `ERR_STOCK_DEPLETED` | `409` Conflict | Stok paket gizi habis saat proses redeem. |
| `ERR_SELFIE_INTEGRITY_MISMATCH` | `422` Unprocessable Entity | Checksum SHA-256 foto selfie tidak cocok atau lokasi GPS berada di luar radius transaksi. |
| `ERR_NIK_VERIFICATION_FAILED` | `422` Unprocessable Entity | NIK tidak valid atau belum terverifikasi oleh Admin BUMDes. |
| `ERR_RATE_LIMIT_EXCEEDED` | `429` Too Many Requests | Pengguna melampaui batas maksimal request atau batas pengiriman OTP. |
| `ERR_INTERNAL_SERVER` | `500` Internal Server Error | Kesalahan tidak terduga pada sistem (detail disembunyikan di production, dicatat ke log). |

### B. Implementasi AllExceptionsFilter (src/core/filters/all-exceptions.filter.ts)

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'ERR_INTERNAL_SERVER';
    let message: any = 'Terjadi kesalahan pada server internal.';

    // 1. Tangkap NestJS HttpException (termasuk ValidationPipe & ThrottlerException)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resBody = exception.getResponse() as any;
      message = resBody.message || exception.message;
      errorCode = resBody.errorCode || this.mapHttpToAppCode(status);
    }
    // 2. Tangkap Prisma Client Known Request Error (Anti-Leak Database Structure)
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        errorCode = 'ERR_DUPLICATE_ENTRY';
        message = `Data pada kolom ${(exception.meta?.target as string[])?.join(', ')} sudah terdaftar.`;
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        errorCode = 'ERR_RESOURCE_NOT_FOUND';
        message = 'Data yang diminta tidak ditemukan di dalam sistem.';
      } else if (exception.code === 'P2034') {
        status = HttpStatus.CONFLICT;
        errorCode = 'ERR_CONCURRENCY_LOCK';
        message = 'Transaksi sedang diproses bersamaan, silakan coba sesaat lagi.';
      }
    }

    this.logger.error(`[${request.method}] ${request.url} -> ${errorCode}`, exception instanceof Error ? exception.stack : '');

    response.status(status).json({
      success: false,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private mapHttpToAppCode(status: number): string {
    switch (status) {
      case 400: return 'ERR_VALIDATION_FAILED';
      case 401: return 'ERR_AUTH_UNAUTHORIZED';
      case 403: return 'ERR_FORBIDDEN_ROLE_ACCESS';
      case 404: return 'ERR_RESOURCE_NOT_FOUND';
      case 409: return 'ERR_CONFLICT_STATE';
      case 429: return 'ERR_RATE_LIMIT_EXCEEDED';
      default: return 'ERR_INTERNAL_SERVER';
    }
  }
}
```

## 4. Modul Autentikasi Lengkap (No HP/Email, Google OAuth2, OTP FCM, Lupa Sandi, & Cookie Refresh Token)

### A. Alur Keamanan Refresh Token di HttpOnly Cookie & OTP Redis

- **Access Token (JWT HS256 15 Menit):** Disahkan menggunakan algoritma HS256 dengan secret key simetris (`JWT_SECRET`), dikirim di dalam body JSON (`accessToken`) untuk disimpan di memori aplikasi (React State / Zustand).
- **Refresh Token (Opaque Token 30 Hari):** Diset langsung oleh server ke dalam HttpOnly Cookie (`jejaring_pringsewu`), `Secure: true`, `SameSite: 'strict'`, dan `Path: '/api/v1/auth'`. JavaScript klien tidak dapat membaca cookie ini sehingga kebal terhadap pencurian token via Cross-Site Scripting (XSS).
- **Kirim OTP & Lupa Sandi (FCM Push Notification):** Mengirim OTP 6 digit via Firebase Cloud Messaging (FCM) Push Notification ke perangkat terdaftar. Kode OTP 6 digit dibuat menggunakan `crypto.randomInt(100000, 999999)`, dikirimkan ke perangkat pengguna via FCM, lalu di-hash dengan HMAC-SHA256 dan disimpan di Redis dengan Time-To-Live (TTL) 300 detik (5 menit) serta batas maksimal percobaan gagal sebanyak 3 kali. Nomor HP/WhatsApp tetap disimpan sebagai identitas warga dan keperluan kontak antarpengguna.

### B. Implementasi AuthController & Cookie Handler (src/features/auth/auth.controller.ts)

```typescript
import { Controller, Post, Body, Res, Req, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, GoogleLoginDto, SendOtpDto, VerifyOtpDto, ResetPasswordDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('jejaring_pringsewu', refreshToken, {
      httpOnly: true, // Anti-XSS: Tidak bisa diakses via document.cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Hari
    });
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.loginWithIdentifier(dto, req.ip);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken, user };
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(@Body() dto: GoogleLoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // Memverifikasi Google idToken menggunakan google-auth-library (OAuth2Client)
    const { accessToken, refreshToken, user } = await this.authService.loginWithGoogle(dto, req.ip);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken, user };
  }

  @Throttle({ otp_strict: { limit: 3, ttl: 300000 } }) // Maks 3x kirim OTP per 5 menit
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.generateAndSendOtp(dto);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Throttle({ otp_strict: { limit: 3, ttl: 300000 } })
  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: SendOtpDto) {
    return this.authService.initiateForgotPassword(dto.identifier);
  }

  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPasswordWithOtp(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.cookies?.['jejaring_pringsewu'];
    if (!oldRefreshToken) {
      throw new UnauthorizedException({ errorCode: 'ERR_AUTH_TOKEN_EXPIRED', message: 'Refresh token tidak ditemukan di cookie.' });
    }
    const { accessToken, refreshToken } = await this.authService.rotateRefreshToken(oldRefreshToken, req.ip);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['jejaring_pringsewu'];
    if (refreshToken) await this.authService.revokeSession(refreshToken);
    res.clearCookie('jejaring_pringsewu', { path: '/api/v1/auth' });
    return { message: 'Berhasil keluar dari sesi.' };
  }
}
```

### C. Data Transfer Objects (DTO) Validasi Ketat (src/features/auth/dto/auth.dto.ts)

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsIn,
} from 'class-validator';

export enum VulnerabilityStatus {
  NONE = 'NONE',
  LANSIA = 'LANSIA',
  DISABILITAS_FISIK = 'DISABILITAS_FISIK',
  DISABILITAS_SENSORIK = 'DISABILITAS_SENSORIK',
  DISABILITAS_INTELEKTUAL = 'DISABILITAS_INTELEKTUAL',
  IBU_HAMIL = 'IBU_HAMIL',
  BALITA_STUNTING = 'BALITA_STUNTING',
  KELUARGA_PRA_SEJAHTERA = 'KELUARGA_PRA_SEJAHTERA',
}

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Nomor HP atau email wajib diisi' })
  identifier: string; // Nomor WhatsApp (utama) atau email (alternatif)

  @IsString()
  @MinLength(8, { message: 'Kata sandi minimal 8 karakter' })
  password: string;

  @IsString()
  deviceId: string;
}

export class RegisterDto {
  @IsString()
  @Matches(/^[0-9]{16}$/, { message: 'NIK wajib berupa 16 digit angka' })
  nik: string;

  @IsString()
  @MinLength(3)
  fullName: string;

  @IsString()
  @Matches(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, { message: 'Format nomor HP Indonesia tidak valid' })
  phoneNumber: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Kata sandi wajib mengandung huruf besar, huruf kecil, dan angka/simbol',
  })
  password: string;

  @IsUUID('4')
  pekonId: string;

  @IsEnum(VulnerabilityStatus, { each: true })
  @IsOptional()
  vulnerabilityFlags?: VulnerabilityStatus[];
}

export class GoogleLoginDto {
  @IsString()
  idToken: string; // Token dari Google Sign-In SDK (Mobile / Web)

  @IsString()
  deviceId: string;

  @IsUUID('4', { message: 'Pekon ID wajib berformat UUID v4' })
  pekonId: string;
}

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // Nomor WhatsApp (utama) atau email

  @IsString()
  @IsIn(['REGISTRATION', 'FORGOT_PASSWORD', 'VERIFY_ACTION'])
  purpose: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // Nomor WhatsApp atau email

  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'Kode OTP wajib berupa 6 digit angka' })
  otpCode: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // Nomor WhatsApp atau email

  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'Kode OTP wajib berupa 6 digit angka' })
  otpCode: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Kata sandi baru wajib mengandung huruf besar, huruf kecil, dan angka/simbol',
  })
  newPassword: string;
}
```

## 5. Katalog Lengkap REST API Endpoints (Untuk Mobile App & Web Dashboard)

Seluruh endpoint di bawah ini menggunakan awalan `/api/v1` dan melayani kebutuhan aplikasi Mobile Warga (4 Tab Utama) serta Web Dashboard Otoritas (BUMDes & BAPPERIDA).

### A. Modul Auth & Keamanan (/api/v1/auth)

| Method | Endpoint | Target Klien | Deskripsi & Validasi |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Mobile & Web | Registrasi akun warga/pengepul/UMKM (Enkripsi NIK AES-256 + Argon2id). |
| `POST` | `/auth/login` | Mobile & Web | Login dengan Nomor HP/Email & Password; mengeluarkan JWT (HS256) & mengeset Cookie `jejaring_pringsewu`. |
| `POST` | `/auth/google` | Mobile & Web | Login/Register instan dengan Google OAuth2 idToken; mengeset Cookie `jejaring_pringsewu`. |
| `POST` | `/auth/otp/send` | Mobile & Web | Mengirim OTP 6 digit via FCM Push Notification (Rate Limit: 3x / 5 menit). |
| `POST` | `/auth/otp/verify` | Mobile & Web | Memvalidasi kode OTP untuk aktivasi akun atau verifikasi tindakan sensitif. |
| `POST` | `/auth/password/forgot` | Mobile & Web | Meminta pengiriman OTP via FCM Push Notification khusus untuk pemulihan kata sandi yang lupa. |
| `POST` | `/auth/password/reset` | Mobile & Web | Mengatur ulang kata sandi baru menggunakan validasi OTP & mencabut semua sesi lama. |
| `POST` | `/auth/refresh` | Mobile & Web | Membaca `jejaring_pringsewu` dari HttpOnly Cookie & melakukan Refresh Token Rotation. |
| `POST` | `/auth/logout` | Mobile & Web | Mencabut sesi di database dan menghapus HttpOnly Cookie `jejaring_pringsewu`. |

### B. Modul Profil Warga & Dompet Buku Besar (/api/v1/users & /api/v1/wallets)

| Method | Endpoint | Target Klien | Deskripsi & Validasi |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | Mobile & Web | Mengambil profil pengguna aktif, status kerentanan (vulnerabilityFlags), & info Pekon. |
| `PATCH` | `/users/me` | Mobile & Web | Update profil (fullName, email opsional, vulnerabilityFlags). |
| `POST` | `/users/verify-nik` | Web (BUMDes) | Validasi NIK manual oleh Admin BUMDes (Dukcapil/NIA planned). |
| `PATCH` | `/users/me/fcm-token` | Mobile | Memperbarui token Firebase Cloud Messaging (FCM) perangkat Android. |
| `GET` | `/wallets/me` | Mobile & Web | Mengambil saldo Poin Gizi (pointsBalance), Saldo Komisi (cashBalance), & 20 mutasi terakhir. |

### C. Modul 1: Bursa Hasil Bumi & Referral Pengepul (/api/v1/harvests)

| Method | Endpoint | Target Klien | Deskripsi & Validasi |
| :--- | :--- | :--- | :--- |
| `POST` | `/harvests/listings` | Mobile (Petani) | Memposting hasil panen (komoditas, estimasi Kg, harga minimal). |
| `GET` | `/harvests/listings` | Mobile & Web | Daftar panen terbuka dengan filter pekonId, commodityName, dan paginasi. |
| `POST` | `/harvests/listings/:id/bids` | Mobile (Pengepul) | Mengajukan tawaran harga beli (open bidding) + input opsional referralUsedCode. |
| `POST` | `/harvests/bids/:bidId/accept` | Mobile (Petani) | Menerima tawaran pengepul, mengunci status panen, & membuat UnifiedTransaction. |
| `GET` | `/harvests/collectors/trusted` | Mobile & Web | Daftar pengepul pemegang lencana "Mitra Terpercaya Pekon" beserta kode referral-nya. |

### D. Modul 2: Nebeng-Jastip Searah / Komuter (/api/v1/commuters)

| Method | Endpoint | Target Klien | Deskripsi & Validasi |
| :--- | :--- | :--- | :--- |
| `POST` | `/commuters/routes/start` | Mobile (Kurir) | Memulai rute searah ke pasar & memicu Geo-Fenced Push Notification ke tetangga sekitar. |
| `PATCH` | `/commuters/routes/:id/ping` | Mobile (Bg Task) | Mengirim pembaruan titik GPS kurir secara berkala dari expo-task-manager ke Redis/PostGIS. |
| `GET` | `/commuters/routes/nearby` | Mobile & Web | Mencari komuter aktif dalam radius tertentu (kueri PostGIS ST_DWithin). |
| `POST` | `/commuters/routes/:id/orders` | Mobile (Warga) | Memesan titip beli/kirim barang di jalur komuter (Wajib header X-Idempotency-Key). |
| `PATCH` | `/commuters/orders/:id/accept` | Mobile (Kurir) | Kurir menerima titipan & menerbitkan UnifiedTransaction. |

### E. Modul 3: Bursa Mini-Job Zero-Discrimination (/api/v1/mini-jobs)

| Method | Endpoint | Target Klien | Deskripsi & Validasi |
| :--- | :--- | :--- | :--- |
| `POST` | `/mini-jobs` | Mobile & Web | UMKM/Warga memposting tugas harian + flag isDisabilityFriendly. |
| `GET` | `/mini-jobs` | Mobile & Web | Daftar tugas terbuka (menampilkan lencana prioritas bagi penyandang disabilitas/lansia). |
| `POST` | `/mini-jobs/:id/claim` | Mobile (Pekerja) | Atomic Auto-Accept Lock: Mengunci tugas secara instan tanpa opsi tolak dari pemberi kerja. |

### F. Modul 4: Transaksi Terpadu & Kamera Selfie PoW (/api/v1/transactions)

| Method | Endpoint | Target Klien | Deskripsi & Validasi |
| :--- | :--- | :--- | :--- |
| `GET` | `/transactions/me` | Mobile & Web | Riwayat transaksi pengguna aktif (paginated). |
| `GET` | `/transactions/:id/token` | Mobile & Web | Mengambil transactionToken berumur 5 menit untuk handshake serah terima. |
| `POST` | `/transactions/:id/selfie-pow` | Mobile (Kamera) | multipart/form-data: Unggah foto selfie ber-watermark, verifikasi SHA-256 & GPS, mutasi buku besar, dan picu kalkulasi SPK secara atomik. |

### G. Modul 5 & 6: SPK Credit Scoring, BUMDes Dashboard, & Gizi (/api/v1/credit-scoring & /api/v1/nutrition)

| Method | Endpoint | Target Klien | Deskripsi & Validasi |
| :--- | :--- | :--- | :--- |
| `GET` | `/credit-scoring/me` | Mobile & Web | Mengambil skor kredit terbaru (S_kredit), rincian 5 variabel SPK, & riwayat grafik. |
| `GET` | `/credit-scoring/pekon/:pekonId` | Web (BUMDes) | Dashboard Otoritas: Daftar skor kredit warga satu pekon & analitik agregat BAPPERIDA. |
| `GET` | `/credit-scoring/loans/eligible` | Web (BUMDes) | Daftar warga Grade A (S_kredit≥85) yang layak menerima modal Rp1.500.000 tanpa agunan. |
| `PATCH` | `/credit-scoring/loans/:id/approve` | Web (BUMDes) | Persetujuan pencairan modal oleh Admin BUMDes (mencatat Audit Log & kirim FCM ke warga). |
| `GET` | `/nutrition/packages` | Mobile & Web | Katalog Paket Pangan Bergizi Lokal (telur, ikan air tawar, sayur) di pekon terkait. |
| `POST` | `/nutrition/redeem` | Mobile (Warga) | Menukar poin reputasi dengan Paket Gizi (memvalidasi kecukupan poin & stok secara atomik). |
| `GET` | `/nutrition/redemptions/me` | Mobile & Web | Riwayat penukaran paket gizi pengguna. |

## 6. Implementasi Unit Test Standar Enterprise (Jest)

Berikut adalah implementasi Unit Test menggunakan `@nestjs/testing` dan `jest` untuk memverifikasi dua komponen paling krusial: Autentikasi (Login, OTP FCM, Refresh Cookie) dan Atomic Auto-Accept Lock pada Mini-Job Disabilitas.

### A. Unit Test Modul Autentikasi (src/features/auth/auth.service.spec.ts)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../core/database/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService (Unit Test)', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let redis: RedisService;

  const mockPrisma = {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    userSession: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  };

  const mockRedis = {
    setex: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const mockJwt = {
    signAsync: jest.fn().mockResolvedValue('mocked.jwt.access.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
    jest.clearAllMocks();
  });

  it('harus berhasil login dengan nomor HP/email & password yang valid serta membuat sesi Refresh Token', async () => {
    const hashedPassword = await argon2.hash('SandiKuat123!');
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'uuid-warga-1',
      phoneNumber: '081234567890',
      email: 'petani@pekon.id',
      passwordHash: hashedPassword,
      role: 'WARGA',
      pekonId: 'uuid-pekon-1',
    });
    mockPrisma.userSession.create.mockResolvedValue({ id: 'session-1' });

    const result = await service.loginWithIdentifier(
      { identifier: '081234567890', password: 'SandiKuat123!', deviceId: 'expo-android-01' },
      '127.0.0.1',
    );

    expect(result).toHaveProperty('accessToken', 'mocked.jwt.access.token');
    expect(result).toHaveProperty('refreshToken');
    expect(mockPrisma.userSession.create).toHaveBeenCalledTimes(1);
  });

  it('harus menolak login (401 ERR_AUTH_INVALID_CREDENTIALS) jika kata sandi salah', async () => {
    const hashedPassword = await argon2.hash('SandiBenar123!');
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'uuid-warga-1',
      phoneNumber: '081234567890',
      passwordHash: hashedPassword,
    });

    await expect(
      service.loginWithIdentifier({ identifier: '081234567890', password: 'SandiSalah999!', deviceId: 'dev-1' }, '127.0.0.1'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('harus menolak verifikasi OTP (400 ERR_OTP_INVALID_OR_EXPIRED) jika OTP di Redis sudah kedaluwarsa', async () => {
    mockRedis.get.mockResolvedValue(null); // Simulasi TTL 5 menit habis di Redis

    await expect(
      service.verifyOtp({ identifier: '081234567890', otpCode: '123456' }),
    ).rejects.toThrow(BadRequestException);
  });
});
```

### B. Unit Test Atomic Mini-Job Auto-Accept Lock (src/features/mini-job/mini-job.service.spec.ts)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MiniJobService } from './mini-job.service';
import { PrismaService } from '../../core/database/prisma.service';
import { ConflictException, ForbiddenException } from '@nestjs/common';

describe('MiniJobService - Zero Discrimination Auto-Accept Lock', () => {
  let service: MiniJobService;

  const mockTx = {
    $queryRaw: jest.fn(),
    user: { findUniqueOrThrow: jest.fn() },
    miniJob: { update: jest.fn() },
    unifiedTransaction: { create: jest.fn() },
  };

  const mockPrisma = {
    $transaction: jest.fn((callback) => callback(mockTx)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MiniJobService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MiniJobService>(MiniJobService);
    jest.clearAllMocks();
  });

  it('harus mengunci otomatis (autoAcceptLock: true) saat pekerja disabilitas mengambil tugas ramah disabilitas', async () => {
    mockTx.$queryRaw.mockResolvedValue([
      { id: 'job-1', employerId: 'umkm-1', wageAmount: 50000, isDisabilityFriendly: true, version: 1 },
    ]);
    mockTx.user.findUniqueOrThrow.mockResolvedValue({
      id: 'worker-disabilitas-1',
      vulnerabilityFlags: ['DISABILITAS_FISIK'],
    });
    mockTx.miniJob.update.mockResolvedValue({
      id: 'job-1',
      status: 'LOCKED_BY_PRIORITY',
      autoAcceptLock: true,
    });
    mockTx.unifiedTransaction.create.mockResolvedValue({ id: 'tx-1', status: 'LOCKED_ASSIGNED' });

    const result = await service.claimDisabilityMiniJob('job-1', 'worker-disabilitas-1', 'idem-key-001');

    expect(result.updatedJob.autoAcceptLock).toBe(true);
    expect(result.updatedJob.status).toBe('LOCKED_BY_PRIORITY');
    expect(mockTx.unifiedTransaction.create).toHaveBeenCalledTimes(1);
  });

  it('harus melempar ForbiddenException (403) jika pengguna non-prioritas mengambil tugas khusus disabilitas', async () => {
    mockTx.$queryRaw.mockResolvedValue([
      { id: 'job-1', employerId: 'umkm-1', isDisabilityFriendly: true, version: 1 },
    ]);
    mockTx.user.findUniqueOrThrow.mockResolvedValue({
      id: 'worker-umum',
      vulnerabilityFlags: ['NONE'],
    });

    await expect(
      service.claimDisabilityMiniJob('job-1', 'worker-umum', 'idem-key-002'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('harus melempar ConflictException (409) jika tugas sudah dikunci pekerja lain pada milidetik yang sama', async () => {
    mockTx.$queryRaw.mockResolvedValue([]); // Baris tidak ditemukan karena status bukan OPEN

    await expect(
      service.claimDisabilityMiniJob('job-1', 'worker-disabilitas-2', 'idem-key-003'),
    ).rejects.toThrow(ConflictException);
  });
});
```
