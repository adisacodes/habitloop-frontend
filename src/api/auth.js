import api from './axios';

export const registerUser = async (username, email, password) => {
  const response = await api.post('register/', { username, email, password });
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await api.post('token/', { username, password });
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;
};