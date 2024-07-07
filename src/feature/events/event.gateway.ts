import { Inject, Injectable } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';

@Injectable()
@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    constructor(@Inject(LoggerKey) private logger: Logger) {}

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        // console.log('client', client);
        // return { event: 'events', data };
        this.server.emit('events', data);
        // return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }

    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
        return data;
    }

    @SubscribeMessage('booking')
    async handBooking(@MessageBody() data: string) {
        this.logger.info('Booking notify with data: ', { props: { data } });
        this.server.emit('booking-notify', data);
    }

    @SubscribeMessage('order')
    async handleOrder(@MessageBody() data: string) {
        this.logger.info('Order notify with data', { props: { data } });
        this.server.emit('order-notify', data);
    }
}
