import api from './api';

export const createReading = async (data: any) => {
  const res = await api.post('/readings', data);
  return res.data;
};

export const getLatest = async () => {
  const res = await api.get('/readings/latest');
  return res.data;
};

export const getHistory = async (params?: any) => {
  const res = await api.get('/readings/history', { params });
  return res.data;
};
