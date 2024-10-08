import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return `Hello World! - Node Environment: ${process.env.NODE_ENV}`;
  }
}
