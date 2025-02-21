import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '@headlessui/react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useInstructores } from '@/hooks/useInstructores';
import { API } from '@/types/api';

const instructorSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  no_documento_identidad: z.string().min(1, 'El documento es requerido'),
  correo: z.string().email('Correo electrónico inválido'),
  contraseña: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  estado: z.enum(['activo', 'inactivo'])
});

type InstructorForm = z.infer<typeof instructorSchema>;

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor: API.Instructor | null;
}

export default function InstructorModal({ isOpen, onClose, instructor }: InstructorModalProps) {
  const { createInstructor, updateInstructor, isCreating, isUpdating } = useInstructores();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InstructorForm>({
    resolver: zodResolver(instructorSchema),
    defaultValues: instructor || {
      estado: 'activo'
    }
  });

  const onSubmit = async (data: InstructorForm) => {
    if (instructor) {
      await updateInstructor({ id: instructor._id, data });
    } else {
      await createInstructor(data);
    }
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            {instructor ? 'Editar Instructor' : 'Nuevo Instructor'}
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <Input
              label="Nombre"
              {...register('nombre')}
              error={errors.nombre?.message}
            />
            <Input
              label="Apellido"
              {...register('apellido')}
              error={errors.apellido?.message}
            />
            <Input
              label="Documento de Identidad"
              {...register('no_documento_identidad')}
              error={errors.no_documento_identidad?.message}
            />
            <Input
              label="Correo Electrónico"
              type="email"
              {...register('correo')}
              error={errors.correo?.message}
            />
            {!instructor && (
              <Input
                label="Contraseña"
                type="password"
                {...register('contraseña')}
                error={errors.contraseña?.message}
              />
            )}
            <select
              {...register('estado')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>

            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="ghost" onClick={onClose} type="button">
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isCreating || isUpdating}
              >
                {instructor ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 