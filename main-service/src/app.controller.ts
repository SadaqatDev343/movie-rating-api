import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { of, lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('SERVICE_A') private readonly clientA: ClientProxy
  ) {}

  @Get()
  async getHello() {
    try {
      console.log('Gateway endpoint accessed');

      // Using lastValueFrom instead of .toPromise() which is deprecated
      const resultA = await lastValueFrom(
        this.clientA.send('getHello', {}).pipe(
          timeout(5000),
          catchError((err) => {
            console.error('Service A error:', err);
            return of('Service A unavailable');
          })
        )
      );

      return this.appService.getHello(resultA);
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
