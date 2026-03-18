'use client';

import { ReactNode } from 'react';

/* 

特性总览
属性	类型	说明
isOpen	boolean	是否显示弹窗
title	string	弹窗标题（默认：操作确认）
description	string | ReactNode	描述说明
confirmText	string	确认按钮文本（默认：确认）
cancelText	string	取消按钮文本（默认：取消）
onConfirm	() => void	点击确认执行逻辑
onCancel	() => void	点击取消或遮罩关闭逻辑
zIndex	number	弹窗层级（默认 100，可自定义）

后续扩展建议
 加入 icon 参数支持危险/成功/信息图标切换
 支持 loading 状态（确认中禁用按钮）
 支持 autoClose、ESC 快捷键关闭等 UX 优化

这组件今后你遇到：
删除收藏分组 / Token / 标签
清空缓存 / 重置配置
发起交易前二次确认
都可以复用。

 */
/* 
使用方式示例：

import { ConfirmDialog } from '@/components/Shared/ConfirmDialog';

const [showConfirm, setShowConfirm] = useState(false);

<ConfirmDialog
  isOpen={showConfirm}
  title="删除分组"
  description="你确认删除所选分组吗？此操作无法撤销"
  confirmText="删除"
  cancelText="取消"
  onConfirm={() => {
    dispatch(deleteGroup({ chainType, group_id }));
    setShowConfirm(false);
  }}
  onCancel={() => setShowConfirm(false)}
/>

 */
interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  zIndex?: number;
}

export function ConfirmDialog({
  isOpen,
  title = '操作确认',
  description = '你确定要执行该操作吗？',
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  zIndex = 100,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      style={{ zIndex }}
      onClick={onCancel} // 点击遮罩关闭
    >
      <div
        className="bg-base-100 p-6 rounded-xl shadow-xl w-[400px] relative"
        onClick={(e) => e.stopPropagation()} // 阻止冒泡
      >
        {/* 标题 */}
        <h3 className="font-semibold text-lg mb-2 text-warning">
          ⚠️ {title}
        </h3>

        {/* 描述 */}
        <div className="text-sm mb-4 text-gray-300">
          {description}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-2">
          <button className="btn btn-sm btn-outline" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-sm btn-error" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
