import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class GatewayService {
   constructor( private prisma: PrismaService){}

   async createMessage(data: { courseId: number; message: string; userId: number }) {
      return this.prisma.chat.create({
         data: {
            message: data.message,
            user: { connect: { id: data.userId } },
            course: { connect: { id: data.courseId } },
         },
      });
   }

   async findMessagesByCourseId(courseId: number) {
      return this.prisma.chat.findMany({
         where: { courseId },
         include: { user: true },
      });
   }
}

