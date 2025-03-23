import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { of, lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    try {
      return this.appService.getHello();
    } catch (error) {
      console.error('Error in gateway controller:', error);
      return { error: 'Internal gateway error', message: error.message };
    }
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'gateway' };
  }
}
