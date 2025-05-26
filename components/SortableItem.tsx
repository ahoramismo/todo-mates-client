import type { FC } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo } from '@/lib/api';
import { useDeleteTodo } from '@/hooks';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TodoItemProps = {
  item: Todo;
};

type ItemProps = {
  item: Todo;
  onDelete?: (id: string) => void;
  listeners?: ReturnType<typeof useSortable>['listeners'];
  isOverlay?: boolean;
};

export function Item({ item, onDelete, listeners, isOverlay = false }: ItemProps) {
  return (
    <div
      className={cn('group flex items-center gap-2 rounded-xl border p-2 shadow-sm bg-card', isOverlay && 'opacity-75')}
    >
      <Button
        variant="ghost"
        size="icon"
        {...listeners}
        className={cn('h-6 w-6 p-0 opacity-0 group-hover:opacity-100 cursor-grab', isOverlay && 'opacity-100')}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </Button>
      <Checkbox />
      <span
        title={item.title}
        className={cn('flex-1 text-sm', item.state === 'done' && 'line-through text-muted-foreground')}
      >
        {item.title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete?.(item.id)}
        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const SortableItem: FC<TodoItemProps> = ({ item }) => {
  const { id } = item;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const { mutate: deleteTodo } = useDeleteTodo();

  return (
    <div ref={setNodeRef} {...attributes} style={style}>
      <Item item={item} listeners={listeners} onDelete={deleteTodo} isOverlay={isDragging} />
    </div>
  );
};
