import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, toggleTodo } from '@/lib/api'; // This API accepts id + new completed state

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todo: Todo) => {
      // Call the API to update the state
      return await toggleTodo(todo);
    },

    // Optimistic update
    onMutate: async (todo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
        old.map((t) => (t.id === todo.id ? { ...t, completed: !todo.completed } : t))
      );

      // Return the rollback data
      return { previousTodos };
    },

    // If error, rollback
    onError: (err, todo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },

    // After success or error, refetch if needed (optional)
    onSettled: () => {
      // Optionally remove this if you're confident in the optimistic updates!
      // queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
}
