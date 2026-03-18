import { TChainName, TQtType } from "@gr/interface-base";
import { IGrTokenSortItem_Client } from "@gr/interface-api/uniform-data";
import { TrendingHeader } from "../TrendingHeader/Page";
import { TrendingRow } from "../TrendingRow/Page";
// import {getNestedValue_Old} from "@/unit/sort";
// import {getNestedValue_Old1_Del} from "@/unit/sort";
import { getNestedValue } from "@gr/interface-utils";
// import {
//   useAppSelector,
//   // useAppDispatch ,
// } from '@/store/hooks';
// import { daisyui_themes_min } from "@/utils/styles/daisyui/theme_min";
// import { TThemeColorScheme } from "@/config/theme_language_constants";
interface TrendingTableProps {
  chainName: TChainName;
  qtType: TQtType;
  // tokens: ISolSplTokenItem[]; 
  tokens: IGrTokenSortItem_Client[]; // 这里 Token[] 是数
  // tokens: TrendingToken[];
  loading: boolean;     // 是否显示加截中
  isFirstLoad: boolean; // 是否，首次加载
  sortField: string;
  sortOrder: 'asc' | 'desc'; // 可以更严格指定，只允许 'asc' 或 'desc'
  /** 排序控制：点击时，传入 排序字段 */
  onSortChange: (field: string) => void;

  /** 收藏对话框控制：打开时调用，传入 tokenAddress */
  // onOpenDialog: (tokenAddress: string) => void;
  /** 收藏点击：点击星星时触发，传入事件对象和 token 地址 */
  /* onFavoriteClick: (
    e: React.MouseEvent<HTMLElement>,
    tokenAddress: string
  ) => void; */

  /** 当前是否打开对话框 */
  // isDialogOpen: boolean;

  /** 当前对话框选中的 tokenAddress */
  // dialogTokenAddress: string | null;

  // 新增 ↓↓↓
  onManageGroup: () => void;

  /* 收藏的 Token Set */
  favoritedTokenSet: Set<string>;

}

export const TrendingTable = ({
  chainName,
  qtType,
  tokens,
  loading,
  isFirstLoad,
  sortField,
  sortOrder,
  onSortChange,

  // onOpenDialog,         //  加上：打开收藏对话框的回调
  // onFavoriteClick,      //  加上：收藏点击的回调
  // isDialogOpen,         //  当前是否打开对话框
  // dialogTokenAddress,   //  当前选中的 tokenAddress
  onManageGroup,      // ⬅️ 解构出这个参数
  favoritedTokenSet,    //  收藏的 Token Set
}: TrendingTableProps) => {
  console.log("TrendingTable received tokens:", tokens);
  console.log("Number of tokens:", tokens?.length || 0);

  // 确保 tokens 始终是数组
  const tokenArray = Array.isArray(tokens) ? tokens : [];

  // 排序处理
  const sortedTokens = [...tokenArray];

  /* if (sortField) {
    sortedTokens.sort((a, b) => {
      const aValue = getNestedValue_Only_Number(a, sortField);
      const bValue = getNestedValue_Only_Number(b, sortField);

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }//end if(sortField) */
  if (sortField) {
    sortedTokens.sort((a, b) => {
      const aValue = getNestedValue(a, sortField);
      const bValue = getNestedValue(b, sortField);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // fallback: 数字优先，其次字符串，最后默认值
      return 0;
    });
  }

  // 先读取 rtk store 中的【主题】
  // const reduxThemeName = useAppSelector((state) => state.theme.theme_name);            // 使用hook.ts写法

  //主题所属的：色系
  // const theme_color_scheme: TThemeColorScheme = daisyui_themes_min[reduxThemeName as keyof typeof daisyui_themes_min]["color-scheme"] as TThemeColorScheme;

  console.log("loading===", loading);

  return (
    <div className="flex-1 overflow-x-auto">
      <table className="w-full table">
        <TrendingHeader
          chainName={chainName}
          qtType={qtType}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
        />
        <tbody>
          {isFirstLoad && loading ? (
            <tr>
              <td
                colSpan={12}
                className="text-center py-8 text-dex-text-secondary"
              >
                Loading trending tokens...
              </td>
            </tr>
          ) : sortedTokens.length === 0 ? (
            <tr>
              <td
                colSpan={12}
                className="text-center py-8 text-dex-text-secondary"
              >
                No tokens found
              </td>
            </tr>
          ) : (
            sortedTokens.map((token, index) => (
              // <SplTrendingRow key={token.id ?? index} token={token} rank={index + 1} />
              <TrendingRow
                // key={token.ca ?? index}
                key={token.ca} // 确保 token.ca 是唯一的
                chainName={chainName}
                qtType={qtType}
                token={token}
                rank={index + 1}
                // theme_color_scheme={theme_color_scheme}

                // onOpenDialog={onOpenDialog} // ✅ 向子组件传递打开对话框的回调
                // onFavoriteClick={onFavoriteClick} // 👈 新增传参
                // isDialogOpen={isDialogOpen} // ✅ 当前是否弹窗打开
                // dialogTokenAddress={dialogTokenAddress} // ✅ 当前对话框对应的 token
                onManageGroup={onManageGroup} // 👈 正确传入
                favoritedTokenSet={favoritedTokenSet}
              />
            ))
          )}
        </tbody>
        {/* foot */}
        <tfoot>
          <tr className="h-4">
            <th></th>
            <td colSpan={16}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
