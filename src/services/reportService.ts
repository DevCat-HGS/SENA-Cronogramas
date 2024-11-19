import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface ReportParams {
  month: string;
  year: number;
  instructorId: number;
}

export const generateReport = async (params: ReportParams) => {
  const response = await axios.get(`${API_URL}/reports/generate`, { params });
  return response.data;
};