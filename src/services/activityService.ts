import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Activity {
  ID_Actividad?: number;
  Numero_Ficha: string;
  Fase_Proyecto: string;
  Actividad_Desarrollar: string;
  Competencia_Desarrollar: string;
  Resultados_Aprendizaje?: string;
  Ambiente_Aprendizaje?: string;
  Fecha_Desde: string;
  Fecha_Hasta: string;
  Hora_Desde: string;
  Hora_Hasta: string;
  Horas_Por_Dia: number;
  Total_Horas: number;
  instructorIds?: number[];
}

export const getActivities = async (): Promise<Activity[]> => {
  const response = await axios.get(`${API_URL}/activities`);
  return response.data;
};

export const createActivity = async (activity: Omit<Activity, 'ID_Actividad'>) => {
  const response = await axios.post(`${API_URL}/activities`, activity);
  return response.data;
};

export const updateActivity = async (id: number, activity: Partial<Activity>) => {
  const response = await axios.put(`${API_URL}/activities/${id}`, activity);
  return response.data;
};

export const deleteActivity = async (id: number) => {
  const response = await axios.delete(`${API_URL}/activities/${id}`);
  return response.data;
};