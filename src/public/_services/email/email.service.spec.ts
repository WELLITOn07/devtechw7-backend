import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('EmailService', () => {
  let emailService: EmailService;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('sendWelcomeEmail', () => {
    it('should call mailerService.sendMail with correct parameters', async () => {
      const to = 'test@example.com';

      await emailService.sendWelcomeEmail(to);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to,
        subject: 'Bem-vindo(a)!',
        template: './welcome',
        context: {
          name: to,
        },
      });
    });

    it('should throw an error if sendMail fails', async () => {
      const to = 'test@example.com';
      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(emailService.sendWelcomeEmail(to)).rejects.toThrow(
        'Failed to send email',
      );
    });
  });

  describe('sendAdvertisementEmail', () => {
    it('should call mailerService.sendMail with correct parameters', async () => {
      const to = 'test@example.com';
      const ad = {
        title: 'Special Offer',
        description: 'Get 50% off your next purchase!',
        link: 'https://example.com',
        image: 'https://example.com/image.jpg',
      };

      await emailService.sendAdvertisementEmail(to, ad);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to,
        subject: ad.title,
        template: './advertisement',
        context: {
          title: ad.title,
          description: ad.description,
          link: ad.link,
          image: ad.image,
        },
      });
    });

    it('should throw an error if sendMail fails', async () => {
      const to = 'test@example.com';
      const ad = {
        title: 'Special Offer',
        description: 'Get 50% off your next purchase!',
        link: 'https://example.com',
      };

      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(emailService.sendAdvertisementEmail(to, ad)).rejects.toThrow(
        'Failed to send email',
      );
    });
  });
});

