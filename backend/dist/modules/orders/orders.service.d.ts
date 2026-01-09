import { Repository } from 'typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { ClientsService } from '../clients/clients.service';
import { FinanceService } from '../finance/finance.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly orderItemRepository;
    private readonly clientsService;
    private readonly productsService;
    private readonly financeService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, clientsService: ClientsService, productsService: ProductsService, financeService: FinanceService);
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    updateStatus(id: number, status: OrderStatus): Promise<Order>;
}
