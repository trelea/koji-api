import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersCacheModule } from './cache/users-cache/users-cache.module';
import { MessagesCacheModule } from './cache/messages-cache/messages-cache.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    DatabaseModule,
    UsersCacheModule,
    MessagesCacheModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
