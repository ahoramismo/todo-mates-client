import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTodo } from '@/lib/api';
import { toast } from 'sonner';

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted successfully!');
    }
  });
}
