import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { generate6DigitCode } from './utils';
import { readFile } from 'fs/promises';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MailService {
  private transporter;

  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAILTRAP_HOST'),
      port: this.config.get('MAILTRAP_PORT'),
      auth: {
        user: this.config.get('MAILTRAP_USER'),
        pass: this.config.get('MAILTRAP_PASSWORD'),
      },
    });
  }

  async sendRestPasswordMail(to: string) {
    const code = generate6DigitCode();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    let html = await readFile(
      'src/mail/templates/reset-password.html',
      'utf-8',
    );
    html = html.replace('{{CODE}}', code);

    try {
      await this.transporter.sendMail({
        from: '"WatchHub" <noreply@watchub.com>',
        to,
        subject: 'Reset Password',
        html,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Unable to send reset password email',
      );
    }

    return { expiresAt, code };
  }
}
