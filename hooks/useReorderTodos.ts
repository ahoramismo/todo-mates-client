import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, reorderTodosOnServer } from '@/lib/api';

export function useReorderTodos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderTodosOnServer,
    onMutate: async (reOrderedIds: string[]) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      if (!previousTodos) return { previousTodos: [] };

      const reorderedTodos = reOrderedIds.map(id =>
        previousTodos.find(todo => todo.id === id)!
      );

      queryClient.setQueryData(['todos'], reorderedTodos);

      return { previousTodos };
    },
    onError: (_err, _newOrder, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
  });
}
