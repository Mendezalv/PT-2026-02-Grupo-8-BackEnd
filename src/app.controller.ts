import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { IsPublic } from './auth/decorators/is-public.decorator';
import { User } from './user/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @IsPublic()
  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('me')
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
