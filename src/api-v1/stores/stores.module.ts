import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { FirebaseModule } from '../../providers/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [StoresController],
  providers: [StoresService]
})
export class StoresModule {}
