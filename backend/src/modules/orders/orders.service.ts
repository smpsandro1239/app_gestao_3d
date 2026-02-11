import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanceType } from '../../entities/finance.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { ClientsService } from '../clients/clients.service';
import { FinanceService } from '../finance/finance.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly clientsService: ClientsService,
    private readonly productsService: ProductsService,
    private readonly financeService: FinanceService,
  ) {}

  async onModuleInit() {
    // Wait a bit to ensure other services have seeded
    setTimeout(async () => {
      const count = await this.orderRepository.count();
      if (count === 0) {
        console.log('Seeding initial orders...');
        try {
          const clients = await this.clientsService.findAll();
          const products = await this.productsService.findAll();

          if (clients.length > 0 && products.length > 0) {
            await this.create({
              clienteId: clients[0].id,
              metodoEntrega: 'Levantamento',
              custoEntrega: 0,
              dataEntregaPrevista: new Date(),
              notas: 'Cliente habitual',
              itens: [
                {
                  produtoId: products[0].id,
                  quantidade: 1,
                  precoUnitario: products[0].preco,
                },
              ],
            });
          }
        } catch (e) {
          console.log('Error seeding orders:', (e as any).message);
        }
      }
    }, 5000);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ['cliente', 'itens', 'itens.produto'],
      order: { dataCriacao: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['cliente', 'itens', 'itens.produto'],
    });
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto) {
    const cliente = await this.clientsService.findOne(createOrderDto.clienteId);

    const order = new Order();
    order.cliente = cliente;
    order.metodoEntrega = createOrderDto.metodoEntrega || 'Levantamento';
    order.custoEntrega = createOrderDto.custoEntrega || 0;
    order.dataEntregaPrevista =
      createOrderDto.dataEntregaPrevista || new Date();
    order.notas = createOrderDto.notas || '';
    order.status = OrderStatus.RECEBIDO;

    let total = order.custoEntrega;
    const items: OrderItem[] = [];

    for (const itemDto of createOrderDto.itens) {
      const product = await this.productsService.findOne(itemDto.produtoId);
      const item = new OrderItem();
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

    // Registar entrada no financeiro automaticamente
    await this.financeService.create({
      tipo: FinanceType.ENTRADA,
      valor: total,
      descricao: `Pedido #${savedOrder.id} - ${cliente.nome}`,
      referenciaPedidoId: savedOrder.id,
    });

    return savedOrder;
  }

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.findOne(id);
    order.status = status;
    return await this.orderRepository.save(order);
  }
}
