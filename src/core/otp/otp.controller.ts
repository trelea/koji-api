import {
  Body,
  Controller,
  Get,
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

/**
 * OTP Guard
 */
@UseGuards(OTPStrategyGuard)
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

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
    return await this.otpService.verifyOTP(hash, otp.otp, res);
  }
}
