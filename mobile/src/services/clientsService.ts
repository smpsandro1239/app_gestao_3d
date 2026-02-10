import api from './api';

export interface Client {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  nif?: string;
  endereco?: string;
}

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get('/clients');
  return response.data;
};

export const getClient = async (id: number): Promise<Client> => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};
export const createClient = async (data: any): Promise<Client> => {
  const response = await api.post('/clients', data);
  return response.data;
};

export const updateClient = async (id: number, data: any): Promise<Client> => {
  const response = await api.patch(`/clients/${id}`, data);
  return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await api.delete(`/clients/${id}`);
};
