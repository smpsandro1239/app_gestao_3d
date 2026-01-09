import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

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
