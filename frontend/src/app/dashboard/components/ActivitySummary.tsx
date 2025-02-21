import { ActivitySummary as ActivitySummaryType } from '@/types/dashboard';

interface ActivitySummaryProps {
  data: ActivitySummaryType;
}

export function ActivitySummary({ data }: ActivitySummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Periodo</span>
        <span className="font-medium">{data.periodo}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Horas Ejecutadas</span>
        <span className="font-medium">{data.horasEjecutadas}h</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Actividades Completadas</span>
        <span className="font-medium">{data.actividadesCompletadas}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Eficiencia</span>
        <span className="font-medium">{data.eficiencia}%</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-primary-600"
          style={{ width: `${data.eficiencia}%` }}
        />
      </div>
    </div>
  );
} 