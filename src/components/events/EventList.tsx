import { Pencil, Trash2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Event } from '../../services/eventService';

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const EventList = ({ events, onEdit, onDelete }: EventListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Evento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Entrega
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Instructores
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => {
            const fechaEntrega = new Date(event.Fecha_Entrega);
            const hoy = new Date();
            const diasRestantes = Math.ceil(
              (fechaEntrega.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            let estado = '';
            let estadoColor = '';
            
            if (diasRestantes < 0) {
              estado = 'Vencido';
              estadoColor = 'text-red-600';
            } else if (diasRestantes === 0) {
              estado = 'Hoy';
              estadoColor = 'text-yellow-600';
            } else if (diasRestantes <= 3) {
              estado = `${diasRestantes} días`;
              estadoColor = 'text-orange-600';
            } else {
              estado = `${diasRestantes} días`;
              estadoColor = 'text-green-600';
            }

            return (
              <tr key={event.ID_Evento}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.Nombre_Evento}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(event.Fecha_Entrega), 'dd MMM yyyy', { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                        <Users className="w-5 h-5 text-gray-400 mr-2" />
                        <span>{event.instructorIds?.length || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`${estadoColor} font-medium`}>
                    {estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(event)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                      <button
                        onClick={() => event.ID_Evento && onDelete(event.ID_Evento)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;