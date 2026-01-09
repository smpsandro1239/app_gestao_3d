declare class CreateOrderItemDto {
    produtoId: number;
    quantidade: number;
    precoUnitario?: number;
    cor?: string;
    material?: string;
    preenchimento?: number;
    observacoesTecnicas?: string;
}
export declare class CreateOrderDto {
    clienteId: number;
    itens: CreateOrderItemDto[];
    metodoEntrega?: string;
    custoEntrega?: number;
    dataEntregaPrevista?: Date;
    notas?: string;
}
export {};
