import api from './api';

export interface Printer {
  id: number;
  name: string;
  model: string;
  ipAddress: string;
  status: 'IDLE' | 'PRINTING' | 'PAUSED' | 'ERROR' | 'OFFLINE';
  currentJobName?: string;
  progress?: number;
  temperatureNozzle?: number;
  temperatureBed?: number;
  remainingTime?: number;
}

export const getPrinters = async (): Promise<Printer[]> => {
  const response = await api.get('/printers');
  return response.data;
};

export const updatePrinter = async (id: number, data: Partial<Printer>): Promise<Printer> => {
  const response = await api.patch(`/printers/${id}`, data);
  return response.data;
};
