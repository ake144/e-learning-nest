import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaModule } from 'src/prisma.module';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthGuard } from 'src/auth/auth.gard';

@Module({
  imports:[PrismaModule],
  controllers: [CourseController],
  providers: [CourseService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class CourseModule {}
