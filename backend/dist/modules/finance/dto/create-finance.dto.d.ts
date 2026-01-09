import { FinanceType } from '../../../entities/finance.entity';
export declare class CreateFinanceDto {
    tipo: FinanceType;
    valor: number;
    descricao: string;
    referenciaPedidoId?: number;
}
