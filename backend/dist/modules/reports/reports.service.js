"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const exceljs_1 = require("exceljs");
const finance_service_1 = require("../finance/finance.service");
const orders_service_1 = require("../orders/orders.service");
let ReportsService = class ReportsService {
    ordersService;
    financeService;
    constructor(ordersService, financeService) {
        this.ordersService = ordersService;
        this.financeService = financeService;
    }
    async generateOrdersExcel() {
        const orders = await this.ordersService.findAll();
        const workbook = new exceljs_1.Workbook();
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
        const workbook = new exceljs_1.Workbook();
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        finance_service_1.FinanceService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map