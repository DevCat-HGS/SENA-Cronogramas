interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  description?: string;
}

export function StatsCard({ title, value, icon, trend, description }: StatsCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="rounded-full bg-primary-50 p-3 text-primary-600">
          {icon}
        </div>
      </div>
      {(trend || description) && (
        <div className="mt-4">
          {trend && (
            <span
              className={`inline-flex items-center text-sm ${
                trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          {description && (
            <span className="ml-2 text-sm text-gray-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
} 