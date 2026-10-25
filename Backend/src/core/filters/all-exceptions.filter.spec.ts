import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: any;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockRequest = {
      method: 'GET',
      url: '/api/v1/test',
    };
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };
  });

  it('harus memetakan HttpException standar ke envelope JSON dengan errorCode', () => {
    const exception = new HttpException(
      { errorCode: 'ERR_VALIDATION_FAILED', message: 'Input tidak valid' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        errorCode: 'ERR_VALIDATION_FAILED',
        message: 'Input tidak valid',
        path: '/api/v1/test',
      }),
    );
  });

  it('harus memetakan Prisma P2002 ke ERR_DUPLICATE_ENTRY (409 Conflict)', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '5.22.0',
        meta: { target: ['phoneNumber'] },
      },
    );

    filter.catch(prismaError, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        errorCode: 'ERR_DUPLICATE_ENTRY',
        path: '/api/v1/test',
      }),
    );
  });

  it('harus memetakan Prisma P2025 ke ERR_RESOURCE_NOT_FOUND (404 Not Found)', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Record not found',
      {
        code: 'P2025',
        clientVersion: '5.22.0',
      },
    );

    filter.catch(prismaError, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        path: '/api/v1/test',
      }),
    );
  });
});
