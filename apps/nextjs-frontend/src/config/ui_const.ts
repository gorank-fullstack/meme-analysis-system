/* 
附：结构分层图示（概念）

1000 TOAST
 950 TOOLTIP

 890 MODAL_CONTENT
 880 MODAL_BACKDROP

 860 DIALOG_CARD
 850 DIALOG_CONTAINER
 800 DIALOG_BACKDROP

 550 POPOVER

  40 FLOATING_BUTTON
  10 HEADER
   0 BASE

 */
export const Z_INDEX = {
    BASE: 0,                 // 默认层级（页面内容）
    HEADER: 10,              // 顶部导航栏
    FLOATING_BUTTON: 40,     // 右下角固定按钮

    // 🔹 非模态组件：不影响交互
    POPOVER: 550,            // 轻浮层（无遮罩）如收藏弹出分组、小提示框

    // 🔸 模态弹窗：有遮罩，需中断主界面交互
    DIALOG_BACKDROP: 800,    // Dialog 弹窗遮罩（深色半透明）
    DIALOG_CONTAINER: 850,   // Dialog 容器（可加动画缩放）
    DIALOG_CARD: 860,        // Dialog 主体内容卡片

    // 🔸 Modal 弹窗（更大、结构更复杂）
    MODAL_BACKDROP: 880,     // Modal 遮罩
    MODAL_CONTENT: 890,      // Modal 主体内容

    // 🔹 常驻提示
    TOOLTIP: 950,            // tooltip 永远在最顶层
    TOAST: 1000              // toast 通知提示栏（一般固定页面边缘）
};

export const OFFSET = {
    TOOLTIP: 8,          // 气泡提示与触发点距离
    POPOVER: 12,         // 轻浮层偏移
    DIALOG: 16,          // 弹窗内部内容边距
    TOAST: 24,           // 通知与页面边缘距离
};

export const DURATION = {
    // 速度级别使用场景广 → FAST/NORMAL/SLOW 留着没错。
    // 用于通用动画，如按钮 hover、tab 切换、表格行展开等
    FAST: 100,
    NORMAL: 200,
    SLOW: 300,

    // 组件级动画专用常量也非常有必要，提高视觉一致性和语义清晰度。
    // 特定组件用途（用于动画、浮层、遮罩）
    TOOLTIP_FADE_IN: 150,   //保持 tooltip 动画轻盈，推荐 150ms～200ms 范围
    OVERLAY_FADE: 150,      //用于遮罩透明渐变，150ms 比较平滑不突兀
    MODAL_APPEAR: 300,      //大弹窗动画时间稍长点，提升沉稳感
    TOAST_SLIDE_IN: 300,    //如果 toast 是滑入式，可以使用 300ms 一致化
};

