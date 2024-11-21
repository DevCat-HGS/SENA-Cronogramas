import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Event {
  ID_Evento?: number;
  Nombre_Evento: string;
  Fecha_Entrega: string;
  instructorIds?: number[];
}

export const getEvents = async (): Promise<Event[]> => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

export const createEvent = async (event: Omit<Event, 'ID_Evento'>) => {
  const response = await axios.post(`${API_URL}/events`, event);
  return response.data;
};

export const updateEvent = async (id: number, event: Partial<Event>) => {
  const response = await axios.put(`${API_URL}/events/${id}`, event);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  const response = await axios.delete(`${API_URL}/events/${id}`);
  return response.data;
};