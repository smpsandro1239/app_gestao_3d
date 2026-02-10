import api from './api';

export interface Filament {
  id: number;
  brand: string;
  material: string;
  color: string;
  colorHex?: string;
  weight: number;
  price: number;
  stockAlert: number;
  initialWeight: number;
  currentWeight: number;
}

export const getFilaments = async (): Promise<Filament[]> => {
  const response = await api.get('/filaments');
  return response.data.map((item: any) => ({
    id: item.id,
    brand: item.marca,
    material: item.material,
    color: item.cor,
    colorHex: item.corHex,
    initialWeight: item.pesoInicial,
    currentWeight: item.pesoAtual,
    price: item.custo,
    stockAlert: item.alertaMinimo
  }));
};

export const createFilament = async (filamentData: any): Promise<Filament> => {
  const response = await api.post('/filaments', filamentData);
  return response.data;
};

export const updateFilament = async (id: number, filamentData: any): Promise<Filament> => {
  const response = await api.patch(`/filaments/${id}`, filamentData);
  return response.data;
};

export const deleteFilament = async (id: number): Promise<void> => {
  await api.delete(`/filaments/${id}`);
};
