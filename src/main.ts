import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('config.port');

  app.use(helmet());
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CMS Vehicles Transfers API')
    .setDescription('Multitenancy vehicles transfers module')
    .setVersion('1.0')
    .addCookieAuth('Authentication', {
      name: 'Authentication',
      type: 'apiKey',
      in: 'cookie',
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
  console.log(`Application is running on: http://localhost:${port}/docs`);
}

bootstrap();
