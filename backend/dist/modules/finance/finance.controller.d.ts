import { CreateFinanceDto } from './dto/create-finance.dto';
import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    findAll(): Promise<import("../../entities").Finance[]>;
    getSummary(): Promise<{
        entradas: number;
        saidas: number;
        lucro: number;
        totalRegistos: number;
    }>;
    create(createFinanceDto: CreateFinanceDto): Promise<import("../../entities").Finance>;
}
