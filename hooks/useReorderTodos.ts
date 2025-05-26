import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, reorderTodosOnServer } from '@/lib/api';

export function useReorderTodos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderTodosOnServer, // Pass IDs
    onMutate: async (reOrderedIds: string[]) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      return { previousTodos };
    },
    onError: (_err, _newOrder, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ['todos'] });
    // },
  });
}
