import {Card} from "@/components/ui/card";
import {Todo} from "@/lib/api";
import {Button} from "@/components/ui/button";

type Props = {
  title: string;
  todos: Todo[];
  onDelete: (id: number) => void;
};

export default function TodoColumn({title, todos, onDelete}: Props) {
  return (
    <div className="h-screen overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {todos.map((todo) => (
          <Card key={todo.id} className="p-4 flex justify-between items-center">
            <span>{todo.title}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(todo.id)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
