// email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Bem-vindo(a)!',
      template: './welcome',
      context: {
        name: to,
      },
    });
  }

  async sendAdvertisementEmail(
    to: string,
    ad: { title: string; description: string; link: string; image?: string },
  ) {
    await this.mailerService.sendMail({
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
  }
}
