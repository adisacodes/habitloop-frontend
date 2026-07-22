import api from './axios';

export const getHabits = async () => {
  const response = await api.get('habits/');
  return response.data;
};

export const createHabit = async (habitData) => {
  const response = await api.post('habits/', habitData);
  return response.data;
};