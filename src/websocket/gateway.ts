import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './gateway.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
      
    constructor(private readonly gatewayService: GatewayService) {}



  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // Optionally, join a default room or handle course-specific joining here
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinCourse')
  handleJoinCourse(@MessageBody() data: { courseId: number }, @ConnectedSocket() client: Socket) {
    client.join(`course-${data.courseId}`);
    console.log(`Client ${client.id} joined course-${data.courseId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() data: { courseId: number; message: string; userId: number },
   @ConnectedSocket() client: Socket) {
    // Here you can save the message to the database if needed
    // For now, just broadcast to the course room
     const savedMessage = await this.gatewayService.createMessage(data);
      

    this.server.to(`course-${data.courseId}`).emit('newMessage', {
      message: data.message,
      userId: data.userId,
      timestamp: new Date(),
    });
    console.log(`Message sent to course-${data.courseId}:`, data.message);
  }

  @SubscribeMessage('listenToMessages')
  handleListenToMessages(@MessageBody() data: { courseId: number }, @ConnectedSocket() client: Socket) {
      const messages = this.gatewayService.findMessagesByCourseId(data.courseId);
        messages.then((msgs) => {
            client.emit('messageHistory', msgs);
        });


        console.log(`Sent message history to client ${client.id} for course-${data.courseId}`);
        
  }

  // Keep existing handlers if needed
//   @SubscribeMessage('message')
//   handleMessage(@MessageBody() payload): any {
//     console.log('Received message:', payload);
//     return payload;
//   }

//   @SubscribeMessage('newMessage')
//   handleNewMessage(@MessageBody() body): any {
//     console.log('Received new message:', body);
//   }
}