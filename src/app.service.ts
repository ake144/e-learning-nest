import { Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
   constructor(@Inject(Cache) private readonly cache:Cache){}


  async getHello(): Promise<any> {
    await this.cache.set("greeting", "Hello World!");
    const greeting = await this.cache.get("greeting");
    return greeting;
  }
}
