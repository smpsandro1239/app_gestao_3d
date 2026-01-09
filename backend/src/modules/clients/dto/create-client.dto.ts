import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  nome: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  morada?: string;
}
