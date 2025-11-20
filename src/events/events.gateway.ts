import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  emitVehiclePosition(vehicleId: string, data: any, operationId?: string) {
    this.server?.emit(`vehicle:${vehicleId}`, data);
    this.server?.emit('vehicles', data);

    if (operationId) {
      this.server?.emit(`operation:${operationId}:vehicle_position`, data);
    }
  }

  emitOperationUpdate(operationId: string, data: any) {
    this.server?.emit(`operation:${operationId}`, data);
  }

  emitAlert(data: any) {
    this.server?.emit('alert', data);
  }
}
