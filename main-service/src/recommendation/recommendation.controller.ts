import { Controller, Inject, Get, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { lastValueFrom, of } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@ApiTags('recommendation')
@Controller('recommendation')
export class RecommendationController {
  constructor(@Inject('SERVICE_A') private readonly clientA: ClientProxy) {}

  @ApiBearerAuth('JWT-auth') // Adding JWT authentication
  @ApiOperation({ summary: 'Get movie recommendations based on service ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched movie recommendations.',
    type: [String], // You can modify this type based on the structure of the response
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid parameters.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  @ApiParam({
    name: 'serid',
    required: true,
    description: 'user id for getting the recommendation',
    type: String,
  })
  @Get(':serid')
  async getRecommendation(@Param('serid') serid: string) {
    try {
      console.log('Gateway endpoint accessed with serid:', serid);

      const resultA = await lastValueFrom(
        this.clientA.send('getdata', { message: serid }).pipe(
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
          moviesData = JSON.parse(resultA);
        } else if (resultA && typeof resultA.message === 'string') {
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

      return moviesData;
    } catch (error) {
      console.error('Error in gateway controller:', error);
      return [];
    }
  }
}
