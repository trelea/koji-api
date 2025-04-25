import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserDetails } from 'src/entities';
import { CryptographyService } from 'src/cryptography';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDetails])],
  controllers: [UsersController],
  providers: [UsersService, CryptographyService],
  exports: [UsersService],
})
export class UsersModule {}
