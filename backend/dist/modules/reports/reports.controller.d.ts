import { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    downloadOrdersExcel(res: Response): Promise<void>;
    downloadFinanceExcel(res: Response): Promise<void>;
}
