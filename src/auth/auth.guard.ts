import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { IS_PUBLIC_KEY, ROLES_KEY } from './auth.decorators';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config'; 

// AuthGuard kiểm tra đăng nhập
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, // đọc metadât từ decoảtor
        private jwtService: JwtService, // verìy JWT Oken
        private prisma: PrismaService, // lấy người dùng từ csdl
        private configService: ConfigService, 
    ) { }
   async canActivate(ctx: ExecutionContext): Promise<boolean> {
    //Cho phép GraphQL hoàn toàn (public)
        const contextType = ctx.getType() as string;
        if (contextType === 'graphql') {
        return true;
    }
         // Kiểm tra @Public() - ĐỌC CẢ method VÀ class
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (isPublic) return true;
        // cho phép truy cập nếu đường dẫn công khai  
        const request = ctx.switchToHttp().getRequest();

        // Safe access
        // Lấy token từ cookie hoặc header vì Web dùng cookie, API dùng header Authorization
        const token = request.cookies?.accessToken || request.headers.authorization?.split(' ')[1];

        if (!token) {
            // API routes thì trả về 401 JSON
            if (request.path.startsWith('/api')) {
                throw new UnauthorizedException('Vui lòng đăng nhập');
            }
            // Web routes -> false để middleware redirect
            return false;
        }

        try {
            // ktra với secret rõ ràng
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET') || 'royal-travel-secret',
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, fullName: true, role: true },
            });

            if (!user) {
                throw new UnauthorizedException('User không tồn tại');
            }

            //Gắn user vào request
            request.user = user;
            return true;
        } catch (error) {
            if (request.path.startsWith('/api')) {
                throw new UnauthorizedException('Token không hợp lệ');
            }
            return false;
        }
    }
}

// Role guard ktra role
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy roles yêu cầu từ @Roles() decorator
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    
    // Nếu không có role requirement -> cho phép
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Chưa đăng nhập');
    }
 // Kiểm tra user có role cần thiết không
    const hasRole = requiredRoles.some(role => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException(`Cần quyền: ${requiredRoles.join(' hoặc ')}`);
    }

    return true;
  }
}
