// useMouseAnchorPosition.ts

import { useState, useCallback } from 'react';

/**
 * useMouseAnchorPosition Hook
 *
 * 📌 实现功能：
 * - 捕捉鼠标点击位置（可带偏移）
 * - 返回锚点坐标 { x, y }
 * - 提供 setAnchorByMouseEvent 方法供 onClick 绑定使用
 *
 * @param offsetX - 横向偏移（默认 8px）
 * @param offsetY - 纵向偏移（默认 8px）
 * @returns [anchorPos, setAnchorByMouseEvent]
 */

/* 
用法示例：

import { useMouseAnchorPosition } from '@/hooks/useMouseAnchorPosition';

const MyComponent = () => {
  const [anchorPos, setAnchorByMouseEvent] = useMouseAnchorPosition();

  const handleClick = (e: React.MouseEvent) => {
    setAnchorByMouseEvent(e);  // 捕获锚点
    setShowDialog(true);       // 打开弹窗
  };

  return (
    <>
      <button onClick={handleClick}>收藏</button>

      {anchorPos && showDialog && (
        <FloatingPopoverWrapper anchorPos={anchorPos}>
          <div>收藏弹窗</div>
        </FloatingPopoverWrapper>
      )}
    </>
  );
};
 */
export function useMouseAnchorPosition(
  offsetX: number = 8,
  offsetY: number = 8
): [
  { x: number; y: number } | null,
  (e: React.MouseEvent<HTMLElement>) => void
] {
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number } | null>(null);

  const setAnchorByMouseEvent = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    setAnchorPos({
      x: rect.left + scrollX + offsetX,
      y: rect.top + scrollY + offsetY,
    });
  }, [offsetX, offsetY]);

  return [anchorPos, setAnchorByMouseEvent];
}
