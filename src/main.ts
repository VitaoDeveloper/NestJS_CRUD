import { AppValidation } from './utils/app-validation.util';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(AppValidation)

  await setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
