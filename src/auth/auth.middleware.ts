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

        // Skip API docs và GraphQL
        if (req.path.startsWith('/api-docs') || req.path.startsWith('/graphql')) {
            return next();
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
        const token = req.cookies?.accessToken;

        if (!token) {
            // Chưa login -> redirect về login
            return res.redirect('/auth/login');
        }

        try {
            //  Verify token
            const payload = this.jwtService.verify(token);

            // Lấy user từ db
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, fullName: true, role: true },
            });

            if (!user) {
                // Token hợp lệ nhưng user không tồn tại -> clear cookie
                res.clearCookie('accessToken');
                return res.redirect('/auth/login');
            }

            // Gắn user vào request để controller dùng
            req['user'] = user;
            next();
        } catch (error) {
            // Token không hợp lệ -> clear cookie và redirect
            res.clearCookie('accessToken');
            return res.redirect('/auth/login');
        }
    }
}


