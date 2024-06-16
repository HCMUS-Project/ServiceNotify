import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigsModule } from './configs/config.module';
import NestjsLoggerServiceAdapter from './core/logger/modules/logger.adapter';
import { ExceptionsFilter } from './core/responses/filter/exception.filter';
import { SocketIoAdapter } from './core/socket/socket-io.adapter';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        bufferLogs: true,
    });

    // Enable CORS
    app.enableCors();

    // Config the logger
    const customLogger = app.get(NestjsLoggerServiceAdapter);
    app.useLogger(customLogger);

    // Config the filter for the exceptions
    app.useGlobalFilters(new ExceptionsFilter());

    // Config the adapter for the socket
    // const logger = app.get<Logger>(LoggerKey);
    app.useWebSocketAdapter(new SocketIoAdapter(app));

    //Get the value from the environment variables
    const configService = app.get(ConfigService<ConfigsModule>);
    const host = configService.get<string>('host')
    const port = configService.get<number>('port');

    // Listen on the port
    await app.listen(port, host, async () => {
        const url = await app.getUrl();
        customLogger.log(`Server running on ${url}`);
    });
}

bootstrap();
