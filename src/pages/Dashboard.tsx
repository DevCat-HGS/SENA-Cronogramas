import React from 'react';
import { Users, Calendar, FileText, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    { title: 'Instructores', value: '24', icon: Users, path: '/instructors', color: 'bg-blue-500' },
    { title: 'Actividades', value: '12', icon: Calendar, path: '/activities', color: 'bg-green-500' },
    { title: 'Eventos', value: '8', icon: FileText, path: '/events', color: 'bg-purple-500' },
    { title: 'Reportes', value: '4', icon: BarChart2, path: '/reports', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, path, color }) => (
          <Link
            key={title}
            to={path}
            className="transform transition-all hover:scale-105"
          >
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{title}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
                </div>
                <div className={`${color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Actividades Recientes</h2>
          <div className="space-y-4">
            {/* Activity items would be mapped here */}
            <p className="text-gray-600">No hay actividades recientes</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
          <div className="space-y-4">
            {/* Event items would be mapped here */}
            <p className="text-gray-600">No hay eventos próximos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;