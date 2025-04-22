import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos';
import { Request, Response } from 'express';
import {
  LocalStrategyGuard,
  JwtAccessStrategyGuard,
  JwtRefreshStrategyGuard,
} from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: RegisterDto) {
    return await this.authService.register(user);
  }

  @UseGuards(LocalStrategyGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(req, res);
  }

  @UseGuards(JwtAccessStrategyGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    return await this.authService.logout(req);
  }

  /**
   * Some Test Endpoints for jwt-access-token
   */
  @UseGuards(JwtAccessStrategyGuard)
  @Get('status')
  status(@Req() req: Request) {
    return { msg: req.user };
  }

  @UseGuards(JwtRefreshStrategyGuard)
  @Post('refresh')
  refresh() {
    return { msg: 'REFRESH' };
  }
}
