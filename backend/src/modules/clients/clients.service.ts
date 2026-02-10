import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService implements OnModuleInit {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async onModuleInit() {
    const clients = await this.clientRepository.count();
    if (clients === 0) {
        console.log('Seeding initial clients...');
        const initialClients = [
            {
                nome: 'João Silva',
                email: 'joao.silva@example.com',
                telefone: '912345678',
                endereco: 'Rua das Flores, 123, Lisboa',
            },
            {
                nome: 'Maria Pereira',
                email: 'maria.p@example.com',
                telefone: '923456789',
                endereco: 'Av. Liberdade, 45, Porto',
            },
            {
                nome: 'Carlos Santos',
                email: 'carlos.santos@hub.pt',
                telefone: '934567890',
            }
        ];

        for (const c of initialClients) {
            await this.create(c as any);
        }
    }
  }

  async findAll() {
    return await this.clientRepository.find();
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['pedidos']
    });
    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
    }
    return client;
  }

  async create(createClientDto: CreateClientDto) {
    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async remove(id: number) {
    const client = await this.findOne(id);
    return await this.clientRepository.remove(client);
  }
}
