import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createEvent, updateEvent, Event } from '../../services/eventService';
import { getInstructors, Instructor } from '../../services/instructorService';

interface EventFormProps {
  event?: Event;
  onClose: () => void;
  onSave: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose, onSave }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [formData, setFormData] = useState<Omit<Event, 'ID_Evento'>>({
    Nombre_Evento: '',
    Fecha_Entrega: '',
    instructorIds: []
  });

  useEffect(() => {
    loadInstructors();
    if (event) {
      setFormData({
        ...event,
        instructorIds: event.instructorIds || []
      });
    }
  }, [event]);

  const loadInstructors = async () => {
    const data = await getInstructors();
    setInstructors(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (event?.ID_Evento) {
        await updateEvent(event.ID_Evento, formData);
      } else {
        await createEvent(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {event ? 'Editar' : 'Nuevo'} Evento
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Evento
            </label>
            <input
              type="text"
              value={formData.Nombre_Evento}
              onChange={(e) => setFormData({ ...formData, Nombre_Evento: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Entrega
            </label>
            <input
              type="date"
              value={formData.Fecha_Entrega}
              onChange={(e) => setFormData({ ...formData, Fecha_Entrega: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instructores Asignados
            </label>
            <select
              multiple
              value={formData.instructorIds?.map(String)}
              onChange={(e) => setFormData({
                ...formData,
                instructorIds: Array.from(e.target.selectedOptions, option => Number(option.value))
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {instructors.map(instructor => (
                <option key={instructor.ID_Instructor} value={instructor.ID_Instructor}>
                  {instructor.Nombre} {instructor.Apellido}
                </option>
              ))}
            </select>
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
              {event ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;