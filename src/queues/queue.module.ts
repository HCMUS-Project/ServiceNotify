import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import queueRegisterConfigs from 'src/core/queue/configs/registerQueue.config';
import { EventsGateway } from 'src/feature/events/event.gateway';
import { BookingNotifyQueueProcessor } from './queue_booking.processor';

@Module({
    imports: [BullModule.registerQueue(queueRegisterConfigs.booking)],
    providers: [EventsGateway, BookingNotifyQueueProcessor],
})
export class QueueProcessModule {}
