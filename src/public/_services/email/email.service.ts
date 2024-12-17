import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Bem-vindo(a)!',
      text: 'Este é um e-mail de boas-vindas.',
      html: '<p>Este é um <b>e-mail</b> de boas-vindas.</p>',
    });
  }
}
