import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly nikKey: Buffer;
  private readonly nikHmacSecret: string;
  private readonly ledgerHmacSecret: string;
  private readonly txTokenSecret: string;

  constructor(private readonly configService: ConfigService) {
    const hexKey = this.configService.get<string>(
      'NIK_ENCRYPTION_KEY',
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    );
    this.nikKey = Buffer.from(hexKey, 'hex');
    this.nikHmacSecret = this.configService.get<string>(
      'NIK_HMAC_SECRET',
      'nik-hmac-default-secret',
    );
    this.ledgerHmacSecret = this.configService.get<string>(
      'LEDGER_HMAC_SECRET',
      'ledger-hmac-default-secret',
    );
    this.txTokenSecret = this.configService.get<string>(
      'TX_TOKEN_SECRET',
      'tx-token-default-secret',
    );
  }

  // 1. Hash NIK (HMAC-SHA256) untuk pencarian unik & anonim
  hashNik(nik: string): string {
    return crypto
      .createHmac('sha256', this.nikHmacSecret)
      .update(nik.trim())
      .digest('hex');
  }

  // 2. Enkripsi NIK (AES-256-GCM)
  encryptNik(nik: string): string {
    try {
      const iv = crypto.randomBytes(12); // 96-bit IV standar GCM
      const cipher = crypto.createCipheriv('aes-256-gcm', this.nikKey, iv);
      const encrypted = Buffer.concat([
        cipher.update(nik.trim(), 'utf8'),
        cipher.final(),
      ]);
      const authTag = cipher.getAuthTag();

      // Format: iv:authTag:cipher (semua hex)
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (err) {
      throw new InternalServerErrorException({
        errorCode: 'ERR_CRYPTO_FAILURE',
        message: 'Gagal mengenkripsi data sensitif NIK.',
      });
    }
  }

  // 3. Dekripsi NIK (AES-256-GCM) untuk verifikasi BUMDes
  decryptNik(encryptedPayload: string): string {
    try {
      const parts = encryptedPayload.split(':');
      if (parts.length !== 3) {
        throw new Error('Payload format tidak valid');
      }
      const [ivHex, authTagHex, cipherHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const cipherBuffer = Buffer.from(cipherHex, 'hex');

      const decipher = crypto.createDecipheriv('aes-256-gcm', this.nikKey, iv);
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([
        decipher.update(cipherBuffer),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch (err) {
      throw new InternalServerErrorException({
        errorCode: 'ERR_CRYPTO_FAILURE',
        message: 'Gagal mendekripsi data sensitif NIK.',
      });
    }
  }

  // 4. Hash Refresh Token (SHA-256) untuk disimpan di UserSession
  hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // 5. Generate Ledger Integrity Signature (HMAC-SHA256)
  generateLedgerSignature(entry: {
    walletId: string;
    transactionId: string;
    entryType: string;
    currency: string;
    amount: string | number;
    balanceBefore: string | number;
    balanceAfter: string | number;
  }): string {
    const payload = `${entry.walletId}|${entry.transactionId}|${entry.entryType}|${entry.currency}|${entry.amount}|${entry.balanceBefore}|${entry.balanceAfter}`;
    return crypto
      .createHmac('sha256', this.ledgerHmacSecret)
      .update(payload)
      .digest('hex');
  }

  // 6. Generate One-Time Transaction Token
  generateTxToken(
    txId: string,
    initiatorId: string,
    counterpartyId: string,
  ): string {
    const nonce = crypto.randomBytes(8).toString('hex');
    const signature = crypto
      .createHmac('sha256', this.txTokenSecret)
      .update(`${txId}:${initiatorId}:${counterpartyId}:${nonce}`)
      .digest('hex');
    return `${txId}.${nonce}.${signature}`;
  }

  // 7. Generate 6-Digit OTP & OTP Hash
  generateOtp(): string {
    return crypto.randomInt(100000, 1000000).toString();
  }

  hashOtp(otp: string): string {
    return crypto
      .createHmac('sha256', this.nikHmacSecret)
      .update(otp)
      .digest('hex');
  }
}
