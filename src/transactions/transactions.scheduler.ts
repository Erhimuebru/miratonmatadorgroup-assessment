// src/transactions/transactions.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TransactionsService } from './transactions.service';

@Injectable()
export class TransactionsScheduler {
  private readonly logger = new Logger(TransactionsScheduler.name);

  constructor(private readonly transactionsService: TransactionsService) {}

//   @Cron('0 0 * * *') // Runs daily at midnight
//   async handleCron() {
//     this.logger.debug('Running scheduled task to process recurring transactions');
//     await this.transactionsService.processRecurringTransactions();
//   }
}
