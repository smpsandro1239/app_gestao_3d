import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finance, FinanceType } from '../../entities/finance.entity';
import { CreateFinanceDto } from './dto/create-finance.dto';

@Injectable()
export class FinanceService implements OnModuleInit {
  constructor(
    @InjectRepository(Finance)
    private readonly financeRepository: Repository<Finance>,
  ) {}

  async onModuleInit() {
    const records = await this.financeRepository.count();
    if (records === 0) {
        console.log('Seeding initial finance records...');
        const initialRecords = [
            {
                tipo: FinanceType.ENTRADA,
                valor: 150.00,
                descricao: 'Venda Conjunto Vasos',
                data: new Date(new Date().setDate(new Date().getDate() - 5))
            },
            {
                tipo: FinanceType.SAIDA,
                valor: 45.00,
                descricao: 'Compra 2Kg PLA (Preto e Branco)',
                data: new Date(new Date().setDate(new Date().getDate() - 4))
            },
            {
                tipo: FinanceType.ENTRADA,
                valor: 35.00,
                descricao: 'Encomenda Miniatura Dragão',
                data: new Date(new Date().setDate(new Date().getDate() - 2))
            },
            {
                tipo: FinanceType.SAIDA,
                valor: 12.00,
                descricao: 'Peças Reposição Extrusora',
                data: new Date(new Date().setDate(new Date().getDate() - 1))
            }
        ];

        for (const r of initialRecords) {
            await this.create(r as any);
        }
    }
  }

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
