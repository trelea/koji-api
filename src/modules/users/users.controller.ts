import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAccessStrategyGuard } from '../auth/guards';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAccessStrategyGuard)
  @Get()
  async users() {}
}
