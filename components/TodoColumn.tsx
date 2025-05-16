import {Card} from "@/components/ui/card";
import {Todo} from "@/lib/api";
import {Button} from "@/components/ui/button";
import {type UniqueIdentifier, useDroppable} from "@dnd-kit/core";
import {DraggableCard} from "@/components/DraggableCard";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";

type Props = {
  group: {
    name: string
    entries: Todo[]
  }
  onDelete: (id: number) => void;
  id: UniqueIdentifier;
};

export default function TodoColumn({group, onDelete, id}: Props) {
  const {setNodeRef} = useDroppable({id});

  return (
    <div ref={setNodeRef} key={group.name}>
      <h2 className="text-xl font-semibold mb-4">Todo</h2>
      <div className="space-y-4">
        {group.entries.map((item) => (
          <DraggableCard key={item.id} todo={item} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
