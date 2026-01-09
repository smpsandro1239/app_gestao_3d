import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('orders/excel')
  async downloadOrdersExcel(@Res() res: Response) {
    const buffer = await this.reportsService.generateOrdersExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=pedidos.xlsx');
    res.send(buffer);
  }

  @Get('finance/excel')
  async downloadFinanceExcel(@Res() res: Response) {
    const buffer = await this.reportsService.generateFinanceExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=financeiro.xlsx');
    res.send(buffer);
  }
}
