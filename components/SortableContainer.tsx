import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import TodoColumn from "@/components/TodoColumn";
import {useDroppable} from "@dnd-kit/core";
import { Todo } from '@/lib/api';

export function SortableContainer({title, items}: { title: string, items: Todo[] }) {
  const {setNodeRef} = useDroppable({id: title})

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef}>
        <TodoColumn title={title} items={items} />
      </div>
    </SortableContext>
  )
}
