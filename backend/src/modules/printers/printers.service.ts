import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Printer, PrinterStatus } from '../../entities/printer.entity';

@Injectable()
export class PrintersService implements OnModuleInit {
  constructor(
    @InjectRepository(Printer)
    private readonly printerRepository: Repository<Printer>,
  ) {}

  async onModuleInit() {
    const printers = await this.printerRepository.count();
    if (printers === 0) {
      console.log('Seeding initial printers...');
      const initialPrinters = [
        {
          nome: 'Ender 3 S1 Pro',
          modelo: 'Creality',
          status: PrinterStatus.PRINTING,
          progressoAtual: 65,
          trabalhoAtual: 'Miniatura Dragão',
        },
        {
          nome: 'Prusa MK3S+',
          modelo: 'Prusa Research',
          status: PrinterStatus.IDLE,
          progressoAtual: 0,
        },
        {
          nome: 'Bambu Lab X1C',
          modelo: 'Bambu Lab',
          status: PrinterStatus.IDLE,
          progressoAtual: 0,
        },
      ];

      for (const p of initialPrinters) {
        await this.printerRepository.save(p);
      }
    }
  }

  async findAll() {
    return this.printerRepository.find();
  }

  async findOne(id: number) {
    return this.printerRepository.findOneBy({ id });
  }

  async create(data: any) {
    return this.printerRepository.save(data);
  }

  async update(id: number, data: any) {
    return this.printerRepository.update(id, data);
  }

  async remove(id: number) {
    return this.printerRepository.delete(id);
  }
}
