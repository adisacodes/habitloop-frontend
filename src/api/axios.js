import axios from 'axios';

const api = axios.create({
  baseURL: 'https://habitloop-backend-production.up.railway.app/api/',
});

api.interceptors.request.use((config) => {
  const publicEndpoints = ['register/', 'token/'];
  const isPublic = publicEndpoints.some((endpoint) => config.url.includes(endpoint));

  if (!isPublic) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;