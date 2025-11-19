import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configureApp } from './common/utils/app-config.util';

const PORT = Number(process.env.PORT) || 5000;
const API_URL = process.env.APP_URL ?? `http://localhost:${PORT}`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  const config = new DocumentBuilder()
    .setTitle('Tedly API')
    .setDescription('The Tedly API documentation')
    .setVersion('1.0')
    .addTag('category')
    .addServer(API_URL, 'Development server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Log Swagger URLs for easy access
  console.log(`📚 Swagger UI: ${API_URL}/api`);
  console.log(`📄 Swagger JSON (for Postman): ${API_URL}/api-json`);

  await app.listen(PORT);
}
bootstrap()
  .then(() => {
    console.log(`🚀 Server is running on ${API_URL}/api`);
  })
  .catch((e) => {
    console.error('Error - ', e);
  });
