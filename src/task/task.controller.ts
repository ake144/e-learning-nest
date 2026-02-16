import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class TaskController {
  @EventPattern('user.created')
  handleUserCreated(@Payload() data: any) {
    console.log('Task Service received user.created:', data);
  }
}
