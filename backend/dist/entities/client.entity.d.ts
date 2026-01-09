import { Order } from './order.entity';
export declare class Client {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
    morada?: string;
    pedidos: Order[];
    dataCriacao: Date;
    dataAtualizacao: Date;
}
