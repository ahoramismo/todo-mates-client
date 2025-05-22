// hooks/useAddTodo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTodo, Todo } from '@/lib/api';

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodo,
    onMutate: async (title: string) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      const newTodo: Todo = {
        id: `temp-${Date.now()}`, // temporary id
        title,
        state: 'todo'
      };

      queryClient.setQueryData<Todo[]>(['todos'], (old = []) => [newTodo, ...old]);

      return { previousTodos };
    },
    onError: (_error, _title, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
