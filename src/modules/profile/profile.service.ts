import { BadRequestException, Injectable } from '@nestjs/common';
import { SetupDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserDetails } from 'src/entities';
import { DeepPartial, Repository } from 'typeorm';
import { UsersService } from 'src/core/users';
import { AwsS3Service } from '../aws-s3';
import { AwsS3UploadFileResponseType } from '../aws-s3/types';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly usersService: UsersService,
    private readonly awsS3Service: AwsS3Service,
  ) {}
  async setup(
    user: DeepPartial<User>,
    details: SetupDto,
    file?: Express.Multer.File,
  ) {
    try {
      let thumb: AwsS3UploadFileResponseType | null = null;
      if (file) thumb = await this.awsS3Service.uploadFile(file, user);

      details.hashname = `#${details.hashname}`;
      await this.userDetailsRepository.save(
        this.userDetailsRepository.create({
          user,
          thumb: thumb?.url,
          ...details,
        }),
      );
      const { password, ...rest } = (await this.usersService.findUserBy({
        id: user.id,
      })) as User;
      return rest;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
