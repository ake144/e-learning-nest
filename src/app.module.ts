import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';


@Module({
  imports: [
    ConfigModule.forRoot(),
    PostsModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    CacheModule.registerAsync({
       useFactory: async()=>{
         return {
             stores: [
               new Keyv({
                   store: new CacheableMemory({ ttl:60000, lruSize:5000 })
               }),
                new Keyv({
                  store: new KeyvRedis(process.env.REDIS_URL)
                })

             ]
         }
          
       }
    })
  ],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService],
})
export class AppModule {}
