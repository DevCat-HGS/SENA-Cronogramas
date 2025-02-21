'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { StatsCard } from './components/StatsCard';
import { ActivityChart } from './components/ActivityChart';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { stats, activityTrends, isLoading } = useDashboard();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Instructores"
          value={stats?.totalInstructores || 0}
          icon={<UserGroupIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Instructores Activos"
          value={stats?.instructoresActivos || 0}
          icon={<UserGroupIcon className="h-6 w-6" />}
          trend={5}
        />
        <StatsCard
          title="Actividades Activas"
          value={stats?.actividadesActivas || 0}
          icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Eventos Pendientes"
          value={stats?.eventosPendientes || 0}
          icon={<CalendarIcon className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityChart data={activityTrends || { labels: [], data: [] }} />
        
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">
            Resumen de Actividades
          </h2>
          {/* Aquí irá el contenido del resumen */}
        </div>
      </div>
    </div>
  );
} 