import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '../config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UserExceptionFilter } from './filters/user-exception.filter';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';

@Module({
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_FILTER,
      useClass: UserExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
  exports: [UsersService, AuthService],
  imports: [
    // great when you do not have config module, or you do not do any dependent async
    // requests, for more complex situations you should use registerAsync
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3d' },
    }),
    // for more complex configs
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.JWT_SECRET,
        signOptions: { expiresIn: '3d' },
      }),
    }),
    ConfigModule,
  ],
})
export class UsersModule {}
