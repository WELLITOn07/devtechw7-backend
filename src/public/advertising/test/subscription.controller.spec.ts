import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { SubscriptionController } from '../subscription/_controllers/subscription.controller';
import { SubscriptionService } from '../subscription/_services/subscription.service';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let subscriptionService: SubscriptionService;

  const mockSubscriptionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findEmailsByApplication: jest.fn(),
    remove: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRuleAccessGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: mockSubscriptionService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RuleAccessGuard)
      .useValue(mockRuleAccessGuard)
      .compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a subscription', async () => {
      const createDto = { email: 'test@example.com', applicationIds: [1, 2] };
      const mockSubscription = { id: 1, ...createDto };

      mockSubscriptionService.create.mockResolvedValue(mockSubscription);

      const result = await controller.create(createDto);

      expect(subscriptionService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        statusCode: 201,
        message: 'Subscription created successfully',
        data: mockSubscription,
      });
    });

    it('should throw HttpException on creation failure', async () => {
      const createDto = { email: 'test@example.com', applicationIds: [1, 2] };
      mockSubscriptionService.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(HttpException);

      await expect(controller.create(createDto)).rejects.toMatchObject({
        response: {
          message: 'Failed to create subscription: Database error',
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should retrieve all subscriptions', async () => {
      const mockSubscriptions = [
        { id: 1, email: 'test@example.com', applicationIds: [1, 2] },
      ];
      mockSubscriptionService.findAll.mockResolvedValue(mockSubscriptions);

      const result = await controller.findAll();

      expect(subscriptionService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 200,
        message: 'Subscriptions retrieved successfully',
        data: mockSubscriptions,
      });
    });

    it('should throw HttpException on retrieval failure', async () => {
      mockSubscriptionService.findAll.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.findAll()).rejects.toThrow(HttpException);

      await expect(controller.findAll()).rejects.toMatchObject({
        response: {
          message: 'Failed to retrieve subscriptions: Database error',
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    });
  });

  describe('findByApplication', () => {
    it('should retrieve emails by application ID', async () => {
      const mockEmails = ['user1@example.com', 'user2@example.com'];
      mockSubscriptionService.findEmailsByApplication.mockResolvedValue(
        mockEmails,
      );

      const result = await controller.findByApplication(1);

      expect(subscriptionService.findEmailsByApplication).toHaveBeenCalledWith(
        1,
      );
      expect(result).toEqual({
        statusCode: 200,
        message: `Emails for application ID 1 retrieved successfully`,
        data: mockEmails,
      });
    });

    it('should throw HttpException on retrieval failure', async () => {
      mockSubscriptionService.findEmailsByApplication.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.findByApplication(1)).rejects.toThrow(
        HttpException,
      );

      await expect(controller.findByApplication(1)).rejects.toMatchObject({
        response: {
          message:
            'Failed to retrieve emails for application ID 1: Database error',
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a subscription', async () => {
      mockSubscriptionService.remove.mockResolvedValue({ id: 1 });

      await controller.remove(1);

      expect(subscriptionService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw HttpException if subscription not found', async () => {
      mockSubscriptionService.remove.mockRejectedValue(new Error('Not found'));

      await expect(controller.remove(1)).rejects.toThrow(HttpException);

      await expect(controller.remove(1)).rejects.toMatchObject({
        response: {
          message: 'Failed to delete subscription: Not found',
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    });
  });

  describe('findByEmail', () => {
    it('should retrieve a subscription by email', async () => {
      const mockSubscription = {
        id: 1,
        email: 'test@example.com',
        applicationIds: [1, 2],
      };
      mockSubscriptionService.findByEmail.mockResolvedValue(mockSubscription);

      const result = await controller.findByEmail('test@example.com');

      expect(subscriptionService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual({
        statusCode: 200,
        message:
          'Subscription with email test@example.com retrieved successfully',
        data: mockSubscription,
      });
    });

    it('should throw HttpException if email not found', async () => {
      mockSubscriptionService.findByEmail.mockResolvedValue(null);

      await expect(controller.findByEmail('test@example.com')).rejects.toThrow(
        HttpException,
      );

      await expect(
        controller.findByEmail('test@example.com'),
      ).rejects.toMatchObject({
        response: {
          message:
            'Failed to retrieve subscription: Subscription with email test@example.com not found',
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    });
  });
});
