import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos';
import { Request, Response } from 'express';
import {
  LocalStrategyGuard,
  JwtAccessStrategyGuard,
  JwtRefreshStrategyGuard,
} from './guards';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() user: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(user, res);
  }

  @UseGuards(LocalStrategyGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(req, res);
  }

  @SkipThrottle()
  @UseGuards(JwtAccessStrategyGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(req, res);
  }

  @SkipThrottle()
  @UseGuards(JwtRefreshStrategyGuard)
  @Post('refresh-token')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(req, res);
  }
}
