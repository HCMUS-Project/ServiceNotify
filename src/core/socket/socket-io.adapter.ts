import { INestApplicationContext, Inject } from '@nestjs/common';
import { AbstractWsAdapter, MessageMappingProperties } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils';
import { fromEvent, Observable } from 'rxjs';
import { filter, first, map, mergeMap, share, takeUntil } from 'rxjs/operators';
import { DISCONNECT_EVENT } from '@nestjs/websockets/constants';

/**
 * Socket.IO adapter for NestJS WebSocket.
 */
export class SocketIoAdapter extends AbstractWsAdapter {
    constructor(
        appOrHttpServer?: INestApplicationContext | any,
        private readonly corsOrigins = '*',
    ) {
        super(appOrHttpServer);
    }

    /**
     * Creates a socket.io server with the specified port and options.
     * @param port The port number to listen on.
     * @param options Optional configuration options for the server.
     * @returns The created socket.io server.
     */
    public create(port: number, options?: any & { namespace?: string; server?: any }): any {
        if (!options) {
            return this.createIOServer(port);
        }
        const { namespace, server, ...opt } = options;
        return server && isFunction(server.of)
            ? server.of(namespace)
            : namespace
              ? this.createIOServer(port, opt).of(namespace)
              : this.createIOServer(port, opt);
    }

    /**
     * Creates an instance of the Socket.IO server.
     * @param {number} port - The port number to listen on.
     * @param {any} [options] - Optional configuration options for the server.
     * @returns {any} - The created Socket.IO server instance.
     */
    public createIOServer(port: number, options?: any): any {
        if (this.httpServer && port === 0) {
            const s = new Server(this.httpServer, {
                cors: {
                    origin: this.corsOrigins,
                    methods: ['GET', 'POST'],
                    credentials: true,
                },
                // Allow 1MB of data per request.
                maxHttpBufferSize: 1e6,
            });

            return s;
        }
        return new Server(port, options);
    }

    /**
     * Binds message handlers to the client socket.
     *
     * @param client - The client socket.
     * @param handlers - An array of message mapping properties.
     * @param transform - A function to transform the data.
     */
    public bindMessageHandlers(
        client: any,
        handlers: MessageMappingProperties[],
        transform: (data: any) => Observable<any>,
    ) {
        const disconnect$ = fromEvent(client, DISCONNECT_EVENT).pipe(share(), first());

        handlers.forEach(({ message, callback }) => {
            const source$ = fromEvent(client, message).pipe(
                mergeMap((payload: any) => {
                    const { data, ack } = this.mapPayload(payload);
                    return transform(callback(data, ack)).pipe(
                        filter((response: any) => !isNil(response)),
                        map((response: any) => [response, ack]),
                    );
                }),
                takeUntil(disconnect$),
            );
            source$.subscribe(([response, ack]) => {
                if (response.event) {
                    return client.emit(response.event, response.data);
                }
                isFunction(ack) && ack(response);
            });
        });
    }

    /**
     * Maps the payload to the appropriate format.
     * @param payload - The payload to be mapped.
     * @returns An object containing the mapped payload and an optional ack function.
     */
    private mapPayload(payload: any): { data: any; ack?: any } {
        if (!Array.isArray(payload)) {
            return { data: payload };
        }
        const lastElement = payload[payload.length - 1];
        const isAck = isFunction(lastElement);
        if (isAck) {
            const size = payload.length - 1;
            return {
                data: size === 1 ? payload[0] : payload.slice(0, size),
                ack: lastElement,
            };
        }
        return { data: payload };
    }
}
