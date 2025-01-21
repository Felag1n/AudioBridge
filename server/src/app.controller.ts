import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: 'AudioBridge API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString()
    };
  }
}