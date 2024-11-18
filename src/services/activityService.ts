import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getActivities = async () => {
  const response = await axios.get(`${API_URL}/activities`);
  return response.data;
};

export const getActivityById = async (id) => {
  const response = await axios.get(`${API_URL}/activities/${id}`);
  return response.data;
};

export const createActivity = async (activityData) => {
  const response = await axios.post(`${API_URL}/activities`, activityData);
  return response.data;
};

export const updateActivity = async (id, activityData) => {
  const response = await axios.put(`${API_URL}/activities/${id}`, activityData);
  return response.data;
};

export const deleteActivity = async (id) => {
  const response = await axios.delete(`${API_URL}/activities/${id}`);
  return response.data;
};