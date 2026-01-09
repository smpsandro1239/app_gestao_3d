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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const finance_entity_1 = require("../../entities/finance.entity");
const order_item_entity_1 = require("../../entities/order-item.entity");
const order_entity_1 = require("../../entities/order.entity");
const clients_service_1 = require("../clients/clients.service");
const finance_service_1 = require("../finance/finance.service");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    orderRepository;
    orderItemRepository;
    clientsService;
    productsService;
    financeService;
    constructor(orderRepository, orderItemRepository, clientsService, productsService, financeService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.clientsService = clientsService;
        this.productsService = productsService;
        this.financeService = financeService;
    }
    async findAll() {
        return await this.orderRepository.find({
            relations: ['cliente', 'itens', 'itens.produto'],
            order: { dataCriacao: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['cliente', 'itens', 'itens.produto'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Pedido com ID ${id} não encontrado.`);
        }
        return order;
    }
    async create(createOrderDto) {
        const cliente = await this.clientsService.findOne(createOrderDto.clienteId);
        const order = new order_entity_1.Order();
        order.cliente = cliente;
        order.metodoEntrega = createOrderDto.metodoEntrega || 'Levantamento';
        order.custoEntrega = createOrderDto.custoEntrega || 0;
        order.dataEntregaPrevista = createOrderDto.dataEntregaPrevista || new Date();
        order.notas = createOrderDto.notas || '';
        order.status = order_entity_1.OrderStatus.RECEBIDO;
        let total = order.custoEntrega;
        const items = [];
        for (const itemDto of createOrderDto.itens) {
            const product = await this.productsService.findOne(itemDto.produtoId);
            const item = new order_item_entity_1.OrderItem();
            item.produto = product;
            item.quantidade = itemDto.quantidade;
            item.precoUnitario = itemDto.precoUnitario || product.preco;
            item.cor = itemDto.cor;
            item.material = itemDto.material;
            item.preenchimento = itemDto.preenchimento;
            item.observacoesTecnicas = itemDto.observacoesTecnicas;
            total += item.precoUnitario * item.quantidade;
            items.push(item);
        }
        order.total = total;
        order.itens = items;
        const savedOrder = await this.orderRepository.save(order);
        await this.financeService.create({
            tipo: finance_entity_1.FinanceType.ENTRADA,
            valor: total,
            descricao: `Pedido #${savedOrder.id} - ${cliente.nome}`,
            referenciaPedidoId: savedOrder.id,
        });
        return savedOrder;
    }
    async updateStatus(id, status) {
        const order = await this.findOne(id);
        order.status = status;
        return await this.orderRepository.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        clients_service_1.ClientsService,
        products_service_1.ProductsService,
        finance_service_1.FinanceService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map