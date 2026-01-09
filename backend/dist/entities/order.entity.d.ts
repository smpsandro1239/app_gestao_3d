import { Client } from './client.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    RECEBIDO = "RECEBIDO",
    EM_PRODUCAO = "EM_PRODUCAO",
    FINALIZADO = "FINALIZADO",
    ENVIADO = "ENVIADO",
    ENTREGUE = "ENTREGUE",
    CANCELADO = "CANCELADO"
}
export declare class Order {
    id: number;
    cliente: Client;
    itens: OrderItem[];
    total: number;
    status: OrderStatus;
    dataEntregaPrevista?: Date;
    metodoEntrega?: string;
    custoEntrega: number;
    notas?: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
}
