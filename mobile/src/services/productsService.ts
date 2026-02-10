import api from './api';

export interface Product {
    id: number;
    nome: string;
    descricao?: string;
    preco: number;
    custoProducao?: number;
    pesoEstimado?: number;
    tempoImpressao?: number;
    stockQuantity: number;
    imagens?: string[];
    // tipo: 'PRODUTO' | 'SERVICO'; // Removed as backend doesn't seem to return it explicitly yet, or we assume PRODUCT for now
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};
export const createProduct = async (data: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
};

export const updateProduct = async (id: number, data: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
};
