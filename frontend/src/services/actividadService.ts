import api from './api';
import { Actividad } from '@/types/actividad';

export const actividadService = {
  async getAll(): Promise<Actividad[]> {
    const response = await api.get<Actividad[]>('/actividades');
    return response.data;
  },

  async getById(id: string): Promise<Actividad> {
    const response = await api.get<Actividad>(`/actividades/${id}`);
    return response.data;
  },

  async create(data: Partial<Actividad>): Promise<Actividad> {
    const response = await api.post<Actividad>('/actividades', data);
    return response.data;
  },

  async update(id: string, data: Partial<Actividad>): Promise<Actividad> {
    const response = await api.put<Actividad>(`/actividades/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/actividades/${id}`);
  }
}; 