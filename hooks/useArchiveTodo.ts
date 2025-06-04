import { useMutation, useQueryClient } from "@tanstack/react-query"
import { archiveTodo } from "@/lib/api"

export function useArchiveTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: archiveTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
    onError: (error) => {
      console.error("Failed to archive todo:", error)
    }
  })
}
