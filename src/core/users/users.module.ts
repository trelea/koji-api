import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { UserDetails } from 'src/entities';
import { CryptographyService } from 'src/cryptography';
import { DatabaseModule } from 'src/database';

@Module({
  imports: [DatabaseModule.forFeature([User, UserDetails])],
  controllers: [UsersController],
  providers: [UsersService, CryptographyService],
  exports: [UsersService],
})
export class UsersModule {}
