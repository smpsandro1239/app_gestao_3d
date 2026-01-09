import { Repository } from 'typeorm';
import { Finance } from '../../entities/finance.entity';
import { CreateFinanceDto } from './dto/create-finance.dto';
export declare class FinanceService {
    private readonly financeRepository;
    constructor(financeRepository: Repository<Finance>);
    findAll(): Promise<Finance[]>;
    create(createFinanceDto: CreateFinanceDto): Promise<Finance>;
    getSummary(): Promise<{
        entradas: number;
        saidas: number;
        lucro: number;
        totalRegistos: number;
    }>;
}
