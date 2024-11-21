import { Pencil, Trash2 } from 'lucide-react';
import { Instructor } from '../../services/instructorService';

interface InstructorListProps {
  instructors: Instructor[];
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: number) => void;
}

const InstructorList = ({ instructors, onEdit, onDelete }: InstructorListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contraseña
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Correo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {instructors.map((instructor) => (
            <tr key={instructor.ID_Instructor}>
              <td className="px-6 py-4 whitespace-nowrap">
                {instructor.Nombre} {instructor.Apellido}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {instructor.No_Documento_Identidad}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{instructor.Contraseña}</td>
              <td className="px-6 py-4 whitespace-nowrap">{instructor.Correo}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(instructor)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => instructor.ID_Instructor && onDelete(instructor.ID_Instructor)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorList;