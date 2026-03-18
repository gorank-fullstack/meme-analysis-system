import * as Popover from '@radix-ui/react-popover';
import { TChainName } from '@gr/interface-base';
import { StarFill } from "@/components/icons/operate/StarFill";
import { StarLine } from "@/components/icons/operate/StarLine";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState } from 'react';
import { TokenFavoriteRow } from "@/components/Radix/Favorite/TokenFavoriteRow/Page";
import { IFavoriteGroupItem } from "@/store/favorite/favoriteGroupSlice";
// import { PopoverPanel } from '@/components/Floating/PopoverPanel/Page';

interface Props {
  tokenAddress: string;
  chainName: TChainName;
  isFavorited: boolean;
  onManageGroup: () => void;
}

export function TokenFavoriteDialog({
  tokenAddress,
  chainName,
  isFavorited,
  onManageGroup,
}: Props) {
  const [open, setOpen] = useState(false);
  const groups: IFavoriteGroupItem[] = useSelector(
    (state: RootState) => state.favoriteGroup[chainName].groups
  );

  const selectedGroupIds = groups
    .filter((g) => g.tokenAddresses.includes(tokenAddress))
    .map((g) => g.group_id);

  const toggleGroup = (groupId: string, checked: boolean) => {
    console.log(`${checked ? '加入' : '移除'} 分组 ${groupId}`);
    // Redux dispatch 调用建议放这
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        {/* 外层容器，设置“定位锚点”，不影响布局 */}
        {/* <span className="inline-block relative"> */}
        {/* 向上偏移，实际按钮位置往上移一点 */}
        {/* <span className="absolute top-[-6px]"> */}
        <button className="text-yellow-400 hover:text-yellow-500">
          {isFavorited ? (
            <StarFill height={20} width={20} />
          ) : (
            <StarLine height={20} width={20} />
          )}
        </button>
        {/* </span> */}
        {/* </span> */}
      </Popover.Trigger>

      <Popover.Portal>

        <Popover.Content
          // {/* <PopoverPanel */}
          /* 
          side 箭头的方向--决定弹窗的 主方向（上下左右）.
          side可选值：top（上）、right（右）、bottom（下）、left（左）
          对于 side="right" 或 side="left"，垂直轴是 Y轴
          对于 side="top" 或 side="bottom"，垂直轴是 X轴
          
          align 磁铁的吸附边--决定弹窗在 箭头方向的垂直轴 上如何对齐触发器。
          align可选：start（起始边）、center（居中）、end（末尾边）。

          记忆技巧
            先看 side：确定弹窗是从哪个方向“长出来”的（上下左右）。
            再看 align：
            如果 side 是 上下 → align 管 左右。
            如果 side 是 左右 → align 管 上下。

          常见的设置组件：	side	align
            右上角（右侧 + 底部）	right	end
            右下角（右侧 + 顶部）	right	start
            正右侧（右侧 + 中间）	right	center
          */
          side="right"   // 主方向：右侧
          // align="start"    // 次级方向：对齐触发器底部（即弹窗偏下）
          align="start"    // 次级方向：对齐触发器底部（即弹窗偏下）
          sideOffset={8} // 水平间距（可选）
          alignOffset={8} // 垂直向下偏移（可选）
          // width="w-[320px]" // 你原来设置的宽度
          // className="flex justify-center w-[240px] rounded-md border-[2px] border-base-content/20  bg-base-100 shadow-lg z-[9999]"
          // className="group-dialog bg-base-200/90 border-base-300/90 text-primary-content"
          // className="gr-dialog-glass gr-animate-dialog-in"
          // className="gr-dialog-glass gr-animate-dialog-in"
          /* 
          详细解释：
            zoom-in-95 的效果是让元素从 95% 大小（scale(0.95)） 放大到 100% 大小（scale(1)），而透明度（opacity）的变化是由 fade-in 控制的。
            fade-in 负责 透明度从 0 → 1 的淡入效果。
            组合使用 zoom-in-95 + fade-in 时，元素会 同时 从小变大 并 从透明变不透明，形成更自然的弹窗动画。
           */
          className="gr-dialog-glass gr-animate-in gr-fade-in gr-zoom-in-85 !z-[70]"

          /* 
          修改1：添加：onInteractOutside
          Radix 的 Popover 会在点击“外部元素”时触发 onInteractOutside 事件，只要你在这个事件中调用了 e.preventDefault()，就可以阻止关闭 Popover 的行为。

          修改2:
          FavoriteGroupEditDialog 最外层加类名：favorite-group-edit-dialog
           */
          onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest('.favorite-group-edit-dialog')) {
              e.preventDefault(); // ✅ 阻止 Radix 自动关闭 Popover
            }
          }}


        // className="rounded-xl border border-base-content/10 bg-base-100 p-2 w-[180px] max-h-[280px] overflow-y-auto z-[9999] shadow-lg scrollbar-thin scrollbar-thumb-base-content/30 scrollbar-track-transparent"
        // className="rounded-md border border-base-content/20 bg-base-100 p-3 w-[180px] max-h-[280px] overflow-y-auto z-[9999] shadow-lg space-y-1 scrollbar-thin scrollbar-thumb-base-content/30 scrollbar-track-transparent animate-in fade-in zoom-in-95"
        // className="rounded-md border border-base-content/20 bg-base-100 p-3 w-[180px] max-h-[280px] overflow-y-auto z-[9999] shadow-lg space-y-1 scrollbar-thin scrollbar-thumb-base-content/30 scrollbar-track-transparent animate-in fade-in zoom-in-95"
        // className="rounded-md border border-base-content/20 bg-base-100 w-[180px] max-h-[280px] overflow-y-auto z-[9999] shadow-lg animate-in fade-in zoom-in-95"
        // className=""
        // 外层只管：边框 + 背景 + 阴影 + 圆角
        // className="flex items-center justify-center w-[320px]  border-[2px] border-gray-100  bg-base-100 shadow-lg z-[9999]"
        >
          <div
            // className="rounded-md border-40 border-base-content/20 bg-base-100 w-[180px] max-h-[280px] z-[9999] shadow-lg animate-in fade-in zoom-in-95 overflow-hidden"
            // className="w-[360px] h-[360px] rounded-xl border-[5px] border-[color:var(--tw-prose-invert-borders)] bg-base-100 shadow-lg z-[9999]"
            className=" border-red-500 w-[232px] !py-2 max-h-[320px] scrollbar-thin scrollbar-thumb-base-content/30 space-y-2"
          >
            {/* <div className="rounded-md border border-gray-700 bg-base-100 p-2 shadow-lg space-y-1"> */}
            {/* <div className="rounded-md bg-base-100 p-2 shadow-lg space-y-1"> */}
            {/* <div className="flex flex-col justify-between bg-base-200/30"> */}
            {/* ✅ 内部 padding 层，负责让内容不贴边 */}
            {/* <div className="p-2 space-y-2 bg-base-200/30"> */}
            {/* ✅ padding 专属层：控制内容不贴边 */}
            {/* <div className="p-6 space-y-2"> */}
            {/* 内边距层 */}
            {/* <div className="p-3 space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-base-content/30 scrollbar-track-transparent"> */}
            {/* ✅ 独立内边距层，防止内容贴边 */}
            {/* <div className="w-[10px] bg-gray-100"></div> */}
            {/* <div className="border-[1px] border-blue-500  w-[220px] max-h-[280px]  scrollbar-thin scrollbar-thumb-base-content/30 scrollbar-track-transparent"> */}
            {/* 分组列表 */}
            <div className="space-y-1">
              {groups.map((group) => (
                <TokenFavoriteRow
                  key={group.group_id}
                  chainName={chainName}
                  tokenAddress={tokenAddress}
                  group={group}
                  isChecked={selectedGroupIds.includes(group.group_id)}
                  onToggle={(checked) =>
                    toggleGroup(group.group_id, checked)
                  }
                />
              ))}
            </div>

            <div className="!my-2 !mx-2 border-t border-base-content/20" />
            <div className="!mx-2 !h-8">
              <button
                className="!py-2 w-full text-sm text-center text-base-content hover:bg-neutral/20 cursor-pointer select-none transition rounded"
                onClick={onManageGroup}
              >
                {/* <span className="material-symbols-outlined text-sm">tune</span> */}
                管理分组
              </button>
            </div>

            <Popover.Arrow width={220} className="fill-base-100" />
            {/* </div> */}
            {/* <div className="w-[220px]">
              
            </div> */}

            {/* <div className="w-[10px] bg-gray-100"></div> */}
          </div>
        </Popover.Content>
        {/* </PopoverPanel> */}
      </Popover.Portal>
    </Popover.Root>
  );
}
