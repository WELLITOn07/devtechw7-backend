import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let httpExceptionFilter: HttpExceptionFilter;

  beforeEach(() => {
    httpExceptionFilter = new HttpExceptionFilter();
  });

  it('should handle HttpException correctly', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    httpExceptionFilter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Test error',
      error: 'HttpException',
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should handle non-HttpException errors correctly', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;

    const exception = new Error('Unexpected error');

    httpExceptionFilter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Unexpected error',
      error: 'Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('should handle exceptions with response object correctly', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;

    const exception = {
      response: {
        message: ['Error part 1', 'Error part 2'],
      },
      name: 'ValidationError',
    };

    httpExceptionFilter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error part 1, Error part 2',
      error: 'ValidationError',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});
