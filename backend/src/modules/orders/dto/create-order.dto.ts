import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateOrderItemDto {
  @IsNumber()
  produtoId: number;

  @IsNumber()
  quantidade: number;

  @IsNumber()
  @IsOptional()
  precoUnitario?: number;

  @IsString()
  @IsOptional()
  cor?: string;

  @IsString()
  @IsOptional()
  material?: string;

  @IsNumber()
  @IsOptional()
  preenchimento?: number;

  @IsString()
  @IsOptional()
  observacoesTecnicas?: string;
}

export class CreateOrderDto {
  @IsNumber()
  clienteId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  itens: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  metodoEntrega?: string;

  @IsNumber()
  @IsOptional()
  custoEntrega?: number;

  @IsDateString()
  @IsOptional()
  dataEntregaPrevista?: Date;

  @IsString()
  @IsOptional()
  notas?: string;
}
