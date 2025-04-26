import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { DatabaseModule } from 'src/database';
import { UserDetails } from 'src/entities';
import { UsersModule } from 'src/core/users';
import { AwsS3Module } from '../aws-s3';

@Module({
  imports: [DatabaseModule.forFeature([UserDetails]), UsersModule, AwsS3Module],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
