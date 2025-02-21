import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

export const useDashboard = () => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats
  });

  const { data: activityTrends, isLoading: isLoadingTrends } = useQuery({
    queryKey: ['activity-trends'],
    queryFn: dashboardService.getActivityTrends
  });

  return {
    stats,
    activityTrends,
    isLoading: isLoadingStats || isLoadingTrends
  };
}; 