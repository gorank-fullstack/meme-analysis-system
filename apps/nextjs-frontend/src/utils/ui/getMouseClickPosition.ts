/**
 * 获取鼠标点击位置（适用于浮窗、气泡跟随鼠标点击点的场景）
 *
 * 功能说明：
 * - 本函数用于获取用户点击页面任意位置时，鼠标在整个页面中的坐标（包含页面滚动偏移）
 * - 与 getDomAnchorPosition 不同，本函数不依赖触发事件的 DOM 元素位置，而是直接取鼠标点击位置
 * - 常用于点击触发某组件浮出时，将浮出框定位在鼠标点击位置附近
 *
 * 使用场景：
 * - 右键菜单（context menu）
 * - 弹窗跟随鼠标点击（非按钮锚点）
 * - 任意区域点击弹出 tooltip、popover 等浮动组件
 *
 * 参数：
 * - e: 鼠标事件（支持原生 MouseEvent 和 React.MouseEvent）
 * - offsetX, offsetY: 相对偏移量（默认 0，可用于微调浮出框位置）
 *
 * 返回值：
 * - { x, y }: 鼠标点击点在整个页面中的绝对坐标
 */
export function getMouseClickPosition(
  e: MouseEvent | React.MouseEvent,
  offsetX = 0,
  offsetY = 0
): { x: number; y: number } {
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  return {
    x: e.clientX + scrollX + offsetX,
    y: e.clientY + scrollY + offsetY,
  };
}

export function adjustAnchorPositionIfOutOfViewport(
  pos: { x: number; y: number },
  dialogWidth: number,
  dialogHeight: number
): { x: number; y: number } {
  // 获取视口尺寸
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 将视口边界转换为文档坐标（考虑页面滚动）
  const maxX = window.scrollX + viewportWidth;
  const maxY = window.scrollY + viewportHeight;

  let x = pos.x;
  let y = pos.y;

  // 如果超出右边（文档坐标比较）
  if (x + dialogWidth > maxX) {
      x = maxX - dialogWidth - 10; // 右边保留 10px 边距
  }

  // 如果超出下边（文档坐标比较）
  if (y + dialogHeight > maxY) {
      y = maxY - dialogHeight - 10;
  }

  // 防止太靠左/上（文档坐标比较）
  if (x < window.scrollX + 10) x = window.scrollX + 10;
  if (y < window.scrollY + 10) y = window.scrollY + 10;

  return { x, y };
}