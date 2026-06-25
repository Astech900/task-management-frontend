import axios from 'axios';

// The base URL uses the Vite proxy in development,
// but switches to your Railway backend automatically in production.
const baseURL = import.meta.env.PROD 
  ? 'https://task-management-backend-production-cf88.up.railway.app/api' 
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject the Auth Token into requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
