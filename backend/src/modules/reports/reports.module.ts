import { Module } from '@nestjs/common';
import { FinanceModule } from '../finance/finance.module';
import { OrdersModule } from '../orders/orders.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [OrdersModule, FinanceModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
