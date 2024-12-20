import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, HttpException } from '@nestjs/common';
import { AdvertisementService } from '../advertisement/_services/advertisement.service';
import { EmailService } from 'src/public/_services/email/email.service';
import { SubscriptionService } from '../subscription/_services/subscription.service';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { UpdateAdvertisementDto } from '../advertisement/_dto/update-advertisement.dto';
import { AdvertisementController } from '../advertisement/_controllers/ advertisement.controller';

describe('AdvertisementController', () => {
  let controller: AdvertisementController;
  let advertisementService: AdvertisementService;
  let emailService: EmailService;
  let subscriptionService: SubscriptionService;

  const mockAdvertisementService = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockEmailService = {
    sendAdvertisementEmail: jest.fn(),
    sendWelcomeEmail: jest.fn(),
  };

  const mockSubscriptionService = {
    findEmailsByApplication: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRuleAccessGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisementController],
      providers: [
        {
          provide: AdvertisementService,
          useValue: mockAdvertisementService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
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

    controller = module.get<AdvertisementController>(AdvertisementController);
    advertisementService =
      module.get<AdvertisementService>(AdvertisementService);
    emailService = module.get<EmailService>(EmailService);
    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendAdvertisementToSingle', () => {
    it('should send an advertisement to a single email', async () => {
      const mockAd = {
        id: 1,
        title: 'Ad Title',
        description: 'Ad Description',
        link: 'http://example.com',
        image: 'base64-image',
      };

      mockAdvertisementService.findOne.mockResolvedValue(mockAd);

      const result = await controller.sendAdvertisementToSingle(
        'test@example.com',
        1,
      );

      expect(advertisementService.findOne).toHaveBeenCalledWith(1);
      expect(emailService.sendAdvertisementEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          title: mockAd.title,
          description: mockAd.description,
          link: mockAd.link,
          image: mockAd.image,
        },
      );
      expect(result).toEqual({
        statusCode: 200,
        message: `Advertisement sent successfully to test@example.com.`,
      });
    });

    it('should throw new HttpException if advertisement is not found', async () => {
      mockAdvertisementService.findOne.mockResolvedValue(null);

      await expect(
        controller.sendAdvertisementToSingle('test@example.com', 1),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException on sending error', async () => {
      mockAdvertisementService.findOne.mockResolvedValue({});
      mockEmailService.sendAdvertisementEmail.mockRejectedValue(
        new Error('Email send failure'),
      );

      await expect(
        controller.sendAdvertisementToSingle('test@example.com', 1),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('sendAdvertisement', () => {
    it('should handle email sending errors gracefully', async () => {
      const emails = ['user1@example.com', 'user2@example.com'];
      const mockAd = {
        id: 1,
        title: 'Ad Title',
        description: 'Ad Description',
        link: 'http://example.com',
        image: 'base64-image',
      };

      mockSubscriptionService.findEmailsByApplication.mockResolvedValue(emails);
      mockAdvertisementService.findOne.mockResolvedValue(mockAd);

      mockEmailService.sendAdvertisementEmail.mockRejectedValueOnce(
        new Error('Email send failure'),
      );

      await expect(controller.sendAdvertisement(1, 1)).rejects.toThrow(
        HttpException,
      );

      expect(subscriptionService.findEmailsByApplication).toHaveBeenCalledWith(
        1,
      );
      expect(advertisementService.findOne).toHaveBeenCalledWith(1);
      expect(emailService.sendAdvertisementEmail).toHaveBeenCalledWith(
        'user1@example.com',
        {
          title: mockAd.title,
          description: mockAd.description,
          link: mockAd.link,
          image: mockAd.image,
        },
      )
    });
  });


  describe('create', () => {
    it('should create an advertisement', async () => {
      const createDto = {
        title: 'Ad Title',
        description: 'Ad Description',
        link: 'http://example.com',
        image: 'base64-image',
      };

      mockAdvertisementService.create.mockResolvedValue(createDto);

      const result = await controller.create(createDto);

      expect(advertisementService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        statusCode: 201,
        message: 'Advertisement created successfully',
        data: createDto,
      });
    });

    it('should throw HttpException on creation failure', async () => {
      const createDto = {
        title: 'Ad Title',
        description: 'Ad Description',
        link: 'http://example.com',
        image: 'base64-image',
      };

      mockAdvertisementService.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all advertisements', async () => {
      const mockAds = [
        { id: 1, title: 'Ad1' },
        { id: 2, title: 'Ad2' },
      ];
      mockAdvertisementService.findAll.mockResolvedValue(mockAds);

      const result = await controller.findAll();

      expect(advertisementService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 200,
        message: 'Advertisements retrieved successfully',
        data: mockAds,
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific advertisement', async () => {
      const mockAd = { id: 1, title: 'Ad1' };

      mockAdvertisementService.findOne.mockResolvedValue(mockAd);

      const result = await controller.findOne(1);

      expect(advertisementService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        statusCode: 200,
        message: `Advertisement with ID 1 retrieved successfully`,
        data: mockAd,
      });
    });

    it('should throw new HttpException if advertisement is not found', async () => {
      mockAdvertisementService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(1)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update an advertisement', async () => {
      const updateDto: UpdateAdvertisementDto = {
        title: 'Updated Ad',
        description: 'Updated Description',
        link: 'https://updated-link.com',
        image: 'base64-image',
      };
      const updatedAd = {
        id: 1,
        title: 'Updated Ad',
        description: 'Updated Description',
        link: 'https://updated-link.com',
        image: 'base64-image',
      };

      mockAdvertisementService.update.mockResolvedValue(updatedAd);

      const result = await controller.update(1, updateDto);

      expect(advertisementService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Advertisement updated successfully',
        data: updatedAd,
      });
    });
  });

  describe('delete', () => {
    it('should delete an advertisement', async () => {
      mockAdvertisementService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(advertisementService.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Advertisement deleted successfully',
      });
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send a welcome email', async () => {
      mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined);

      const result = await controller.sendWelcomeEmail('test@example.com');

      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual({
        statusCode: 200,
        message: `Welcome email sent successfully to test@example.com.`,
      });
    });
  });
});

