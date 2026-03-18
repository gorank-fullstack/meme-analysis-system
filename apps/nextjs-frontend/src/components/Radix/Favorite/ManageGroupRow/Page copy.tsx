'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { TChainName } from '@gr/interface-base';
import {
  IFavoriteGroupItem,
  renameGroup,
  // 删除收藏分组时，会弹出对话框：确认，取消。所以提级到ManageGroupDialog实现
  // deleteGroup,
  reorderGroup,
} from '@/store/favorite/favoriteGroupSlice';
import {
  toastSuccess,
  // toastError, 
  toastWarning
} from '@/utils/ui/toast';

interface GroupEditRowProps {
  chainName: TChainName;
  group: IFavoriteGroupItem;
  groups: readonly IFavoriteGroupItem[];  // 用于：检测要修改的分组名，是否与原有分组名重复
  isFirst: boolean;
  onRequestDelete: () => void;
}
export const ManageGroupRow = (props: Readonly<GroupEditRowProps>) => {
  const { chainName, group, groups, isFirst, onRequestDelete } = props;

  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(group.name);

  // 执行分组名称修改－－无重名检测的版本
  // const handleRename = () => {
  //   const newName = tempName.trim();
  //   if (newName.length > 0 && newName !== group.name) {
  //     dispatch(renameGroup({ chainType, group_id: group.group_id, newName }));
  //   }
  //   // 退出编辑模式
  //   setIsEditing(false);
  // };
  const handleRename = () => {
    const newName = tempName.trim();

    // 1. 名称为空直接返回
    if (!newName) return;

    // 2. 如果和原名一样，不做任何处理
    if (newName === group.name) {
      setIsEditing(false);
      return;
    }

    // 3. 重名检测（排除自身）
    const exists = groups.some(
      g => g.group_id !== group.group_id && g.name === newName
    );
    if (exists) {
      toastWarning(`该分组名称已被使用`);
      return;
    }

    //3-１.假设插入
    // groups.push(group);
    // chainType="sol";

    // 4. 派发修改
    dispatch(renameGroup({ chainName, group_id: group.group_id, newName }));
    toastSuccess(`该分组已重命名为 "${newName}"`);

    // 5. 退出编辑模式
    setIsEditing(false);
  };


  // 将分组上移
  const handleMoveUp = () => {
    dispatch(reorderGroup({ chainName, group_id: group.group_id }));
  };

  return (
    <div className="bg-base-200 p-3 rounded-xl mb-3 flex justify-between items-center">
      <div className="flex flex-col">
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <input
              className="input input-sm input-bordered"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <button className="btn btn-xs btn-success" onClick={handleRename}>保存</button>
            <button className="btn btn-xs btn-ghost" onClick={() => setIsEditing(false)}>取消</button>
          </div>
        ) : (
          <>
            <p className="font-semibold">{group.name}</p>
            <p className="text-xs text-gray-500">{group.tokenAddresses.length} 个代币</p>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-2 text-gray-400">
          {/* 上移 */}
          <button
            disabled={isFirst}
            onClick={handleMoveUp}
            aria-label="上移"
            className="hover:text-white disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* 编辑 */}
          <button onClick={() => setIsEditing(true)} aria-label="编辑" className="hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 13.5V19h5.5l10.036-10.036a1.5 1.5 0 00-2.122-2.122L4 13.5z" />
            </svg>
          </button>

          {/* 删除 */}
          {/* <button onClick={handleDelete} aria-label="删除" className="hover:text-red-500"> */}
          <button onClick={onRequestDelete} aria-label="删除">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
            </svg>
          </button>
        </div>
                
      )}
    </div>
  );
};
