import api from './api';

export interface DashboardStats {
  activeOrders: number;
  newClients: number;
  monthlyRevenue: number;
  overdueOrders: number;
  recentActivity: any[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/reports/dashboard');
  return response.data;
};
