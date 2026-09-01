import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Dùng process.cwd() để lấy thư mục gốc project
  const projectRoot = process.cwd();
  // express.json() để parse JSON
  app.use(express.json());
  // express.urlencoded() để parse form data từ HTML
  app.use(express.urlencoded({ extended: true }));

  app.use((req: any, res: any, next: any) => {
    if (req.method === 'POST' && req.body && req.body._method) {
      const newMethod = req.body._method.toUpperCase();
      req.method = newMethod;
      delete req.body._method;
    }
    next();
  });
  
  // Static files: public/
  app.useStaticAssets(join(projectRoot, 'public'));

  // Views: src/views/
  app.setBaseViewsDir(join(projectRoot, 'src', 'views'));
  app.setViewEngine('ejs');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on port ${port}`);
  console.log(`Static files from: ${join(projectRoot, 'public')}`);
  console.log(`Views from: ${join(projectRoot, 'src', 'views')}`);
}

bootstrap();