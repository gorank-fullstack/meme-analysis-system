'use client';

/**
 * GroupCheckboxRow.tsx (样式优化版)
 *
 * ✅ 不改动任何逻辑控制，仅美化外观
 * ✅ checkbox 替换为“圆形 + 实心/空心视觉”
 * ✅ 行 hover 高亮，视觉参考竞品图1
 */

import { useDispatch } from 'react-redux';
// import { toast } from 'sonner';
import {
  toastSuccess,
  // toastError, 
  toastWarning
} from '@/utils/ui/toast';

import { AppDispatch } from '@/store';
import { TChainName } from '@gr/interface-base';
import { IFavoriteGroupItem } from '@/store/favorite/favoriteGroupSlice';
import {
  addTokenToGroupBidirectionally,
  removeTokenFromGroupBidirectionally,
} from '@/utils/favorite/favoriteTokenActions';

interface GroupCheckboxRowProps {
  chainName: TChainName;
  tokenAddress: string;
  group: IFavoriteGroupItem;
  isChecked: boolean;
  onToggle: (checked: boolean) => void;
}

export const TokenFavoriteRow = ({
  chainName,
  tokenAddress,
  group,
  isChecked,
  onToggle,
}: GroupCheckboxRowProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (checked: boolean) => {
    onToggle(checked);

    if (checked) {
      addTokenToGroupBidirectionally(dispatch, chainName, tokenAddress, group.group_id);
      // toast.success(`已收藏到分组【${group.name}】！`);
      /* toast.success("成功收藏", {
        className: "toast-success"
      }); */
      toastSuccess(`已收藏到分组-${group.name}`);
    } else {
      removeTokenFromGroupBidirectionally(dispatch, chainName, tokenAddress, group.group_id);
      // toast.warning(`已取消收藏【${group.name}】`);
      /* toast.error("已取消收藏", {
        className: "toast-error"
      }); */
      toastWarning(`已取消收藏-${group.name}`); // 比如取消收藏，不算错误，但要提示
    }
  };

  const groupColor = "base-content";
  // const borderColor = isChecked ? `border-${groupColor}` : "border-base-content/30";
  // const dotColor = isChecked ? `bg-${groupColor}` : "";

  return (
    <div className="h-8 flex items-center">
      <label
        // className="flex items-center justify-between hover:bg-gray-300 rounded-md cursor-pointer select-none transition"
        // className="flex items-center justify-between h-7 w-full hover:bg-base-200 cursor-pointer select-none transition"
        className="flex items-center justify-between h-7 w-full hover:bg-neutral/20 cursor-pointer select-none transition rounded"
        onClick={() => handleChange(!isChecked)}
      >

        <div className="!pl-3">
          {/* 分组名 */}
          <span className={`text-sm truncate text-${groupColor}`}>{group.name}</span>
        </div>
        {/* 自定义圆形选中框 */}
        <div className="!pr-3">
          {/* <div className="w-4 h-4 rounded-full border border-base-content flex items-center justify-center">
            {isChecked && <div className="w-2 h-2 rounded-full bg-base-content" />}
          </div> */}
          <div
            className={`w-4 h-4 rounded-full border ${isChecked ? `border-${groupColor}` : "border-base-content/30"
              } flex items-center justify-center`}
          >
            {isChecked && (
              <div className={`w-2 h-2 rounded-full bg-${groupColor}`} />
            )}
          </div>
        </div>
      </label>
    </div>
  );
};
