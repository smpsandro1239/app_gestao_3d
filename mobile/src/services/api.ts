import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Alterar para o IP do seu servidor em produção
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use(async (config) => {
  // Aqui você buscaria o token do AsyncStorage (exemplo)
  // const token = await AsyncStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default api;
