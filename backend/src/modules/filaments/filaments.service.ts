import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filament, MaterialType } from '../../entities/filament.entity';

@Injectable()
export class FilamentsService implements OnModuleInit {
  constructor(
    @InjectRepository(Filament)
    private readonly filamentRepository: Repository<Filament>,
  ) {}

  async onModuleInit() {
    const filaments = await this.filamentRepository.count();
    if (filaments === 0) {
      console.log('Seeding initial filaments...');
      const initialFilaments = [
        {
          marca: 'Hatchbox',
          material: MaterialType.PLA,
          cor: 'Preto',
          corHex: '#000000',
          pesoInicial: 1000,
          pesoAtual: 850,
          custo: 22.5,
          alertaMinimo: 100,
          ativo: true,
        },
        {
          marca: 'Prusament',
          material: MaterialType.PETG,
          cor: 'Laranja Prusa',
          corHex: '#FF7F00',
          pesoInicial: 1000,
          pesoAtual: 420,
          custo: 29.9,
          alertaMinimo: 150,
          ativo: true,
        },
        {
          marca: 'Esun',
          material: MaterialType.PLA,
          cor: 'Branco Marmore',
          corHex: '#E0E0E0',
          pesoInicial: 1000,
          pesoAtual: 980,
          custo: 24.0,
          alertaMinimo: 100,
          ativo: true,
        },
      ];

      for (const f of initialFilaments) {
        await this.filamentRepository.save(f);
      }
    }
  }

  async findAll() {
    return this.filamentRepository.find({
      where: { ativo: true },
      order: { marca: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.filamentRepository.findOneBy({ id });
  }

  async create(data: any) {
    return this.filamentRepository.save(data);
  }

  async update(id: number, data: any) {
    return this.filamentRepository.update(id, data);
  }

  async remove(id: number) {
    return this.filamentRepository.update(id, { ativo: false });
  }
}
