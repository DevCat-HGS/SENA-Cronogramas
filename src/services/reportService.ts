import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const generateReport = async (params) => {
  const response = await axios.get(`${API_URL}/reports/generate`, { params });
  return response.data;
};