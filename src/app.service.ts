import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // Buat service
  getHello2(): string {
    return 'Hello2';
  }
}
