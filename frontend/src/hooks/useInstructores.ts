import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorService } from '@/services/instructorService';
import toast from 'react-hot-toast';

export const useInstructores = () => {
  const queryClient = useQueryClient();

  const { data: instructores, isLoading } = useQuery({
    queryKey: ['instructores'],
    queryFn: instructorService.getAll
  });

  const createMutation = useMutation({
    mutationFn: instructorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructores']);
      toast.success('Instructor creado exitosamente');
    },
    onError: (_error: Error | unknown) => {
      toast.error('Error al crear instructor');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<API.Instructor> }) => 
      instructorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['instructores']);
      toast.success('Instructor actualizado exitosamente');
    },
    onError: (_error: Error | unknown) => {
      toast.error('Error al actualizar instructor');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: instructorService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructores']);
      toast.success('Instructor eliminado exitosamente');
    },
    onError: (_error: Error | unknown) => {
      toast.error('Error al eliminar instructor');
    }
  });

  return {
    instructores,
    isLoading,
    createInstructor: createMutation.mutate,
    updateInstructor: updateMutation.mutate,
    deleteInstructor: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
}; 