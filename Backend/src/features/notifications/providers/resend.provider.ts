import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendProvider {
  private readonly logger = new Logger(ResendProvider.name);
  private resendClient: Resend | null = null;
  private defaultFrom: string;

  constructor(private readonly configService: ConfigService) {
    this.initResend();
  }

  private initResend() {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.defaultFrom =
      this.configService.get<string>('EMAIL_FROM') ||
      'Jejaring Sewu <onboarding@resend.dev>';

    if (apiKey && apiKey.trim().length > 0 && !apiKey.includes('placeholder')) {
      try {
        this.resendClient = new Resend(apiKey);
        this.logger.log('Resend Client berhasil diinisialisasi.');
      } catch (err: any) {
        this.logger.warn(`Gagal inisialisasi Resend Client: ${err.message}`);
        this.resendClient = null;
      }
    } else {
      this.logger.log(
        'Resend berjalan dalam mode Development/Simulasi (RESEND_API_KEY belum disetel atau DNS masih propagasi).',
      );
    }
  }

  /**
   * Mengirim email OTP transaksional dengan template HTML berstandar enterprise.
   * Jika Resend API belum terverifikasi / gagal, otomatis mencatat ke console (fail-safe).
   */
  async sendOtpEmail(payload: {
    to: string;
    otpCode: string;
    purpose: string;
  }): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
    const { to, otpCode, purpose } = payload;
    const subject = `[JEJARING-SEWU] Kode Verifikasi OTP: ${otpCode}`;
    const purposeLabel = this.getPurposeLabel(purpose);
    const html = this.buildOtpHtmlTemplate(otpCode, purposeLabel);

    // 1. Jika Resend Client siap, coba kirim via API
    if (this.resendClient) {
      try {
        const response = await this.resendClient.emails.send({
          from: this.defaultFrom,
          to: [to],
          subject,
          html,
        });

        if (response.error) {
          this.logger.warn(
            `Resend API error (${response.error.name}): ${response.error.message}. Beralih ke output log dev.`,
          );
          this.logSimulatedDelivery(to, subject, otpCode, purpose);
          return { success: true, simulated: true };
        }

        this.logger.log(
          `Email OTP berhasil dikirim via Resend ke ${to} (ID: ${response.data?.id})`,
        );
        return { success: true, messageId: response.data?.id };
      } catch (error: any) {
        this.logger.error(
          `Gagal menghubungi API Resend: ${error.message}. Menampilkan OTP di terminal.`,
        );
        this.logSimulatedDelivery(to, subject, otpCode, purpose);
        return { success: true, simulated: true };
      }
    }

    // 2. Mode Simulasi (Belum ada API Key / Menunggu Verifikasi DNS)
    this.logSimulatedDelivery(to, subject, otpCode, purpose);
    return { success: true, simulated: true };
  }

  private logSimulatedDelivery(
    to: string,
    subject: string,
    otpCode: string,
    purpose: string,
  ) {
    this.logger.log(
      `\n==========================================================\n` +
        `[SIMULASI EMAIL OTP - RESEND PENDING DNS]\n` +
        `Kepada  : ${to}\n` +
        `Tujuan  : ${purpose}\n` +
        `Subjek  : ${subject}\n` +
        `KODE OTP: [ ${otpCode} ] (Berlaku 5 Menit)\n` +
        `==========================================================\n`,
    );
  }

  private getPurposeLabel(purpose: string): string {
    switch (purpose) {
      case 'REGISTRATION':
        return 'Pendaftaran Akun Warga Baru';
      case 'FORGOT_PASSWORD':
        return 'Atur Ulang Kata Sandi Akun';
      case 'VERIFY_ACTION':
        return 'Konfirmasi Tindakan Transaksi Pekon';
      default:
        return 'Otentikasi Akun';
    }
  }

  private buildOtpHtmlTemplate(otpCode: string, purposeLabel: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode OTP JEJARING-SEWU</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F1416; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #DFE2EB;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0F1416; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #151C1E; border: 1px solid #262D30; border-radius: 16px; overflow: hidden; padding: 32px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #10B981; letter-spacing: 0.5px;">JEJARING-SEWU</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #84958A;">Ekosistem Ekonomi Sirkular Pekon Kabupaten Pringsewu</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding-bottom: 20px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #DFE2EB;">Yth. Warga / Pengguna,</p>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #9EABB2; line-height: 1.6;">
                Anda menerima email ini untuk keperluan <strong style="color: #DFE2EB;">${purposeLabel}</strong> pada platform JEJARING-SEWU.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding: 12px 0 24px 0;">
              <div style="background-color: #0B0F10; border: 1px solid #10B981; border-radius: 12px; padding: 18px 24px; display: inline-block;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #10B981;">
                  ${otpCode}
                </span>
              </div>
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #F59E0B; font-weight: 600;">
                ⏱️ Kode OTP ini berlaku selama 5 menit.
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="background-color: #1A2224; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 11px; color: #C2CCD1; line-height: 1.5;">
                🔒 <strong>Penting:</strong> Jangan berikan kode OTP ini kepada siapa pun, termasuk pengurus BUMDes, kurir jastip, atau aparat pekon. Sistem kami tidak pernah meminta kode OTP melalui telepon atau chat.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 28px; border-top: 1px solid #262D30;">
              <p style="margin: 0; font-size: 11px; color: #5B6A70;">
                © 2026 Inovasi Kompas Iptek • BAPPERIDA & BUMDes Kabupaten Pringsewu
              </p>
              <p style="margin: 4px 0 0 0; font-size: 10px; color: #435056;">
                Email ini dikirimkan secara otomatis. Harap tidak membalas email ini.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}
