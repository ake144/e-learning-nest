import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { PrismaModule } from 'src/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.gard';

@Module({
  imports: [PrismaModule],
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
