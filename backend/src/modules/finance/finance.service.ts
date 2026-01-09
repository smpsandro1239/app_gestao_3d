import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finance, FinanceType } from '../../entities/finance.entity';
import { CreateFinanceDto } from './dto/create-finance.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance)
    private readonly financeRepository: Repository<Finance>,
  ) {}

  async findAll() {
    return await this.financeRepository.find({
      order: { data: 'DESC' },
    });
  }

  async create(createFinanceDto: CreateFinanceDto) {
    const finance = this.financeRepository.create(createFinanceDto);
    return await this.financeRepository.save(finance);
  }

  async getSummary() {
    const records = await this.financeRepository.find();

    const entradas = records
      .filter(r => r.tipo === FinanceType.ENTRADA)
      .reduce((acc, r) => acc + Number(r.valor), 0);

    const saidas = records
      .filter(r => r.tipo === FinanceType.SAIDA)
      .reduce((acc, r) => acc + Number(r.valor), 0);

    const lucro = entradas - saidas;

    return {
      entradas,
      saidas,
      lucro,
      totalRegistos: records.length
    };
  }
}
