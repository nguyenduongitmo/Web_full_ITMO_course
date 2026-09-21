import { Controller, Get, Post, Body, Res, Render } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './auth.decorators';
import * as express from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController() // ẩn khỏi swagger
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Get('login')
    @Render('auth/login')
    showLoginPage() { return { title: 'ROYAL TRAVEL - Đăng nhập' } }

    @Public()
    @Post('login')
    async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
        try {
            const result = await this.authService.login(body.email, body.password);
            res.cookie('accessToken', result.token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
            return res.redirect('/');
        } catch (error: any) {
            return res.render('auth/login', {
                title: 'ROYAL TRAVEL - Đăng nhập',
                error: error.message,
                email: body.email,
            });
        }
    }

    @Public()
    @Get('register')
    @Render('auth/register')
    showRegisterPage() {
        return { title: 'ROYAL TRAVEL - Đăng kí' };
    }

    @Public()
    @Post('register')
    async register(@Body() body: { email: string; fullName: string; password: string; confirmPassword: string }, @Res() res: Response) {
        try {
            if (body.password !== body.confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }
            if (body.password.length < 6) {
                throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
            }

            const result = await this.authService.register(
                body.email,
                body.fullName,
                body.password,
            );

            res.cookie('accessToken', result.token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });

            return res.redirect('/');
        } catch (error: any) {
            return res.render('auth/register', {
                title: 'ROYAL TRAVEL - Đăng ký',
                error: error.message,
                email: body.email,
                fullName: body.fullName,
            });
        }
    }

    @Get('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('accessToken', {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return res.redirect('/');
    }


}

