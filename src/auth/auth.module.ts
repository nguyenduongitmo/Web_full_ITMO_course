import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, RolesGuard } from './auth.guard';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthApiController } from './auth-api.controller';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET') || 'royal-travel-secret';
        console.log('JWT Secret (sign & verify):', secret);
        return {
          secret,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
  ],
  controllers: [AuthController, AuthApiController],
  providers: [
    AuthService,
    PrismaService,
    AuthGuard,    //  Đăng ký provider
    RolesGuard,   //  Đăng ký provider
  ],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
    AuthGuard,    //  Export để module khác dùng
    RolesGuard,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}