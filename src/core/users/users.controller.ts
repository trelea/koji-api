import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAccessStrategyGuard } from '../auth/guards';
import { SkipThrottle } from '@nestjs/throttler';
import { UserConfiguredGuard } from 'src/common/guards/user-configured.guard';

@SkipThrottle()
@UseGuards(JwtAccessStrategyGuard, UserConfiguredGuard)
@Controller('users')
export class UsersController {
  @Get()
  async users() {
    return { users: ['Ann', 'Marcel', 'Igor'] };
  }
}
