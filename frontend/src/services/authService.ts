import api from './api';

export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);
export const forgotPassword = (data: any) => api.post('/auth/forgot-password', data);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data: any) => api.put('/auth/profile', data);
