import { Controller, Inject, Get } from '@nestjs/common';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
// Adjust this path as needed
import { lastValueFrom } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
    @Inject('SERVICE_A') private readonly clientA: ClientProxy
  ) {}

  @Get()
  async getRecommendation() {
    try {
      console.log('Gateway endpoint accessed');

      const resultA = await lastValueFrom(
        this.clientA.send('getHello', {}).pipe(
          timeout(5000),
          catchError((err) => {
            console.error('Service A error:', err);
            return of('Service A unavailable');
          })
        )
      );

      return this.recommendationService.getHello(resultA);
    } catch (error) {
      console.error('Error in gateway controller:', error);
      return { error: 'Internal gateway error', message: error.message };
    }
  }
}
