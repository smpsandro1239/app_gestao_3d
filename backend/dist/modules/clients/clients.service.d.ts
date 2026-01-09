import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsService {
    private readonly clientRepository;
    constructor(clientRepository: Repository<Client>);
    findAll(): Promise<Client[]>;
    findOne(id: number): Promise<Client>;
    create(createClientDto: CreateClientDto): Promise<Client>;
    update(id: number, updateClientDto: UpdateClientDto): Promise<Client>;
    remove(id: number): Promise<Client>;
}
