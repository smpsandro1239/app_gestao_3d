"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_entity_1 = require("../../entities/client.entity");
let ClientsService = class ClientsService {
    clientRepository;
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    async findAll() {
        return await this.clientRepository.find();
    }
    async findOne(id) {
        const client = await this.clientRepository.findOne({
            where: { id },
            relations: ['pedidos']
        });
        if (!client) {
            throw new common_1.NotFoundException(`Cliente com ID ${id} não encontrado.`);
        }
        return client;
    }
    async create(createClientDto) {
        const client = this.clientRepository.create(createClientDto);
        return await this.clientRepository.save(client);
    }
    async update(id, updateClientDto) {
        const client = await this.findOne(id);
        Object.assign(client, updateClientDto);
        return await this.clientRepository.save(client);
    }
    async remove(id) {
        const client = await this.findOne(id);
        return await this.clientRepository.remove(client);
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientsService);
//# sourceMappingURL=clients.service.js.map