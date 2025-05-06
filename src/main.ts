import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'src/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/view'));
  app.setViewEngine('ejs');
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT') || 3000, () => {
    console.log(`App is running at the : localhost:3000`);
  });
}
bootstrap();
