import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';


@WebSocketGateway()
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