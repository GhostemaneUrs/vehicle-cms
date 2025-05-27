import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cfg = app.get(ConfigService);
  const port = cfg.get<number>('config.port');

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CMS Vehicles Transfers API')
    .setDescription('Multitenancy vehicles transfers module')
    .setVersion('1.0')
    .addCookieAuth('Authentication', {
      type: 'apiKey',
      in: 'cookie',
      name: 'Authentication',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      requestCredentials: 'include',
    },
    customSiteTitle: 'CMS Transfers Docs',
  });

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/docs`);
}

bootstrap();
