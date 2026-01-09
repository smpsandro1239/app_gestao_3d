import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    findAll(): Promise<import("../../entities").Client[]>;
    findOne(id: string): Promise<import("../../entities").Client>;
    create(createClientDto: CreateClientDto): Promise<import("../../entities").Client>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<import("../../entities").Client>;
    remove(id: string): Promise<import("../../entities").Client>;
}
