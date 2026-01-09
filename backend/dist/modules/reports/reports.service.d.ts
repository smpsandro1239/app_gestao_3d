import { FinanceService } from '../finance/finance.service';
import { OrdersService } from '../orders/orders.service';
export declare class ReportsService {
    private readonly ordersService;
    private readonly financeService;
    constructor(ordersService: OrdersService, financeService: FinanceService);
    generateOrdersExcel(): Promise<import("exceljs").Buffer>;
    generateFinanceExcel(): Promise<import("exceljs").Buffer>;
}
