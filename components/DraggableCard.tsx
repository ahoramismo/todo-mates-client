import {useDraggable} from '@dnd-kit/core';
import {Card} from "@/components/ui/card";
import {Todo} from "@/lib/api";
import {Button} from "@/components/ui/button";

export function DraggableCard({todo, onDelete}: {todo: Todo; onDelete: (id: number) => void}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: todo.id.toString(),
    data: {todo},
  });

  const style = transform
    ? {transform: `translate(${transform.x}px, ${transform.y}px)`}
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="p-4 flex justify-between items-center"
    >
      <span>{todo.title}</span>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </Button>
    </Card>
  );
}
