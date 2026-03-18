'use client';
import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import {TChainName } from '@gr/interface-base';
import {
  IFavoriteGroupItem,
  // renameGroup,
  // 删除收藏分组时，会弹出对话框：确认，取消。所以提级到ManageGroupDialog实现
  // deleteGroup,
  reorderGroup,
} from '@/store/favorite/favoriteGroupSlice';

import { HoverTooltip } from '@/components/Radix/Hover/HoverTooltip/Page';
import { ManageGroupRowEdit } from '../ManageGroupRowEdit/Page';

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
  // 未拆分出：ManageGroupRowEdit前，才需要用到：isEditing、tempName
  // const [isEditing, setIsEditing] = useState(false);
  // const [tempName, setTempName] = useState(group.name);

  // 拆分出：ManageGroupRowEdit后，需要用到：showEditPopover
  const [showEditPopover, setShowEditPopover] = useState(false);

  // 执行分组名称修改－－无重名检测的版本
  // const handleRename = () => {
  //   const newName = tempName.trim();
  //   if (newName.length > 0 && newName !== group.name) {
  //     dispatch(renameGroup({ chainType, group_id: group.group_id, newName }));
  //   }
  //   // 退出编辑模式
  //   setIsEditing(false);
  // };
  


  // 将分组上移
  const handleMoveUp = () => {
    dispatch(reorderGroup({ chainName, group_id: group.group_id }));
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg mb-4 flex justify-between items-center shadow-sm border border-base-300">
      {/* 左侧：名称 + 数量 */}
      <div className="flex flex-col">
        <p className="text-base font-semibold">{group.name}</p>
        <p className="text-sm text-gray-400">{group.tokenAddresses.length} 个代币</p>
      </div>

      {/* 右侧：按钮组 */}
      <div className="flex items-center gap-x-4 text-white">
        {/* 上移 */}
        <HoverTooltip content="移至顶部">
          <button
            disabled={isFirst}
            onClick={handleMoveUp}
            aria-label="上移"
            className="hover:text-primary disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </HoverTooltip>

        {/* 编辑 */}
        {/* <Popover.Root open={isEditing} onOpenChange={setIsEditing}> */}
        <Popover.Root open={showEditPopover} onOpenChange={setShowEditPopover}>
          <Popover.Trigger asChild>
            <HoverTooltip content="编辑">
              <button aria-label="编辑" className="hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 13.5V19h5.5l10.036-10.036a1.5 1.5 0 00-2.122-2.122L4 13.5z" />
                </svg>
              </button>
            </HoverTooltip>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              side="top"
              align="end"
              sideOffset={8}
              // className="z-150 bg-base-100 border shadow-md rounded-xl p-4 w-[240px]"
              className="z-[120] bg-base-100 border shadow-lg rounded-xl p-4 w-[240px] focus:outline-none"
            >
              <ManageGroupRowEdit
                chainName={chainName}
                group={group}
                groups={groups}
                onClose={() => setShowEditPopover(false)}
              />
              <Popover.Arrow className="fill-base-100" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        {/* <HoverTooltip content="编辑">
          <button
            // 未拆分出：ManageGroupRowEdit前，才需要用到：onClick={() => setIsEditing(true)}
            // onClick={() => setIsEditing(true)}
            // 拆分出：ManageGroupRowEdit后，用：onClick={() => setShowEditPopover(true)}控制弹出层
            onClick={() => setShowEditPopover(true)}
            aria-label="编辑"
            className="hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 13.5V19h5.5l10.036-10.036a1.5 1.5 0 00-2.122-2.122L4 13.5z" />
            </svg>
          </button>
        </HoverTooltip> */}

        {/* 删除 */}
        <HoverTooltip content="删除">
          <button
            onClick={onRequestDelete}
            aria-label="删除"
            className="hover:text-error"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
            </svg>
          </button>
        </HoverTooltip>
      </div>      
    </div>
  );
};
