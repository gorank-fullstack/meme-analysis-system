// useDomAnchorPosition.ts

import { useEffect, useState } from 'react';

/**
 * useDomAnchorPosition Hook
 *
 * 📌 实现功能：
 * - 接收一个 HTMLElement 的 ref
 * - 自动计算该元素在页面中的锚点坐标位置 { x, y }
 * - 可选监听依赖项 deps（如窗口大小、滚动、元素变动）
 *
 * @param ref - DOM 元素的 ref（必须是 HTMLElement）
 * @param deps - 依赖项数组（如窗口滚动/resize变化时触发重新计算）
 * @param offsetX - 水平方向偏移量（默认 8）
 * @param offsetY - 垂直方向偏移量（默认 8）
 * @returns { x: number; y: number } - 页面上的锚点位置
 */

/* 
用法示例：
import { useRef } from 'react';
import { useDomAnchorPosition } from '@/hooks/useDomAnchorPosition';

const MyComponent = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const anchorPos = useDomAnchorPosition(btnRef);

  return (
    <>
      <button ref={btnRef}>点击</button>
      {anchorPos && (
        <FloatingPopoverWrapper anchorPos={anchorPos}>
          <div>我是弹窗</div>
        </FloatingPopoverWrapper>
      )}
    </>
  );
};
 */
export function useDomAnchorPosition(
  ref: React.RefObject<HTMLElement>,
  deps: unknown[] = [],
  offsetX: number = 8,
  offsetY: number = 8
): { x: number; y: number } | null {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        setPosition({
          x: rect.left + scrollX + offsetX,
          y: rect.top + scrollY + offsetY,
        });
      }
    };

    updatePosition(); // 初始化时计算

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [ref, offsetX, offsetY, ...deps]);

  return position;
}
