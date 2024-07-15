import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { EventsGateway } from 'src/feature/events/event.gateway';

@Injectable()
@Processor('e_commerce')
export class ECommerceNotifyQueueProcessor extends WorkerHost {
    constructor(
        private eventsGateway: EventsGateway,
        @Inject(LoggerKey) private logger: Logger,
    ) {
        super();
    }

    /**
     * Process a job in the queue.
     *
     * @param job - The job to be processed.
     * @returns A Promise that resolves when the job is processed.
     */
    async process(job: Job) {
        this.logger.info('E-commerce notify with data: ', { props: { data: job.data } });
        console.log(`e_commerce-notify/${job.data.domain}`);
        this.eventsGateway.server.emit(`e_commerce-notify/${job.data.domain}`, job.data);
        this.logger.debug('Message sent to e_commerce-notify channel.');
    }
}
