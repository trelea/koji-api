import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { SetupDto } from './dtos';
import { ProfileService } from './profile.service';
import { User } from 'src/entities';
import { DeepPartial } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThumbValidationPipe } from 'src/common/pipes';

@UseGuards(JwtAccessStrategyGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('setup')
  @UseInterceptors(FileInterceptor('thumb'))
  async setup(
    @Body() details: SetupDto,
    @Req() req: Request,
    @UploadedFile(ThumbValidationPipe) thumb?: Express.Multer.File,
  ) {
    if (req.user?.details) throw new ConflictException('Profile already setup');
    return await this.profileService.setup(
      req.user as DeepPartial<User>,
      details,
      thumb,
    );
  }
}
