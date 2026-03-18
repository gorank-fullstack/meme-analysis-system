'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import { ReactNode } from 'react';
import { TokenHoverCardContent } from '@/components/Radix/Hover/TokenHoverCardContent/Page';
import { IGrTokenSortItem_Client } from '@gr/interface-api/uniform-data'

interface HoverTokenCardProps {
  token: IGrTokenSortItem_Client;
  children: ReactNode; // 通常是 <TokenRowContent /> 作为触发区域
}

export function HoverTokenCard({ token, children }: HoverTokenCardProps) {
  return (
    <HoverCard.Root openDelay={300} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <div className="hover:bg-neutral/10 rounded-md cursor-pointer">
          {children}
        </div>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="right"
          align="start"
          sideOffset={12}
          className="z-[99] bg-base-100 shadow-xl rounded-xl p-4 w-[420px] pointer-events-auto"
        >
          <TokenHoverCardContent token={token} />
          <HoverCard.Arrow className="fill-base-100" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
