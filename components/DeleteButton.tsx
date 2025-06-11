import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage'; // your hook path

interface DeleteButtonProps {
  itemId: string;
  onDelete?: (id: string) => void;
}

export function DeleteButton({ itemId, onDelete }: DeleteButtonProps) {
  const [confirmOnDelete] = useLocalStorage('confirmOnDelete', true);
  const [open, setOpen] = useState(false);

  const handleDeleteClick = () => {
    if (confirmOnDelete) {
      setOpen(true); // open confirm dialog
    } else {
      onDelete?.(itemId); // no confirm needed
    }
  };

  const handleConfirm = () => {
    onDelete?.(itemId);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteClick}
        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this todo? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
