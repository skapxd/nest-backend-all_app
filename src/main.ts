import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {

  const env = new ConfigService()
  env.setEnv()

  const app = await NestFactory.create(AppModule);

  const port = env.port;

  app.enableCors();

  await app.listen(port, () => { });

  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();

