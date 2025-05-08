import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'src/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/view'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  let port = configService.get<number>('PORT') || 3000;
  await app.listen(configService.get<number>('PORT') || 3000, () => {
    console.log(`App is running at the : http://localhost:${port}`);
  });
}
bootstrap();
