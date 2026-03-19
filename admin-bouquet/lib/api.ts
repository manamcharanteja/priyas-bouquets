import axios from 'axios';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  me: () => api.get('/api/auth/me'),
};

export const sareeAPI = {
  getAll: (params?: object) => api.get('/api/sarees', { params }),
  getById: (id: string) => api.get(`/api/sarees/${id}`),
  create: (data: FormData) => api.post('/api/sarees', data),
  update: (id: string, data: FormData) => api.put(`/api/sarees/${id}`, data),
  delete: (id: string) => api.delete(`/api/sarees/${id}`),
};

export const orderAPI = {
  getAll: (params?: object) => api.get('/api/orders', { params }),
  getById: (id: string) => api.get(`/api/orders/${id}`),
  updateStatus: (id: string, orderStatus: string) => api.put(`/api/orders/${id}/status`, { orderStatus }),
  getStats: () => api.get('/api/orders/admin/stats'),
};

export default api;
