import { OrderStatus } from '../../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<import("../../entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("../../entities/order.entity").Order>;
    create(createOrderDto: CreateOrderDto): Promise<import("../../entities/order.entity").Order>;
    updateStatus(id: string, status: OrderStatus): Promise<import("../../entities/order.entity").Order>;
}
