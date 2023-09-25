import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { ConfigService } from './config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // getting the dependency in other way than using the constructor
  const config: ConfigService = app.get(ConfigService);

  app.useStaticAssets(config.STORAGE_ASSETS);
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, 'views'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mój Projekt w Nest')
    .setDescription('Przykładowy projekt w Node.js i TypeScript')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { persistAuthorization: true },
  };

  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(config.PORT || 3000);
}
bootstrap();
