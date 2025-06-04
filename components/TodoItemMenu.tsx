import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TodoItemMenuProps = {
  id: string;
  onArchive?: (id: string) => void;
};

export function TodoItemMenu(props: TodoItemMenuProps) {
  const { onArchive, id } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onArchive?.(id)}>Archive</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
