import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';


interface Cache {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  // Add other methods as needed
}
@Injectable()
export class UsersService {
  constructor(@Inject('CACHE') private cache: Cache, private prisma: PrismaService) {}

  create(createUserDto: Prisma.UserCreateInput):Promise<User> {
    return this.prisma.user.create({data:createUserDto})
  }

  async users(params:{
    skip?:number,
    take?:number,
    cursor?:Prisma.UserWhereUniqueInput,
    where?:Prisma.UserWhereInput,
    orderBy?:Prisma.UserOrderByWithRelationInput
  }):Promise<User[]>{
    return this.prisma.user.findMany({
      skip: params.skip,
      take: params.take,
      cursor: params.cursor,
      where: params.where,
      orderBy: params.orderBy
    })

  }


  findAll() {
    const users = this.cache.get<User[]>('users');
    if (users) return users;
    const allUsers = this.prisma.user.findMany();
    this.cache.set('users', allUsers);
    return allUsers;
  }

  findOne(id: number) {
    const user = this.cache.get<User>(`user:${id}`);
    if (user) return user;
    console.log("Cache miss for user:", id);

    const dbUser = this.prisma.user.findUnique({
      where: { id },
    });
    this.cache.set(`user:${id}`, dbUser);
    return dbUser;
  }

  findByEmail(email: string) {
    const user = this.cache.get<User>(`user:email:${email}`);
    if (user) return user;
    console.log("Cache miss for user by email:", email);
    
    this.cache.set(`user:email:${email}`, this.prisma.user.findUnique({
      where: { email },
    }));
    return this.prisma.user.findUnique({
      where: { email },
    });
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where:{id},
      data:{...updateUserDto}
    })
    
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
