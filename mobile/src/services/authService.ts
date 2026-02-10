import api from './api';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.access_token) {
        // Set default header for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        return response.data;
    }
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};
