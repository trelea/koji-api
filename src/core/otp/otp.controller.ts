import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { OTPDto } from './dtos';
import { OTPStrategyGuard } from './guards';
import { Request, Response } from 'express';
import { User } from 'src/entities';
import { AuthService } from '../auth';

/**
 * OTP Guard
 */
@UseGuards(OTPStrategyGuard)
@Controller('otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Get('verify')
  async verifyToken(@Query('_tkn') token: string): Promise<boolean> {
    return true;
  }

  @Post('verify')
  async verifyOTP(
    @Query('_tkn') token: string,
    @Body() otp: OTPDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const hash = req.cookies['_tkn_hsh'];
    const verfied = await this.otpService.verifyOTP(hash, otp.otp, res);

    if (verfied instanceof User) {
      req.user = verfied;
      return await this.authService.login(req, res);
    }

    return false;
  }
}
