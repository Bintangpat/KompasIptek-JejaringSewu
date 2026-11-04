import { Test, TestingModule } from '@nestjs/testing';
import { OutboxProcessor } from './outbox.processor';
import { PrismaService } from '../../../core/database/prisma.service';
import { FcmProvider } from '../providers/fcm.provider';
import { ResendProvider } from '../providers/resend.provider';

describe('OutboxProcessor - Smart OTP Dispatcher (Unit Test)', () => {
  let processor: OutboxProcessor;
  let fcmProvider: FcmProvider;
  let resendProvider: ResendProvider;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    outboxEvent: {
      update: jest.fn().mockResolvedValue({ id: 'evt-1', status: 'COMPLETED' }),
    },
  };

  const mockFcmProvider = {
    sendPush: jest.fn().mockResolvedValue(undefined),
    sendOtp: jest.fn().mockResolvedValue(undefined),
  };

  const mockResendProvider = {
    sendOtpEmail: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutboxProcessor,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: FcmProvider, useValue: mockFcmProvider },
        { provide: ResendProvider, useValue: mockResendProvider },
      ],
    }).compile();

    processor = module.get<OutboxProcessor>(OutboxProcessor);
    fcmProvider = module.get<FcmProvider>(FcmProvider);
    resendProvider = module.get<ResendProvider>(ResendProvider);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('Web Route: harus langsung mengirim OTP via Email Resend tanpa memanggil FCM', async () => {
    const job = {
      data: {
        id: 'event-web-1',
        eventType: 'SMART_OTP',
        payload: {
          userId: 'user-1',
          email: 'warga@pringsewu.id',
          otpCode: '123456',
          purpose: 'REGISTRATION',
          platform: 'web',
        },
      },
    } as any;

    await processor.process(job);

    expect(resendProvider.sendOtpEmail).toHaveBeenCalledTimes(1);
    expect(resendProvider.sendOtpEmail).toHaveBeenCalledWith({
      to: 'warga@pringsewu.id',
      otpCode: '123456',
      purpose: 'REGISTRATION',
    });
    expect(fcmProvider.sendOtp).not.toHaveBeenCalled();
    expect(mockPrisma.outboxEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'event-web-1' },
        data: expect.objectContaining({ status: 'COMPLETED' }),
      }),
    );
  });

  it('Mobile Route (Sukses FCM): harus mengirim OTP via FCM dan tidak memanggil Email', async () => {
    const job = {
      data: {
        id: 'event-mobile-1',
        eventType: 'FCM_OTP',
        payload: {
          userId: 'user-2',
          phoneNumber: '081234567890',
          email: 'petani@pringsewu.id',
          fcmToken: 'valid-fcm-device-token',
          otpCode: '654321',
          purpose: 'REGISTRATION',
          platform: 'mobile',
        },
      },
    } as any;

    await processor.process(job);

    expect(fcmProvider.sendOtp).toHaveBeenCalledTimes(1);
    expect(fcmProvider.sendOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'valid-fcm-device-token',
        otpCode: '654321',
      }),
    );
    expect(resendProvider.sendOtpEmail).not.toHaveBeenCalled();
  });

  it('Mobile Route (Galat FCM): harus melakukan failover otomatis ke Email Resend jika FCM gagal', async () => {
    mockFcmProvider.sendOtp.mockRejectedValueOnce(
      new Error('messaging/registration-token-not-registered'),
    );

    const job = {
      data: {
        id: 'event-mobile-fallback',
        eventType: 'SMART_OTP',
        payload: {
          userId: 'user-3',
          phoneNumber: '081234567899',
          email: 'fallback@pringsewu.id',
          fcmToken: 'expired-fcm-token',
          otpCode: '777888',
          purpose: 'FORGOT_PASSWORD',
          platform: 'mobile',
        },
      },
    } as any;

    await processor.process(job);

    expect(fcmProvider.sendOtp).toHaveBeenCalledTimes(1);
    expect(resendProvider.sendOtpEmail).toHaveBeenCalledTimes(1);
    expect(resendProvider.sendOtpEmail).toHaveBeenCalledWith({
      to: 'fallback@pringsewu.id',
      otpCode: '777888',
      purpose: 'FORGOT_PASSWORD',
    });
    expect(mockPrisma.outboxEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'event-mobile-fallback' },
        data: expect.objectContaining({ status: 'COMPLETED' }),
      }),
    );
  });

  it('Mobile Route (Token FCM Kosong): harus langsung mengalihkan ke Email Resend', async () => {
    const job = {
      data: {
        id: 'event-mobile-no-token',
        eventType: 'SMART_OTP',
        payload: {
          userId: 'user-4',
          phoneNumber: '081234567899',
          email: 'user-no-fcm@pringsewu.id',
          fcmToken: null,
          otpCode: '999000',
          purpose: 'REGISTRATION',
          platform: 'mobile',
        },
      },
    } as any;

    await processor.process(job);

    expect(resendProvider.sendOtpEmail).toHaveBeenCalledTimes(1);
    expect(resendProvider.sendOtpEmail).toHaveBeenCalledWith({
      to: 'user-no-fcm@pringsewu.id',
      otpCode: '999000',
      purpose: 'REGISTRATION',
    });
  });
});
