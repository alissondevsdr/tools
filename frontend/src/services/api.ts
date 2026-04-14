import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getClients = () => api.get('/clients');
export const getGroups = () => api.get('/groups');
export const createClient = (data: any) => api.post('/clients', data);
export const updateClient = (id: number, data: any) => api.put(`/clients/${id}`, data);
export const deleteClient = (id: number) => api.delete(`/clients/${id}`);
export const testClient = (id: number) => api.post(`/clients/${id}/test`);
export const testAllClients = () => api.post('/clients/test-all');
export const lookupCNPJ = (cnpj: string) => api.get(`/cnpj/${cnpj}`);
export const createGroup = (name: string) => api.post('/groups', { name });

export default api;
