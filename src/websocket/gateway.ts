import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';




@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
    
    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): string {
        console.log('Received message:', payload);

        return payload;
    }

    @SubscribeMessage("newMessage")
    handleNewMessage(@MessageBody() body): any {
        console.log('Received new message:', body);

    }
}