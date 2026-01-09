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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const finance_entity_1 = require("../../entities/finance.entity");
let FinanceService = class FinanceService {
    financeRepository;
    constructor(financeRepository) {
        this.financeRepository = financeRepository;
    }
    async findAll() {
        return await this.financeRepository.find({
            order: { data: 'DESC' },
        });
    }
    async create(createFinanceDto) {
        const finance = this.financeRepository.create(createFinanceDto);
        return await this.financeRepository.save(finance);
    }
    async getSummary() {
        const records = await this.financeRepository.find();
        const entradas = records
            .filter(r => r.tipo === finance_entity_1.FinanceType.ENTRADA)
            .reduce((acc, r) => acc + Number(r.valor), 0);
        const saidas = records
            .filter(r => r.tipo === finance_entity_1.FinanceType.SAIDA)
            .reduce((acc, r) => acc + Number(r.valor), 0);
        const lucro = entradas - saidas;
        return {
            entradas,
            saidas,
            lucro,
            totalRegistos: records.length
        };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(finance_entity_1.Finance)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FinanceService);
//# sourceMappingURL=finance.service.js.map