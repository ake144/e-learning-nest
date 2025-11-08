import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';
import { Public } from 'src/auth/public.decorator';
import * as bcrypt from 'bcrypt';
import { Cache } from '@nestjs/cache-manager';


@Injectable()
export class UsersService {
  constructor(@Inject(Cache) private cache: Cache, private prisma: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput):Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({data:{...createUserDto,password:hashedPassword}})
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


  async findAll(): Promise<Omit<User, 'password'>[] | undefined> {

     const users  = this.cache.get<Omit<User, 'password'>[]>('users');
      if(users){

        return users;
      }

    const allUsers = await this.prisma.user.findMany({
      omit: { password: true }
    });

    this.cache.set<Omit<User, 'password'>[]>('users', allUsers);
    return allUsers;
  }

  async findOne(id: number) {

    const dbUser = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true }
    });
    if(!dbUser){
      return null;
    }
 
    return dbUser;
  }

 @Public()
  async findByEmail(email: string) {

    const dbUser = await this.prisma.user.findUnique({
      where: { email },
      
    });
    if (!dbUser) {
      return null;
    }
    return dbUser;
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
