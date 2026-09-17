import { Module, DynamicModule, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RolesGuard } from './auth.guard';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';

// auth service xử lý logic nghiệp vụ đnagư nhâp, đăng kí

@Global()
@Module({})
export class AuthModule implements NestModule {
    static forRoot(secret?: string): DynamicModule {
        return {
            module: AuthModule,
            global: true,
            imports: [
                PassportModule,
                JwtModule.register({
                    secret: secret || process.env.JWT_SECRET || 'royal-travel-secret',
                    signOptions: { expiresIn: '7d' },
                }),
            ],
            controllers: [AuthController],
            providers: [
                AuthService,
                PrismaService,
                { provide: APP_GUARD, useClass: AuthGuard },
                { provide: APP_GUARD, useClass: RolesGuard },
            ],
            exports: [AuthService, JwtModule],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('*');
    }
}