import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createInstructor, Instructor, updateInstructor } from '../../services/instructorService';

interface InstructorFormProps {
  instructor: Instructor | null | undefined;
  onClose: () => void;
  onSave: () => void;
}

const InstructorForm = ({ instructor, onClose, onSave }: InstructorFormProps) => {
  const [formData, setFormData] = useState<Instructor>({
    Nombre: '',
    Apellido: '',
    No_Documento_Identidad: '',
    Contraseña: '',
    Correo: '',
  });

  useEffect(() => {
    if (instructor) {
      setFormData(instructor);
    }
  }, [instructor]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (instructor) {
        await updateInstructor(instructor.ID_Instructor!, formData);
      } else {
        await createInstructor(formData);
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
            {instructor ? 'Editar' : 'Nuevo'} Instructor
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre/s</label>
            <input
              type="text"
              value={formData.Nombre}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, Nombre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input
              type="text"
              value={formData.Apellido}
              onChange={(e) => setFormData({ ...formData, Apellido: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Documento de Identidad
            </label>
            <input
              type="text"
              value={formData.No_Documento_Identidad}
              onChange={(e) => setFormData({ ...formData, No_Documento_Identidad: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="text"
              value={formData.Contraseña}
              onChange={(e) => setFormData({ ...formData, Contraseña: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              value={formData.Correo}
              onChange={(e) => setFormData({ ...formData, Correo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
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
              {instructor ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorForm;