import { API } from '@/types/api';
import api from './api';

export const instructorService = {
  async getAll(): Promise<API.Response<API.Instructor[]>> {
    const response = await api.get<API.Response<API.Instructor[]>>('/instructores');
    return response.data;
  },

  async getById(id: string): Promise<API.Response<API.Instructor>> {
    const response = await api.get<API.Response<API.Instructor>>(`/instructores/${id}`);
    return response.data;
  },

  async create(data: Partial<API.Instructor>): Promise<API.Response<API.Instructor>> {
    const response = await api.post<API.Response<API.Instructor>>('/instructores', data);
    return response.data;
  },
  async update(id: string, data: Partial<API.Instructor>): Promise<API.Response<API.Instructor>> {
    const response = await api.put<API.Response<API.Instructor>>(`/instructores/${id}`, data);
    return response.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/instructores/${id}`);
  }
};