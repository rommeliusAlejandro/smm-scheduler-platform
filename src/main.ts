import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { APPLICATION_CONFIG } from '@smm/config/constants';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get(`${APPLICATION_CONFIG}.port`);

  const options = new DocumentBuilder()
    .setTitle('SMM Scheduler')
    .setDescription('SMM Scheduler API')
    .setVersion('1.0')
    .addTag('SMM Scheduler')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  Logger.log(`Application started at port ${port}`);
  app.enableCors();
  await app.listen(port);
}
bootstrap();
