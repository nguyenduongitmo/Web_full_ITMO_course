import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        // tạo token 
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        // trả về user và token
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    async register(email:string, fullName:string, password:string){
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email đã được đăng ký');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Tạo user mới
        const user = await this.prisma.user.create({
            data: {
                email,
                fullName,
                password: hashedPassword,
                role: 'USER',
            },
        });

        // Tạo token
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };

    }

    async getUserById(id:string){
        return this.prisma.user.findUnique({
            where: {id},
            select: {id:true, email:true, fullName:true, role :true},
        });
    }

}