import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  //CORS - Cho phép gọi API từ domain khác
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://web-full-itmo-course.onrender.com',
      'https://*.onrender.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
    credentials: true,
    maxAge: 86400,
  });

  // Cookie Parser - Đọc cookie từ request
  app.use(cookieParser());

  // Middleware cơ bản
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Method override cho HTML forms
  app.use((req: any, res: any, next: any) => {
    if (req.method === 'POST' && req.body && req.body._method) {
      const newMethod = req.body._method.toUpperCase();
      req.method = newMethod;
      delete req.body._method;
    }
    next();
  });


  // Dùng process.cwd() để lấy thư mục gốc project
  const projectRoot = process.cwd();
  // express.json() để parse JSON
  app.use(express.json());
  // express.urlencoded() để parse form data từ HTML
  app.use(express.urlencoded({ extended: true }));

  // Static files: public/
  app.useStaticAssets(join(projectRoot, 'public'));

  // Views: src/views/
  app.setBaseViewsDir(join(projectRoot, 'src', 'views'));
  app.setViewEngine('ejs');

  // Phần thêm vào từ lab4
  // 1. ValidationPipe - Kiểm tra dữ liệu đầu vào
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Xóa các field không có trong DTO
      forbidNonWhitelisted: true,  // Báo lỗi nếu có file lạ
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 3. Swagger/OpenAPI - Tài liệu API
  const config = new DocumentBuilder()
    .setTitle('Royal Travel API')
    .setDescription(`
      RESTful API cho hệ thống du lịch Royal Travel

      Các tính năng:
      - ToursDto: Quản lý tour du lịch Nga
      - DtoBookingsDto: Quản lý đặt tour
      - DtoFeedbacksDto: Quản lý đánh giá
      - DtoContactsDto: Quản lý liên hệ
      Công nghệ:
      - NestJS, Prisma, PostgreSQL
      - Validation với class-validator
      - Pagination với HATEOAS

      Authentication
      Sử dụng JWT Bearer Token để xác thực.
      1. Đăng nhập tại /auth/login
      2. Lấy token từ cookie hoặc dùng Bearer token
      3. Gửi token trong header: Authorization: Bearer <token>
    `)
    .setVersion('1.0')
    .addTag('Tours', 'Quản lý tour chung')
    .addTag('Bookings', 'Quản lý đặt tour')
    .addTag('Feedbacks', 'Quản lý đánh giá')
    .addTag('Contacts', 'Quản lý liên hệ')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập JWT token vào đây',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on port ${port}`);
  console.log(`Static files from: ${join(projectRoot, 'public')}`);
  console.log(`Views from: ${join(projectRoot, 'src', 'views')}`);
  logger.log(`Swagger UI: http://localhost:${port}/api-docs`);
  logger.log(`MVC: http://localhost:${port}`);
  logger.log(`API: http://localhost:${port}/api/tours`);
}

bootstrap();