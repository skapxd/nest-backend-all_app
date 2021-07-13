import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { FirebaseService } from './providers/firebase/firebase.service';

async function bootstrap() {

  const env = new ConfigService()
  env.setEnv()
  
  // const firebase = new FirebaseService()
  // firebase.setCredential()

  const app = await NestFactory.create(AppModule);

  const port = env.port;

  app.enableCors();

  await app.listen(port, () => { });

  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();

