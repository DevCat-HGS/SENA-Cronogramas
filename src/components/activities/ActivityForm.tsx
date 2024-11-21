import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Activity, createActivity, updateActivity } from '../../services/activityService';
import { getInstructors, Instructor } from '../../services/instructorService';

interface BaseProps {
  onClose: () => void;
  onSave: () => void;
}

interface ActivityFormProps extends BaseProps {
  activity?: Activity;
}

const ActivityForm = ({ activity, onClose, onSave }: ActivityFormProps) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<number[]>([]);
  const [formData, setFormData] = useState<Omit<Activity, 'ID_Actividad'>>({
    Numero_Ficha: '',
    Fase_Proyecto: '',
    Actividad_Desarrollar: '',
    Competencia_Desarrollar: '',
    Resultados_Aprendizaje: '',
    Ambiente_Aprendizaje: '',
    Jornada: 'Mañana',
    Fecha_Desde: '',
    Fecha_Hasta: '',
    Hora_Desde: '',
    Hora_Hasta: '',
    Horas_Por_Dia: 0,
    Total_Horas: 0,
    instructorIds: []
  });

  useEffect(() => {
    loadInstructors();
    if (activity) {
      setFormData({
        ...activity,
        instructorIds: activity.instructorIds || []
      });
      setSelectedInstructors(activity.instructorIds || []);
    }
  }, [activity]);

  const loadInstructors = async () => {
    const data = await getInstructors();
    setInstructors(data);
  };

  const handleInstructorToggle = (instructorId: number) => {
    setSelectedInstructors(prev => {
      const newSelection = prev.includes(instructorId)
        ? prev.filter(id => id !== instructorId)
        : [...prev, instructorId];
      
      setFormData(prev => ({
        ...prev,
        instructorIds: newSelection
      }));
      
      return newSelection;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (activity?.ID_Actividad) {
        await updateActivity(activity.ID_Actividad, formData);
      } else {
        await createActivity(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {activity ? 'Editar' : 'Nueva'} Actividad
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de Ficha
              </label>
              <input
                type="text"
                value={formData.Numero_Ficha}
                onChange={(e) => setFormData({ ...formData, Numero_Ficha: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fase del Proyecto
              </label>
              <input
                type="text"
                value={formData.Fase_Proyecto}
                onChange={(e) => setFormData({ ...formData, Fase_Proyecto: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jornada
            </label>
            <select
              value={formData.Jornada}
              onChange={(e) => setFormData({ ...formData, Jornada: e.target.value as Activity['Jornada'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Actividad a Desarrollar
            </label>
            <textarea
              value={formData.Actividad_Desarrollar}
              onChange={(e) => setFormData({ ...formData, Actividad_Desarrollar: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Competencia a Desarrollar
            </label>
            <textarea
              value={formData.Competencia_Desarrollar}
              onChange={(e) => setFormData({ ...formData, Competencia_Desarrollar: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resultados de Aprendizaje
            </label>
            <textarea
              value={formData.Resultados_Aprendizaje}
              onChange={(e) => setFormData({ ...formData, Resultados_Aprendizaje: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ambiente de Aprendizaje
              </label>
              <input
                type="text"
                value={formData.Ambiente_Aprendizaje}
                onChange={(e) => setFormData({ ...formData, Ambiente_Aprendizaje: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instructores Asignados ({selectedInstructors.length} seleccionados)
              </label>
              <div className="mt-1 border rounded-md border-gray-300 max-h-40 overflow-y-auto">
                {instructors.map(instructor => (
                  <div 
                    key={instructor.ID_Instructor}
                    className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleInstructorToggle(instructor.ID_Instructor!)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedInstructors.includes(instructor.ID_Instructor!)}
                      onChange={() => {}}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      {instructor.Nombre} {instructor.Apellido}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Desde
              </label>
              <input
                type="date"
                value={formData.Fecha_Desde}
                onChange={(e) => setFormData({ ...formData, Fecha_Desde: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={formData.Fecha_Hasta}
                onChange={(e) => setFormData({ ...formData, Fecha_Hasta: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora Desde
              </label>
              <input
                type="time"
                value={formData.Hora_Desde}
                onChange={(e) => setFormData({ ...formData, Hora_Desde: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora Hasta
              </label>
              <input
                type="time"
                value={formData.Hora_Hasta}
                onChange={(e) => setFormData({ ...formData, Hora_Hasta: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Horas por Día
              </label>
              <input
                type="number"
                value={formData.Horas_Por_Dia}
                onChange={(e) => setFormData({ ...formData, Horas_Por_Dia: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Horas
              </label>
              <input
                type="number"
                value={formData.Total_Horas}
                onChange={(e) => setFormData({ ...formData, Total_Horas: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {activity ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;