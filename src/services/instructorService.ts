import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getInstructors = async () => {
  const response = await axios.get(`${API_URL}/instructors`);
  return response.data;
};

export const getInstructorById = async (id) => {
  const response = await axios.get(`${API_URL}/instructors/${id}`);
  return response.data;
};

export const createInstructor = async (instructorData) => {
  const response = await axios.post(`${API_URL}/instructors`, instructorData);
  return response.data;
};

export const updateInstructor = async (id, instructorData) => {
  const response = await axios.put(`${API_URL}/instructors/${id}`, instructorData);
  return response.data;
};

export const deleteInstructor = async (id) => {
  const response = await axios.delete(`${API_URL}/instructors/${id}`);
  return response.data;
};