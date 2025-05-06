import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configservice: ConfigService
  ) { }
  @Get()
  @Render('home.ejs')
  getHello() {
    const message = this.appService.getHello();
    console.log("check port", this.configservice.get<string>("PORT"))
    return { message };
  }
}
