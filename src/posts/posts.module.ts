import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
    imports: [PrismaModule],
    controllers: [PostsController],
    providers: [PostsService],
    exports: [PostsService]
})
export class PostsModule {}
