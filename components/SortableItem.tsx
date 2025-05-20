import { Todo } from '@/lib/api';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Item = ({ item }: { item: Todo }) => {
  return (
    <div>
      <Card key={item.id} className="p-4 flex justify-between items-center">
        <span>{item.title}</span>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </Card>
    </div>
  );
};

export const SortableItem = ({ item }: { item: Todo }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item item={item}/>
    </div>
  );
};
