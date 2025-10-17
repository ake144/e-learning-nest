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
   constructor(@Inject('CACHE') private cache: Cache, private prisma: PrismaService) {}


  create(createCourseDto: Prisma.CourseCreateInput) {
    return this.prisma.course.create({
      data: createCourseDto,
    });
  }

  async findAll() {
    const cachedCourses = await this.cache.get('courses');
    if (cachedCourses) return cachedCourses;

    const courses = await this.prisma.course.findMany();
    await this.cache.set('courses', courses);
    return courses;
  }

  async findOne(id: number) {
    const cachedCourse = await this.cache.get(`course:${id}`);
    if (cachedCourse) return cachedCourse;

    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    await this.cache.set(`course:${id}`, course);
    return course;
  }

  update(id: number, updateCourseDto: Prisma.CourseUpdateInput) {
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
