import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import TodoColumn from "@/components/TodoColumn";
import {useDroppable} from "@dnd-kit/core";

export function SortableContainer({title, items}: { title: string, items: any[] }) {
  const {setNodeRef} = useDroppable({id: title})

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef}>
        <TodoColumn title={title} items={items} />
      </div>
    </SortableContext>
  )
}
