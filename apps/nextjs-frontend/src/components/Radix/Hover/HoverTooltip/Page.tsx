// components/Tooltip/HeaderTooltip.tsx
'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';
import {Z_INDEX,OFFSET} from "@/config/ui_const";

interface HoverTooltipProps {
  children: ReactNode;         // Tooltip 触发点，例如一个 <th> 里的内容
  content: ReactNode;          // 鼠标悬停时展示的提示内容
  delayDuration?: number;      // 延迟展示时间（默认 300ms）
}

export function HoverTooltip({
  children,
  content,
  delayDuration = 300,
}: HoverTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {/* 👇 Tooltip 触发区域必须是个元素 */}
          <div className="inline-block">{children}</div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
          // 加 max-w-xs	限宽，避免超长撑破界面（xs = 20rem）
          // 加 text-center 文本居中（可选）
          // 	加上 whitespace-pre-wrap 支持换行和中文空格
            // className={`z-[${Z_INDEX.TOOLTIP}] px-4 py-3 text-sm rounded shadow bg-neutral text-neutral-content animate-fade-in`}
            // className={`z-[${Z_INDEX.TOOLTIP}] max-w-xs !px-3 !py-2 text-sm rounded-md shadow-lg bg-neutral text-neutral-content whitespace-pre-wrap text-center animate-fade-in`}
            className={`z-[${Z_INDEX.TOOLTIP}] 
            max-w-xs !px-3 !py-2 text-sm rounded-md shadow-lg 
            bg-gray-600 text-neutral-content 
            whitespace-pre-wrap text-center animate-fade-in`}
            side="top"
            sideOffset={OFFSET.TOOLTIP}
          >
            {content}
            <Tooltip.Arrow className="fill-gray-600" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
