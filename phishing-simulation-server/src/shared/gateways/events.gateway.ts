import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private connectedClients: number = 0;

  handleConnection(client: Socket) {
    this.connectedClients++;
    console.log(
      `Client connected: ${client.id}. Total clients: ${this.connectedClients}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.connectedClients--;
    console.log(
      `Client disconnected: ${client.id}. Total clients: ${this.connectedClients}`,
    );
  }

  notifyDataChange(dataType: string, data: any) {
    this.server.emit('dataChange', { type: dataType, data });
  }

  // @SubscribeMessage('requestInitialData')
  // handleMessage(client: Socket, payload: any) {
  //   console.log('Client requested initial data', payload);
  //   client.emit('initialData', {
  //     /* your initial data */
  //   });
  // }
}
