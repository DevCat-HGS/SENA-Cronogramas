import api from './api';
import { DashboardStats, ActivitySummary } from '@/types/dashboard';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  async getActivitySummary(periodo: string): Promise<ActivitySummary> {
    const response = await api.get<ActivitySummary>(`/dashboard/activity-summary/${periodo}`);
    return response.data;
  },

  async getActivityTrends(): Promise<{
    labels: string[];
    data: number[];
  }> {
    const response = await api.get('/dashboard/activity-trends');
    return response.data;
  }
}; 