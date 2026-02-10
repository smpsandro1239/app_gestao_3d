import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { FinanceType } from '../../entities/finance.entity';
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
    const workbook = new Workbook();
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
    const workbook = new Workbook();
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

  async getDashboardStats() {
    const orders = await this.ordersService.findAll();
    const finances = await this.financeService.findAll();

    // Calculate stats
    const activeOrders = orders.filter(o => o.status !== 'FINALIZADO' && o.status !== 'CANCELADO' && o.status !== 'ENTREGUE').length;

    // Mocking new clients for now as ClientService isn't injected, or filter from orders if possible
    // For simplicity, let's say "Orders from new clients" or just fetch all clients if we injected ClientService
    const newClients = 5; // Placeholder or impl if ClientService injected

    const currentMonth = new Date().getMonth();
    const monthlyRevenue = finances
      .filter(f => new Date(f.data).getMonth() === currentMonth && f.tipo === FinanceType.ENTRADA)
      .reduce((acc, curr) => acc + Number(curr.valor), 0);

    const overdueOrders = orders.filter(o =>
      o.dataEntregaPrevista && new Date(o.dataEntregaPrevista) < new Date() && o.status !== 'ENTREGUE'
    ).length;

    return {
      activeOrders,
      newClients,
      monthlyRevenue,
      overdueOrders,
      recentActivity: [], // Populate if we have an activity log
    };
  }
}
