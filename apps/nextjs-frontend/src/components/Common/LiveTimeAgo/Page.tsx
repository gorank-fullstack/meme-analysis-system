// src/components/LiveTimeAgo.tsx
'use client';
import { useEffect, useState } from 'react';

type Props = {
    seconds: number;
    tickSeconds?: number; // 默认1秒tick一次
};

// ✅ 支持“小时 + 分钟”格式的 LiveTimeAgo 组件
export const LiveTimeAgo = ({ seconds, tickSeconds = 1 }: Props) => {
    const [nowSec, setNowSec] = useState(Math.floor(Date.now() / 1000)); // 当前时间秒

    useEffect(() => {
        const interval = setInterval(() => {
            setNowSec(Math.floor(Date.now() / 1000));
        }, tickSeconds * 1000);
        return () => clearInterval(interval);
    }, [tickSeconds]);

    const diffSec = nowSec - seconds;

    if (diffSec < 60) {
        return <span className="gr-k-line-green">{diffSec}s</span>; // ⏱ 仅秒数
    }

    if (diffSec < 3600) {
        const m = Math.floor(diffSec / 60);
        const s = diffSec % 60;
        return <span className="gr-k-line-green">{m}m {s}s</span>; // ⏱ 分钟+秒
    }

    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    return <span className="gr-k-line-green">{h}h {m}m</span>; // ⏱ 小时+分钟
};

