import api from './api';

export interface Order {
  id: number;
  cliente: {
    id: number;
    nome: string;
  };
  itens: any[]; // Define deeper if needed
  total: number;
  status: string;
  dataEntregaPrevista: string;
  dataCriacao: string;
}

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export interface CreateOrderDto {
  clienteId: number;
  dataEntregaPrevista?: string;
  metodoEntrega?: string;
  custoEntrega?: number;
  notas?: string;
  itens: {
    produtoId: number;
    quantidade: number;
    precoUnitario?: number;
    cor?: string;
    material?: string;
    preenchimento?: string;
    observacoesTecnicas?: string;
  }[];
}

export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`/orders/${id}`);
};
