import { Order } from './order.entity';
import { Product } from './product.entity';
export declare class OrderItem {
    id: number;
    pedido: Order;
    produto: Product;
    quantidade: number;
    precoUnitario: number;
    cor?: string;
    material?: string;
    preenchimento?: number;
    observacoesTecnicas?: string;
}
