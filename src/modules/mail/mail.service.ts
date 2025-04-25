import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );
  }

  async sendOtpTo(email: string, otp: string) {
    try {
      return await this.resend.emails.send({
        from: 'KOJI <koji@devcompare.md>',
        to: email,
        subject: 'Your KOJI Verification Code',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333;">KOJI</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
            <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">Use the following code to complete your verification:</p>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #777; margin-top: 20px;">This code will expire in 5 minutes.</p>
          </div>
          <div style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
            <p>If you didn't request this code, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} KOJI App. All rights reserved.</p>
          </div>
        </div>
      `,
        text: `Your KOJI verification code is: ${otp}. This code will expire in 5 minutes.`,
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
