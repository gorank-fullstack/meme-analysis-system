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
    <div className="flex space-x-4">
      {TIME_RANGES.map(({ label, qtType: qtValue }) => (
        <button
          key={qtValue}
          onClick={() => {
            setActiveQt(qtValue);
            router.push(`/?chain=${chainName}&tab=${tabType_Client}&qt=${qtValue}`);
          }}
          className={`px-3 py-1 rounded-md text-sm transition
            ${
              activeQt === qtValue
                ? 'bg-neutral text-white'
                : 'text-neutral-content hover:bg-neutral hover:text-white'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
