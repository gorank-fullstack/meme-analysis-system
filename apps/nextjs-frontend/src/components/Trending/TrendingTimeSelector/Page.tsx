'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const TIME_RANGES: { label: string; qtType: string }[] = [
  { label: '5分钟', qtType: '5m' },
  { label: '1小时', qtType: '1h' },
  { label: '6小时', qtType: '6h' },
  { label: '24小时', qtType: '24h' },
];

interface ITimeSelectorProps {
  chainName: string;
  tabType_Client: string;
  qt: string; // 当前 query string 中的 qt 值（例如 "5m"）
}

export function TrendingTimeSelector({
  chainName,
  tabType_Client,
  qt,
}: ITimeSelectorProps) {
  const router = useRouter();
  const [activeQt, setActiveQt] = useState(qt);

  useEffect(() => {
    setActiveQt(qt); // 外部变动时同步更新
  }, [qt]);

  return (
    <div className="flex gap-2 !my-2">
      {TIME_RANGES.map(({ label, qtType: qtValue }) => {
        const isActive = activeQt === qtValue;
        return (
          <div
            key={qtValue}
            onClick={() => {
              setActiveQt(qtValue);
              router.push(`/?chain=${chainName}&tab=${tabType_Client}&qt=${qtValue}`);
            }}
            role="button"            // 可访问性增强：告诉屏幕阅读器这是按钮
            tabIndex={0}             // 可聚焦：支持键盘 tab 聚焦
            onKeyDown={(e) => {      // 支持键盘 Enter 激活
              if (e.key === 'Enter') {
                setActiveQt(qtValue);
                router.push(`/?chain=${chainName}&tab=${tabType_Client}&qt=${qtValue}`);
              }
            }}
            className={`cursor-pointer !px-3 !py-1 rounded-md text-sm font-medium transition
    ${isActive
                ? 'bg-neutral text-white'
                : 'bg-transparent text-neutral-content/70 hover:bg-neutral/30 hover:text-white'}
  `}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}
