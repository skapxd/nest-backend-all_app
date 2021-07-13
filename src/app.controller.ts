import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AppService } from './app.service';
// import { FirebaseService } from './providers/firebase/firebase.service';

@Controller()
export class AppController {

  constructor(
    private appService: AppService,
    // private firebase: FirebaseService,
  ) { }

  @Get()
  home() {
    return this.appService.getHello()
  }
}
