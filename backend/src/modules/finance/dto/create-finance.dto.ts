import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { FinanceType } from '../../../entities/finance.entity';

export class CreateFinanceDto {
  @IsEnum(FinanceType)
  tipo: FinanceType;

  @IsNumber()
  valor: number;

  @IsString()
  descricao: string;

  @IsNumber()
  @IsOptional()
  referenciaPedidoId?: number;
}
