import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { PrismaModule } from 'src/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.gard';
import { CacheModule } from '@nestjs/cache-manager/dist/cache.module';

@Module({
  imports: [
    PrismaModule, 
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
          },
          consumer: {
            groupId: 'user-producer-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard
    // }
  ],
  exports: [UsersService], 
})
export class UsersModule {}
         