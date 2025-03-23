import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(serviceA: string): any {
    return {
      message: `Service A says: ${serviceA}`,
      timestamp: new Date().toISOString(),
    };
  }
}
