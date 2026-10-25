import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              if (key === 'NIK_ENCRYPTION_KEY') {
                return '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
              }
              if (key === 'NIK_HMAC_SECRET') return 'test-nik-secret';
              if (key === 'LEDGER_HMAC_SECRET') return 'test-ledger-secret';
              if (key === 'TX_TOKEN_SECRET') return 'test-tx-secret';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('harus mengenkripsi dan mendekripsi NIK dengan benar (AES-256-GCM Round-trip)', () => {
    const originalNik = '1801051234560001';
    const encrypted = service.encryptNik(originalNik);

    expect(encrypted).toBeDefined();
    expect(encrypted).not.toEqual(originalNik);
    expect(encrypted.split(':')).toHaveLength(3); // iv:tag:cipher

    const decrypted = service.decryptNik(encrypted);
    expect(decrypted).toEqual(originalNik);
  });

  it('harus menghasilkan hash NIK deterministik (HMAC-SHA256)', () => {
    const nik = '1801051234560001';
    const hash1 = service.hashNik(nik);
    const hash2 = service.hashNik(nik);

    expect(hash1).toBeDefined();
    expect(hash1).toHaveLength(64); // SHA-256 hex
    expect(hash1).toEqual(hash2);
  });

  it('harus menghasilkan signature integritas buku besar (Ledger Signature)', () => {
    const entry = {
      walletId: 'w-1',
      transactionId: 't-1',
      entryType: 'CREDIT',
      currency: 'POINTS',
      amount: '50.00',
      balanceBefore: '100.00',
      balanceAfter: '150.00',
    };

    const sig1 = service.generateLedgerSignature(entry);
    const sig2 = service.generateLedgerSignature(entry);

    expect(sig1).toBeDefined();
    expect(sig1).toHaveLength(64);
    expect(sig1).toEqual(sig2);
  });

  it('harus menghasilkan OTP 6 digit angka numerik', () => {
    const otp = service.generateOtp();
    expect(otp).toMatch(/^[0-9]{6}$/);
  });
});
