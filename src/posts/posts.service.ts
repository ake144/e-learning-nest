import { Inject, Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { postDto } from './dto/user.create.dto';
import { error } from 'console';
import { PrismaService } from 'src/prisma.service';
import { Prisma,Post } from '@prisma/client';

// Add or import the correct Cache interface/class
interface Cache {
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
}

@Injectable()
export class PostsService {
    constructor(@Inject('CACHE') private cache: Cache, private prisma: PrismaService) {}
    

   async findAll(): Promise<Post[]> {
       const cachedPosts = await this.cache.get<Post[]>('posts');
         console.log("Cached posts:", cachedPosts);

       if (cachedPosts) return cachedPosts;
         
       const posts = await this.prisma.post.findMany();
       await this.cache.set('posts', posts);
       return posts;
   }

   async findOne(id: number): Promise<Post | null> {
       const cachedPost = await this.cache.get<Post>(`post:${id}`);
       if (cachedPost) return cachedPost;
          console.log("Cached post:", cachedPost);

         const post = await this.prisma.post.findUnique({
           where: { id }
       });

       if (!post) throw new NotFoundException(`Post with id ${id} not found`);

       await this.cache.set(`post:${id}`, post);
       return post;
    }

    async create(post: Prisma.PostCreateInput): Promise<Post> {

       return this.prisma.post.create({data:post})
    }

    update(id: number, post: Prisma.PostUpdateInput): Promise<Post | null> {
       return this.prisma.post.update({
           where: { id },
           data: post
       });
    }

    remove(id: number): Promise<Post | null> {
       return this.prisma.post.delete({
           where: { id }
       });
    }



}
