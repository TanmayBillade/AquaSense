import api from './api';

export const getFilterHealth = async () => {
  const res = await api.get('/analytics/filter-health');
  return res.data;
};

export const getPrediction = async () => {
  const res = await api.get('/analytics/prediction');
  return res.data;
};

export const getAlerts = async (params?: any) => {
  const res = await api.get('/analytics/alerts', { params });
  return res.data;
};

export const markAlertRead = async (id: string) => {
  const res = await api.put(`/analytics/alerts/${id}/read`);
  return res.data;
};
