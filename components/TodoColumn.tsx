import {Card} from "@/components/ui/card";
import {Todo} from "@/lib/api";
import {Button} from "@/components/ui/button";
import {type UniqueIdentifier} from "@dnd-kit/core";

type Props = {
  group: {
    name: string
    entries: Todo[]
  }
  onDelete: (id: number) => void;
  id: UniqueIdentifier;
};

export default function TodoColumn({group, onDelete}: Props) {
  return (
    <div key={group.name}>
      <h2 className="text-xl font-semibold mb-4">{group.name}</h2>
      <div className="space-y-4">
        {group.entries.map((item) => (
          <Card
            key={item.id}
            className="p-4 flex justify-between items-center"
          >
            <span>{item.title}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item.id)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
