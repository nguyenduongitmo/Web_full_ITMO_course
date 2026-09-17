import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'

// middlewware chueyẻn hướng web nếu chưa đnagư nhập
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        // ĐỌc cookíe và gắn user trước 
        const token = req.cookies?.accessToken;

        if (token) {
            try {
                const payload = this.jwtService.verify(token);
                const user = await this.prisma.user.findUnique({
                    where: { id: payload.sub },
                    select: { id: true, email: true, fullName: true, role: true },
                });

                if (user) {
                    req['user'] = user;  // găn user trước khi skip
                    console.log('User attached:', user.email);
                }
            }
                catch (error) {
                res.clearCookie('accessToken');
                console.log('Invalid token');
            }
        } else {
            console.log('No token');
        }

        
        // 1. Bỏ qua static files, API, auth pages
        const publicRoutes = [
            '/', // Trang chủ                   
            '/user/tours',          // Danh sách tour
            '/user/tours/',         // Chi tiết tour (có ID)
            '/contact',             // Liên hệ
            '/auth/login',          // Đăng nhập
            '/auth/register',       // Đăng ký
            '/auth/logout',         // Đăng xuất
            '/api-docs',            // Swagger
            '/graphql',             // GraphQL
        ];
        for (const route of publicRoutes) {
            if (req.path === route || req.path.startsWith(route + '/')) {
                return next();
            }
        }

        //Skip static files (CSS, JS, images)
        if (/\.(css|js|jpg|png|svg|ico|webp|gif)$/.test(req.path)) {
            return next();
        }

        // Skip API routes (để AuthGuard xử lý) vì API cần trả về JSON, không phải HTML redirect
        if (req.path.startsWith('/api')) {
            return next();
        }

        //2. Xử lý WEB routes đểRedirect về login nếu chưa authenticated
        //Lấy token từ cookie

       if (!req['user']) {
            console.log('Not logged in, redirect to /auth/login');
            return res.redirect('/auth/login');
        }

        console.log('Access granted:', req.path);
        next();
    }
}

