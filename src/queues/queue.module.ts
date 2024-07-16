import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import queueRegisterConfigs from 'src/core/queue/configs/registerQueue.config';
import { EventsGateway } from 'src/feature/events/event.gateway';
import { BookingNotifyQueueProcessor } from './queue_booking.service';
import { ECommerceNotifyQueueProcessor } from './queue_ecom.service';

@Module({
    imports: [
        BullModule.registerQueue(queueRegisterConfigs.booking, queueRegisterConfigs.e_commerce),
    ],
    providers: [EventsGateway, BookingNotifyQueueProcessor, ECommerceNotifyQueueProcessor],
})
export class QueueProcessModule {}
