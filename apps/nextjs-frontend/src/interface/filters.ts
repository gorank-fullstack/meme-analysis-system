// 类型定义
export interface Option {
    value: string;
    label: string;
}

// 原先：/modals/FiltersModal/FilterCondition/Page.tsx 里的定义
export interface FilterItem {
    id: number;
    metric: string;
    timeFrame: string;
    operator: string;
    value: string;
}

// 原先：/modals/FiltersModal/FilterCondition/Page.tsx 里的定义
export interface FilterConditionProps {
    filter: FilterItem;
    metrics: Option[];
    timeFrames: Option[];
    operators: Option[];
    onUpdate: (field: keyof FilterItem, value: string) => void;
    onRemove: () => void;
}

// 原先：/modals/FiltersModal/SortBySelector/Page.tsx 里的定义
export interface SortBy {
    metric: string;
    timeFrame: string;
    type: "ASC" | "DESC";
}

// 原先：/modals/FiltersModal/SortBySelector/Page.tsx 里的定义
export interface SortBySelectorProps {
    sortBy: SortBy;
    metrics: Option[];
    timeFrames: Option[];
    onChange: (newSort: SortBy) => void;
}

// 原先：src/components/TrendingSpl/SplTrendingRow/Page.tsx 里的定义
export interface TrendingToken {
    id?: string;
    chainId: string;
    tokenAddress: string;
    name: string;
    symbol: string;
    logo?: string;
    decimals: number;
    usdPrice: number;
    createdAt: number;
    liquidityUsd: number;
    marketCap: number;
    lightning?: string;
    transactions?: Record<string, number>;
    totalVolume?: Record<string, number>;
    buyers?: Record<string, number>;
    sellers?: Record<string, number>;
    pricePercentChange?: Record<string, number>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // for nested access like token["transactions.24h"]
}
