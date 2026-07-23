import api from './axios';

export const getHabits = async () => {
  const response = await api.get('habits/');
  return response.data;
};

export const createHabit = async (habitData) => {
  const response = await api.post('habits/', habitData);
  return response.data;
};

export const updateHabit = async (habitId, habitData) => {
  const response = await api.patch(`habits/${habitId}/`, habitData);
  return response.data;
};

export const deleteHabit = async (habitId) => {
  await api.delete(`habits/${habitId}/`);
};

export const logHabit = async (habitId, date) => {
  const response = await api.post('logs/', { habit: habitId, date, completed: true });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('categories/');
  return response.data;
};

export const createCategory = async (name) => {
  const response = await api.post('categories/', { name });
  return response.data;
};

export const getReminders = async () => {
  const response = await api.get('reminders/');
  return response.data;
};

export const createReminder = async (habitId, time) => {
  const response = await api.post('reminders/', { habit: habitId, time, active: true });
  return response.data;
};

export const deleteReminder = async (reminderId) => {
  await api.delete(`reminders/${reminderId}/`);
};