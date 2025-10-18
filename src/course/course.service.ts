import { Inject, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

interface Cache {
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
}



@Injectable()
export class CourseService {
   constructor( private prisma: PrismaService) {}


  create(createCourseDto: Prisma.CourseCreateInput) {
    return this.prisma.course.create({
      data: createCourseDto,
    });
  }

  async findAll() {

    const courses = await this.prisma.course.findMany();
       if(!courses){
        return [];
       }
    return courses;
  }

  async findOne(id: number) {
   
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if(!course){
      return null;
    }
    return course;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  remove(id: number) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
