import Button from '@/components/ui/Button';
import { API } from '@/types/api';

interface InstructorTableProps {
  instructores: API.Instructor[];
  onEdit: (instructor: API.Instructor) => void;
}

export default function InstructorTable({ instructores, onEdit }: InstructorTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Documento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Correo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {instructores.map((instructor) => (
            <tr key={instructor._id}>
              <td className="whitespace-nowrap px-6 py-4">
                {instructor.nombre} {instructor.apellido}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {instructor.no_documento_identidad}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {instructor.correo}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    instructor.estado === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {instructor.estado}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(instructor)}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 