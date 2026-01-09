export declare enum FinanceType {
    ENTRADA = "ENTRADA",
    SAIDA = "SAIDA"
}
export declare class Finance {
    id: number;
    tipo: FinanceType;
    valor: number;
    descricao: string;
    referenciaPedidoId: number;
    data: Date;
}
