import api from './api';

export const getWeeklyReports = async () => {
  const res = await api.get('/reports/weekly');
  return res.data;
};
