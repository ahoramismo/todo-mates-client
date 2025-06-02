import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTodo, Todo, UpdateDto } from '@/lib/api';
import { toast } from 'sonner';

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateDto: UpdateDto) => updateTodo(updateDto),

    onMutate: async (updateDto) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
        old.map(todo =>
          todo.id === updateDto.id ? { ...todo, ...updateDto } : todo
        )
      );

      return { previousTodos };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },

    onSuccess: () => {
      toast.success('Todo updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
}
