'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import type {ChangeEvent, FormEvent} from "react";

type Props = {
  title: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
};

export default function TodoForm({title, onChange, onSubmit}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 mt-4">
      <Input
        placeholder="What needs to be done?"
        value={title}
        onChange={onChange}
      />
      <Button type="submit">Add</Button>
    </form>
  );
}
