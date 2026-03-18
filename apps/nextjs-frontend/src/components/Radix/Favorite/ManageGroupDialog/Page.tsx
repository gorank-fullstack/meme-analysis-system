'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { motion } from "framer-motion";

import { TChainName } from '@gr/interface-base';
import { AppDispatch, RootState } from '@/store';
import {
  IFavoriteGroupItem,
  createGroup,
  /* renameGroup,
  deleteGroup,
  reorderGroup, */
} from '@/store/favorite/favoriteGroupSlice';
import { ManageGroupRow } from '@/components/Radix/Favorite/ManageGroupRow/Page';

// 分组的删除，需提级到： FavoriteGroupManagerDialog中，因为需要：删除之前：确人，或取消。
import { ConfirmDialog } from '@/components/Common/ConfirmDialog/Page';
import { deleteGroup } from '@/store/favorite/favoriteGroupSlice';
import {
  toastSuccess,
  // toastError, 
  toastWarning
} from '@/utils/ui/toast';
import { CloseLine } from '@/components/icons/operate/CloseLine';
interface FavoriteGroupManagerDialogProps {
  chainName: TChainName;
  isOpen: boolean;
  onClose: () => void;
}

export function ManageGroupDialog({ chainName, isOpen, onClose }: FavoriteGroupManagerDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const groups: IFavoriteGroupItem[] = useSelector(
    (state: RootState) => state.favoriteGroup[chainName]?.groups || []
  );
  const [newGroupName, setNewGroupName] = useState('');
  const [groupToDelete, setGroupToDelete] = useState<IFavoriteGroupItem | null>(null);

  // 新建分组名－－无重名检测的版本
  /* const handleCreateGroup = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) return;
    dispatch(createGroup({ chainType, name: trimmed, user_id: 'guest' }));
    setNewGroupName('');
  }; */
  const handleCreateGroup = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) return;

    // 检查是否与现有分组重名（忽略前后空格 + 完全匹配）
    const exists = groups.some(group => group.name === trimmed);
    if (exists) {
      // toast.warning('该分组名称已被使用');
      toastWarning(`该分组名称已被使用`);
      return;
    }

    dispatch(createGroup({ chainName, name: trimmed, user_id: 'guest' }));
    toastSuccess(`已创建"${trimmed}"分组`);

    setNewGroupName('');
  };


  if (!isOpen) return null;

  return (
    <>
      {/* ⚠️ 透明遮罩 + 鼠标阻挡罩，捕捉点击关闭 */}
      <div
        className="fixed inset-0 z-[89] bg-transparent pointer-events-auto favorite-group-edit-dialog"
      // onClick={onClose}--会导致点击遮罩层也会关闭弹窗
      // 这层只是背景，不可点击
      // onClick={onClose}
      >
      </div>
      {/* <div className="bg-base-100 p-6 rounded-xl shadow-lg w-[480px] max-h-[90vh] overflow-y-auto"> */}

      {/* 🧱 你的弹窗主体 */}
      <motion.div
        // className="bg-base-100 p-6 rounded-xl shadow-lg w-[480px] max-h-[90vh] overflow-y-auto z-[91]"
        className="fixed inset-0 z-[90] bg-black/65 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
      >
        {/* 弹窗卡片内容，视觉最高--同时：阻止点击穿透 */}
        <div
          // className="relative bg-base-100 p-6 rounded-xl shadow-xl w-[480px] max-h-[90vh] overflow-y-auto z-[91]"
          className="relative bg-base-100 p-6 rounded-xl shadow-xl w-[480px] max-h-[90vh] z-[91]"
        // 不再阻止传播了，因为根本没 onClick on backdrop
        // onClick={(e) => e.stopPropagation()}  // 阻止点击：穿透到遮罩层
        >
          {/* 🔒 右上角关闭按钮--放卡片内 */}
          <button
            className="absolute top-3 right-3 p-1 rounded hover:bg-base-200"
            onClick={onClose}
            aria-label="关闭"
          >
            <CloseLine className="w-4 h-4" />
          </button>
          {/* ✅ 卡片内容 */}
          <h2 className="text-lg font-bold mb-4">管理分组</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="输入分组名称"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim()}>
              创建
            </button>
          </div>

          {groups.map((group, index) => (
            <ManageGroupRow
              key={group.group_id}
              chainName={chainName}
              group={group}
              groups={groups} //用于：要修改的分组名，重复检测
              isFirst={index === 0}
              onRequestDelete={() => setGroupToDelete(group)} // 👈 增加 onRequestDelete 回调
            />
          ))}

          <ConfirmDialog
            isOpen={!!groupToDelete}
            title="删除分组"
            description="你确认删除所选分组吗？此操作无法撤销"
            confirmText="删除"
            cancelText="取消"
            onConfirm={() => {
              if (groupToDelete) {
                dispatch(deleteGroup({
                  chainName: chainName,
                  group_id: groupToDelete.group_id,
                }));
              }
              setGroupToDelete(null);
            }}
            onCancel={() => setGroupToDelete(null)}
          />
        </div>

      </motion.div>
    </>

  );
}
