import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Interfaces para las métricas
interface ActivityMetrics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  byMonth: { month: string; count: number }[];
}

interface InstructorMetrics {
  total: number;
  active: number;
  inactive: number;
  newRegistrations: { date: string; count: number }[];
}

interface ReportMetrics {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  byInstructor: { instructor: string; count: number }[];
}

interface EventMetrics {
  total: number;
  upcoming: number;
  past: number;
  byMonth: { month: string; count: number }[];
  participation: { event: string; confirmed: number; declined: number }[];
}

interface SystemMetrics {
  apiCalls: { endpoint: string; count: number }[];
  errors: { type: string; count: number }[];
  performance: { metric: string; value: number }[];
}

// Servicio principal
const analyticsService = {
  // Obtener métricas de actividades
  getActivityMetrics: async (timeRange?: string): Promise<ActivityMetrics> => {
    try {
      const response = await axios.get(`${API_URL}/analytics/activities`, {
        params: { timeRange },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener métricas de actividades:', error);
      throw error;
    }
  },

  // Obtener métricas de instructores
  getInstructorMetrics: async (timeRange?: string): Promise<InstructorMetrics> => {
    try {
      const response = await axios.get(`${API_URL}/analytics/instructors`, {
        params: { timeRange },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener métricas de instructores:', error);
      throw error;
    }
  },

  // Obtener métricas de reportes
  getReportMetrics: async (timeRange?: string): Promise<ReportMetrics> => {
    try {
      const response = await axios.get(`${API_URL}/analytics/reports`, {
        params: { timeRange },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener métricas de reportes:', error);
      throw error;
    }
  },

  // Obtener métricas de eventos
  getEventMetrics: async (timeRange?: string): Promise<EventMetrics> => {
    try {
      const response = await axios.get(`${API_URL}/analytics/events`, {
        params: { timeRange },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener métricas de eventos:', error);
      throw error;
    }
  },

  // Obtener métricas del sistema
  getSystemMetrics: async (): Promise<SystemMetrics> => {
    try {
      const response = await axios.get(`${API_URL}/analytics/system`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener métricas del sistema:', error);
      throw error;
    }
  },

  // Exportar datos de análisis en diferentes formatos
  exportAnalytics: async (type: string, format: 'csv' | 'pdf' | 'excel', timeRange?: string) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/export/${type}`, {
        params: { format, timeRange },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });
      
      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_analytics.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error al exportar análisis de ${type}:`, error);
      throw error;
    }
  }
};

export default analyticsService;