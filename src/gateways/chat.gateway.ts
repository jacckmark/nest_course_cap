import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface Payload {
  sender: string;
  message: string;
}

export interface Connection {
  username: string;
  client?: Socket;
}

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  clients: Socket[] = [];

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]): void {
    this.clients.push(client);
    this.server.emit('chatToClient', {
      message: `New connection, chat has currently ${this.clients.length} users.`,
    });
  }

  handleDisconnect(client: Socket): void {
    this.clients = this.clients.filter((el) => el !== client);
    this.server.emit('chatToClient', {
      message: `User disconnected, chat has currently ${this.clients.length} users.`,
    });
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, payload: Payload): void {
    console.log('received message', payload);
    this.server.emit('chatToClient', payload);
  }
}
