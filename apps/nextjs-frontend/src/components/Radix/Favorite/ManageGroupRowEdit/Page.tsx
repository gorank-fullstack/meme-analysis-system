// src/components/Radix/Favorite/ManageGroupRowEdit/Page.tsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { renameGroup, IFavoriteGroupItem } from '@/store/favorite/favoriteGroupSlice';
import { toastSuccess, toastWarning } from '@/utils/ui/toast';
import { TChainName } from '@gr/interface-base';

interface Props {
    chainName: TChainName;
    group: IFavoriteGroupItem;
    groups: readonly IFavoriteGroupItem[];
    onClose: () => void;
}

export const ManageGroupRowEdit = ({ chainName, group, groups, onClose }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [tempName, setTempName] = useState(group.name);

    const handleRename = () => {
        const newName = tempName.trim();

        // 1. 名称为空直接返回
        if (!newName) return;

        // 2. 如果和原名一样，不做任何处理
        if (newName === group.name) {
            onClose();
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

        // 4. 派发修改
        dispatch(renameGroup({ chainName, group_id: group.group_id, newName }));
        toastSuccess(`该分组已重命名为 "${newName}"`);

        // 5. 退出编辑模式
        onClose();
    };

    return (
        <div className="flex flex-col gap-3">
            <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="分组名称"
                className="input input-bordered input-sm w-full"
            />
            <button onClick={handleRename} className="btn btn-sm btn-primary">
                确认修改
            </button>
        </div>
    );
};
