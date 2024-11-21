import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Instructor {
  ID_Instructor?: number;
  Nombre: string;
  Apellido: string;
  No_Documento_Identidad: string;
  Contraseña: string;
  Correo: string;
}

export const getInstructors = async (): Promise<Instructor[]> => {
  const response = await axios.get(`${API_URL}/instructors`);
  return response.data;
};

export const createInstructor = async (instructor: Omit<Instructor, 'ID_Instructor'>) => {
  const response = await axios.post(`${API_URL}/instructors`, instructor);
  return response.data;
};

export const updateInstructor = async (id: number, instructor: Partial<Instructor>) => {
  const response = await axios.put(`${API_URL}/instructors/${id}`, instructor);
  return response.data;
};

export const deleteInstructor = async (id: number) => {
  const response = await axios.delete(`${API_URL}/instructors/${id}`);
  return response.data;
};