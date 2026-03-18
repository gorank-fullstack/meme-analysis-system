import React from 'react'

interface TableHeaderProps {
    chainName: TChainName;
    qtType: TQtType;
    sortField: string;
    sortOrder: 'asc' | 'desc'; // 你可以根据实际需要调整，比如 string 也可以
    onSortChange: (field: string) => void;
}
import { renderFieldWithSortIcon } from "../../Table/RenderFieldWithSortIcon";
import { TooltipTh } from '../../../../nextjs_stop_code/components/Table/TooltipTh';
import { TChainName, TQtType } from '@gr/interface-base';
import { HoverTooltip } from '@/components/Radix/Hover/HoverTooltip/Page';
// import { UpDownLine } from '@/components/icons/sort/UpDownLine';


// import {Up2Fill} from '@/components/icons/sort/Up2Fill';
/* import {UpDownLine} from '@/components/icons/sort/UpDownLine'; */
export const TrendingHeader = ({ chainName, qtType, sortField, sortOrder, onSortChange }: TableHeaderProps) => {

    // const renderSortIcon = (column: string): JSX.Element | null => {
    /* const renderSortIcon_old = (column: string): React.ReactNode => {
        //显示--排序未激活
        if (sortField !== column) return (<div className="ml-1"><UpDownFill /></div>);
        //显示--升序/降序
        // return <span className="ml-1">{sortOrder === "asc" ? <UpFill/>: "↓"}</span>;
        return (
            <div className="ml-1 text-dex-text-primary">
                {sortOrder === "asc" ?
                    <UpFill fill="currentColor" /> : <DownFill fill="currentColor" />}
            </div>
        )
    }; */

    /* const render_FieldName_And_SortIcon = (sortField: string,sortOrder: 'asc' | 'desc',fieldShowName: string, column: string): React.ReactNode => {
        //显示--排序未激活
        if (sortField !== column) return (
            <div className="flex items-center gap-1">
                <div className="text-dex-text-secondary">{fieldShowName}</div>
                <div className="ml-1"><UpDownFill /></div>
            </div>
        );
        //显示--升序/降序
        // return <span className="ml-1">{sortOrder === "asc" ? <UpFill/>: "↓"}</span>;
        return (
            <div className="flex items-center gap-1">
                <div className="text-dex-text-primary">{fieldShowName}</div>
                <div className="ml-1 text-dex-text-primary">
                    {sortOrder === "asc" ?
                        <UpFill fill="currentColor" /> : <DownFill fill="currentColor" />}
                </div>
            </div>
        )
    }; */

    return (
        <thead>
            {/* <tr className="text-xs uppercase text-dex-text-secondary border-b border-dex-border"> */}
            <tr className="">
                <th className="">
                    <label>
                        <input type="checkbox" className="checkbox" />
                    </label>
                </th>
                <th className=""
                    colSpan={2}>
                    <div className="">
                        <div>币名</div>
                    </div>
                </th>
                {/* <th className="flex flex-row sticky top-0 px-4 py-3 text-left">
                    
                </th> */}
                <th
                    className=""
                    onClick={() => onSortChange("cmc")}
                >
                    {/* {render_FieldName_And_SortIcon("价格", "price")} */}
                    {renderFieldWithSortIcon(sortField, sortOrder, "市值/价格", "cmc")}
                </th>                
                <th
                    className=""
                    onClick={() => onSortChange("c_t_iso")}
                >

                    <HoverTooltip content="表示 token 的首次上链时间">
                        {/* <div>时间</div> {renderSortIcon("c_time")} */}
                        {/* {render_FieldName_And_SortIcon("时间", "c_time")} */}
                        {renderFieldWithSortIcon(sortField, sortOrder, "创建时间", `c_t_iso`)}
                    </HoverTooltip>
                </th>
                {/* <th
                    className="sticky top-0 px-4 py-3 text-left cursor-pointer"
                    title={`近 ${qtType} 内交易的总价值`}
                    onClick={() => onSortChange(`vol.${qtType}`)}
                >
                    
                    
                    {renderFieldWithSortIcon(sortField, sortOrder, "交易额", `vol.${qtType}`)}
                </th> */}
                <TooltipTh
                    sortField={sortField}
                    sortOrder={sortOrder}
                    field={`活跃成交额`}
                    sortKey={`lv_0_hot_vol.${qtType}`}
                    tooltip="近 24 小时内活跃的交易额"
                    onSortChange={onSortChange}
                />
                <th
                    className=""
                    onClick={() => onSortChange(`tranx.${qtType}.all_trader`)}
                >

                    {/* {render_FieldName_And_SortIcon("1h交易数", "tranx_1h.all_trader")} */}
                    {renderFieldWithSortIcon(sortField, sortOrder, `${qtType}交易数`, `tranx.${qtType}.all_trader`)}
                </th>
                <th
                    className=""
                    onClick={() => onSortChange(`tranx.${qtType}.ind_trader`)}
                >

                    {/* {render_FieldName_And_SortIcon("1h独立交易数", "tranx_1h.ind_trader")} */}
                    {renderFieldWithSortIcon(sortField, sortOrder, `${qtType}独立交易数`, `tranx.${qtType}.ind_trader`)}
                </th>                
                {/* Gpt:不能使用 token.price_change.24h 这种 点式直接访问（TS 会报错），
                    但 "price_change.24h" 作为字符串路径 是合法的，因为你是在字符串中动态传递路径，由函数处理。
                     */}
                <th
                    className=""
                    onClick={() => onSortChange("price_change.1h")}
                >

                    {/* {render_FieldName_And_SortIcon("1h", "price_change.1h")} */}
                    {renderFieldWithSortIcon(sortField, sortOrder, "1h", "price_change.1h")}
                </th>
                <th
                    className=""
                    // onClick={() => onSortChange("price_change['24h']")}

                    onClick={() => onSortChange("price_change.24h")}
                >

                    {/* {render_FieldName_And_SortIcon("24h", "price_change['24h']")} */}

                    {/* {render_FieldName_And_SortIcon("24h", "price_change.24h")} */}
                    {renderFieldWithSortIcon(sortField, sortOrder, "24h", "price_change.24h")}
                </th>



                <th
                    className=""
                    /* className="flex items-center" */
                    /* onClick={() => onSortChange("liquidityUsd")} */
                    onClick={() => onSortChange("holders.total")}
                >


                    {/* {render_FieldName_And_SortIcon("持有者", "holders.total")} */}
                    {renderFieldWithSortIcon(sortField, sortOrder, "持有者", "holders.total")}
                </th>
                <th className=""
                    colSpan={4}>
                    <div className="flex items-center gap-1">
                        <div>安全检测</div>
                    </div>
                </th>
                {chainName !== "sol" && (
                    <th className="">
                        <div className="flex items-center gap-1">
                            <div>买/卖税</div>
                        </div>
                    </th>
                )}
                <th
                    className=""
                    onClick={() => onSortChange("marketCap")}
                >
                    {/* Mcap {renderSortIcon("marketCap")} */}
                    <div className="flex items-center gap-1">
                        <div>Dev</div>
                    </div>
                </th>
            </tr>
        </thead >
    );
};