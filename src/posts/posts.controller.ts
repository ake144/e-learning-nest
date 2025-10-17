import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { postDto } from './dto/user.create.dto';
import { PostsService } from './posts.service';
import { Post as PostModel, Prisma } from '@prisma/client';

@Controller('posts')
export class PostsController {
   constructor(private postsService: PostsService) {}

    @Get()
    findAll() {
        return this.postsService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<PostModel | null> {
        return  this.postsService.findOne(id)
    }

    @Post()
    create(@Body() post: Prisma.PostCreateInput): Promise<PostModel> {
        return this.postsService.create(post);
    }
    @Put(':id')
    update(@Param('id') id: number, @Body() post: Prisma.PostUpdateInput): Promise<PostModel | null> {
        return this.postsService.update(id, post);
    }

}


