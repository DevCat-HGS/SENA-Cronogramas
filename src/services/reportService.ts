import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Report {
  ID_Reporte?: number;
  Mes_A_Reportar: string;
  Dias_Habiles: number;
  ID_Instructor: number;
  Nombre?: string;
  Apellido?: string;
}

export interface ReportActivity {
  ID_Actividad: number;
  Actividad_Desarrollar: string;
  Numero_Ficha: string;
  seleccionado?: boolean;
}

export const getReports = async (): Promise<Report[]> => {
  const response = await axios.get(`${API_URL}/reports`);
  return response.data;
};

export const getInstructorsForSelection = async () => {
  const response = await axios.get(`${API_URL}/reports/instructors-selection`);
  return response.data;
};

export const getInstructorActivitiesByMonth = async (instructorId: number, month: string, year: string) => {
  const response = await axios.get(`${API_URL}/reports/activities/${instructorId}/${month}/${year}`);
  return response.data;
};

export const generateReportCSV = async (data: {
  instructorIds: number[];
  month: string;
  year: string;
  activityIds: number[];
}) => {
  const response = await axios.post(`${API_URL}/reports/generate-csv`, data, {
    responseType: 'blob'
  });
  return response.data;
};
