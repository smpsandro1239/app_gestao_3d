import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { FinanceService } from '../finance/finance.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly financeService: FinanceService,
  ) {}

  async generateOrdersExcel() {
    const orders = await this.ordersService.findAll();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Pedidos');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Data', key: 'data', width: 20 },
    ];

    orders.forEach(order => {
      sheet.addRow({
        id: order.id,
        cliente: order.cliente.nome,
        total: order.total,
        status: order.status,
        data: order.dataCriacao,
      });
    });

    return await workbook.xlsx.writeBuffer();
  }

  async generateFinanceExcel() {
    const records = await this.financeService.findAll();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Financeiro');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tipo', key: 'tipo', width: 15 },
      { header: 'Valor', key: 'valor', width: 15 },
      { header: 'Descrição', key: 'descricao', width: 40 },
      { header: 'Data', key: 'data', width: 20 },
    ];

    records.forEach(record => {
      sheet.addRow({
        id: record.id,
        tipo: record.tipo,
        valor: record.valor,
        descricao: record.descricao,
        data: record.data,
      });
    });

    return await workbook.xlsx.writeBuffer();
  }
}
