import axios, { InternalAxiosRequestConfig } from 'axios';

export const BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  return config;
});

export const getImageUrl = (path?: string) => {
    if (!path) return 'https://via.placeholder.com/200?text=Sem+Imagem';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default api;
