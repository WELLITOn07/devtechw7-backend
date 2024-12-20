import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    registerUser: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should return a message and access_token on successful registration', async () => {
      const registerDto = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
        birthAt: new Date('1990-01-01'),
        createdAt: new Date(),
        rule: ['COMMON'],
      };

      const mockResponse = {
        message: 'User created successfully',
        access_token: 'test_token',
      };

      mockAuthService.registerUser.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      expect(authService.registerUser).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockResponse);
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        id: 2,
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password',
        birthAt: new Date('1990-01-01'),
        createdAt: new Date(),
        rule: ['COMMON'],
      };

      mockAuthService.registerUser.mockRejectedValue(
        new ConflictException('User with email existing@example.com already exists'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(authService.registerUser).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should return access_token and user on successful login', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockResponse = {
        access_token: 'test_token',
        user: { id: 1, email: loginDto.email, name: 'Test User' },
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto, { headers: { origin: 'http://localhost' } });

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        'http://localhost',
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw BadRequestException on login failure', async () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(
        new BadRequestException('Login failed'),
      );

      await expect(controller.login(loginDto, { headers: { origin: 'http://localhost' } })).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        'http://localhost',
      );
    });
  });
});

