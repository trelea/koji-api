import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserDetails } from 'src/entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dtos';
import { CryptographyService } from 'src/cryptography';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly cryptography: CryptographyService,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    try {
      user.password = await this.cryptography.encrypt(user.password);
      const userInstance = this.userRepository.create(user);
      return await this.userRepository.save(userInstance);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findUserBy(
    query: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: query,
        relations: { details: true },
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
