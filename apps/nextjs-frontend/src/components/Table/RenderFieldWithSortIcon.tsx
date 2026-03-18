// src/components/table/RenderFieldWithSortIcon.tsx

import React from "react";
// import { UpDownFill, UpFill, DownFill } from "@/components/icons/sort"; // 路径根据你项目实际调整
import { UpDownFill } from '@/components/icons/sort/UpDownFill';
import { UpFill } from '@/components/icons/sort/UpFill';
import { DownFill } from '@/components/icons/sort/DownFill';

export function renderFieldWithSortIcon(
  sortField: string,
  sortOrder: 'asc' | 'desc',
  fieldShowName: string,
  column: string
): React.ReactNode {
  if (sortField !== column) {
    return (
      <div className="flex items-center gap-1">
        <div className="text-dex-text-secondary">{fieldShowName}</div>
        <div className="ml-1"><UpDownFill /></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="text-dex-text-primary">{fieldShowName}</div>
      <div className="ml-1 text-dex-text-primary">
        {sortOrder === "asc" ? (
          <UpFill fill="currentColor" />
        ) : (
          <DownFill fill="currentColor" />
        )}
      </div>
    </div>
  );
}
