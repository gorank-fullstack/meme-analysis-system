import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';

export function ManageGroupRowEdit({
  defaultValue,
  onSave,
  onCancel,
  children, // 👉 作为触发点的按钮（编辑图标）
}: {
  defaultValue: string;
  onSave: (val: string) => void;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        {children} {/* ✏️ 按钮 */}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="p-2 rounded shadow bg-base-200 flex items-center gap-2 z-50"
          side="top"
          sideOffset={5}
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="input input-sm w-40"
            autoFocus
          />
          <button
            onClick={() => {
              onSave(value);
              setOpen(false);
            }}
            className="btn btn-sm btn-success"
          >
            ✅
          </button>
          <button
            onClick={() => {
              onCancel();
              setOpen(false);
            }}
            className="btn btn-sm btn-ghost"
          >
            ❌
          </button>
          <Popover.Arrow className="fill-base-200" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
