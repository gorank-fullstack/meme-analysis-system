/**
 * 获取 DOM 元素的屏幕坐标位置（用于弹窗定位）
 * 
 * 实现说明：
 * - 使用 e.currentTarget 获取事件目标 DOM 元素
 * - 利用 getBoundingClientRect() 获取该元素相对于视口的位置
 * - 加上 window.scrollX / scrollY，得到相对于页面的准确位置（避免滚动错位）
 * - 可选偏移量（此处为右下 8px），用于弹出层的微调显示
 *
 * 注意事项：
 * - 必须处理 currentTarget 为空的情况，避免抛出异常
 * - 本方法适用于点击按钮等 DOM 元素后弹出浮动框场景
 */

// 不带偏移量
export function getDomAnchorPosition_Origin(
    e: MouseEvent | React.MouseEvent
): { x: number; y: number } {
    // 获取鼠标点击事件绑定的 DOM 元素
    // 推荐做法：加上类型断言保护
    // 有些 e.currentTarget 会为空或类型不匹配，建议安全写法如下
    const target = e.currentTarget as HTMLElement | null;
    if (!target) return { x: 0, y: 0 };

    // getBoundingClientRect() 是 相对于视口（viewport）【不是相对于父级 DOM 的坐标】，不包含页面滚动
    const rect = target.getBoundingClientRect();

    
    // 若：页面出现滚动.用getBoundingClientRect()获取就会错位.
    /* return {
        x: rect.left + 8, // 向右偏移 8px
        y: rect.top + 8,  // 向下偏移 8px
    }; */
    // 滚动错位解决方法：加上 window.scrollX 和 window.scrollY 来补足页面滚动距离    
    console.log('pos_x:', rect.left + window.scrollX);
    console.log('pos_y:', rect.top + window.scrollY);
    return {
        // x: rect.left + window.scrollX + 8, // 向右偏移 8px
        x: rect.left + window.scrollX, // 偏移量，由外部的调用决定。不在此函数作偏移
        // y: rect.top + window.scrollY + 8,  // 向下偏移 8px
        y: rect.top + window.scrollY , // 偏移量，由外部的调用决定。不在此函数作偏移
    };
}

// 带偏移量
export function getDomAnchorPosition_Offset(
    e: MouseEvent | React.MouseEvent,
    offsetX: number = 0,
    offsetY: number = 0,
): { x: number; y: number } {
    // 获取鼠标点击事件绑定的 DOM 元素
    // 推荐做法：加上类型断言保护
    // 有些 e.currentTarget 会为空或类型不匹配，建议安全写法如下
    const target = e.currentTarget as HTMLElement | null;
    if (!target) return { x: 0, y: 0 };

    // getBoundingClientRect() 是 相对于视口（viewport）【不是相对于父级 DOM 的坐标】，不包含页面滚动
    const rect = target.getBoundingClientRect();

    // 滚动错位解决方法：加上 window.scrollX 和 window.scrollY 来补足页面滚动距离    
    console.log('pos_x:', rect.left + window.scrollX);
    console.log('pos_y:', rect.top + window.scrollY);
    
    return {
        x: rect.left + window.scrollX + offsetX,
        y: rect.top + window.scrollY + offsetY,
    };
}