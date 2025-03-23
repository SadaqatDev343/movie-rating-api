import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ServiceAService } from './app.service';

@Controller()
export class ServiceAController {
  constructor(private readonly serviceAService: ServiceAService) {}

  // This handles microservice messages
  @MessagePattern('getdata')
  async getHelloMessage(data: any): Promise<string> {
    console.log('Service A received microservice request');
    // Extract the message from the data
    const receivedMessage = data.message || 'No message received';
    // Pass the received message to the service and return raw result
    return await this.serviceAService.serviceA(receivedMessage);
  }

  // Optional: Add more HTTP endpoints as needed
  @Get('status')
  getStatus(): any {
    return {
      service: 'Service A',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }
}
