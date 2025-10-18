import { Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  //  constructor(@Inject(Cache) private readonly cache:Cache){}


  async getHello(): Promise<any> {
    const greeting = { message: 'Hello World!' };
    return greeting;
  }
}
