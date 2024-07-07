/**
 * Main module of the application
 * Sets the configuration module as a global module
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs/config.module';
import { LoggerModule } from './core/logger/modules/logger.module';
import { ContextModule } from './configs/context/modules/contextStorage.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './core/responses/interceptors/response.interceptor';
import { EventModule } from './feature/events/event.module';
import { QueueModule } from './core/queue/modules/queue.module';
import { QueueProcessModule } from './queues/queue.module';

@Module({
    imports: [
        LoggerModule,
        ConfigsModule,
        ContextModule,
        QueueModule,
        EventModule,
        QueueProcessModule,
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor }],
})
export class AppModule {}
