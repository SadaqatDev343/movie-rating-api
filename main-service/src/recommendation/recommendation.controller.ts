import { Controller, Inject, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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

      const messageToPass = '67df828657e5dcf3e479fef6'; // The string you want to pass

      const resultA = await lastValueFrom(
        this.clientA.send('getdata', { message: messageToPass }).pipe(
          timeout(5000),
          catchError((err) => {
            console.error('Service A error:', err);
            return of('[]'); // Return empty array string on error
          })
        )
      );

      // Parse the result to extract just the movies array
      let moviesData = [];

      try {
        if (typeof resultA === 'string') {
          // If service returns just a JSON string
          moviesData = JSON.parse(resultA);
        } else if (resultA && typeof resultA.message === 'string') {
          // If service returns an object with message property that contains "Service A says:"
          const messageContent = resultA.message;
          const jsonStartIndex = messageContent.indexOf('[');

          if (jsonStartIndex !== -1) {
            const jsonPart = messageContent.substring(jsonStartIndex);
            moviesData = JSON.parse(jsonPart);
          }
        }
      } catch (parseError) {
        console.error('Error parsing service response:', parseError);
        moviesData = [];
      }

      return moviesData; // Return just the movies array directly
    } catch (error) {
      console.error('Error in gateway controller:', error);
      return [];
    }
  }
}
