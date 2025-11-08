import { ConfigurableModuleBuilder, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { CourseModule } from './course/course.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './task/cron.service';
import { TaskModule } from './task/task.module';
import { GatewayModule } from './websocket/gateway.module';


@Module({
  imports: [
    // ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    PostsModule,
    UsersModule,
    AuthModule,
    GatewayModule,
    TaskModule,
    DatabaseModule,
    CacheModule.registerAsync({
      isGlobal:true,
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
    }),
    CourseModule
  ],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService, TasksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }

}
