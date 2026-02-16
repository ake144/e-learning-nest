import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TasksService } from "./cron.service";
import { TaskController } from './task.controller';

@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [TaskController],
    providers: [TasksService],
})
export class TaskModule {}