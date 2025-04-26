import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserDetails } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: parseInt(configService.getOrThrow<string>('DB_PORT') || '5432'),
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASS'),
        database: configService.getOrThrow<string>('DB_NAME'),
        synchronize: true,
        entities: [User, UserDetails],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule extends TypeOrmModule {}
