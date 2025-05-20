import { Todo } from '@/lib/api';
import { SortableItem } from '@/components/SortableItem';

type Props = {
  items: Todo[];
  title: string;
};

export default function TodoColumn({ title, items }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
