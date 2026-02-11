import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  nome!: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  preco!: number;

  @IsNumber()
  @IsOptional()
  custoProducao?: number;

  @IsNumber()
  @IsOptional()
  pesoEstimado?: number;

  @IsNumber()
  @IsOptional()
  tempoImpressao?: number;

  @IsNumber()
  @IsOptional()
  stockQuantity?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagens?: string[];

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
