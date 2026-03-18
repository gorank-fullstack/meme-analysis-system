// import React from 'react'
'use client';
import { IAddress } from '@/myLowdb';
import Link from 'next/link';
// import { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';

interface IAddresses {
    tradeAddress: IAddress[];
}

export function TokenTradeAddress({ tradeAddress }: IAddresses) {
    // const router = useRouter();
    /* const navigate = useNavigate();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // 确保只在客户端执行
    }, []); */
    // 动态跳转函数
    // const handleClick = (id: number, additionalParam: string) => {
    // const url = `/detail/${id}?extra=${additionalParam}`;
    /* const handleClick = (url: string) => {
        if (isClient) { // 确保只在客户端执行跳转
            //const url = `/detail/${id}?extra=${additionalParam}`;
            // router.push(url);
            navigate(url); // 使用 useNavigate 进行跳转
        }

    }; */
    return (
        <>
            <table className="table table-xs">
                <thead>
                    <tr>
                        <th>交易者</th>
                        <th>SOL余额/创建时间</th>
                        <th>资金来源/转账时间</th>
                        <th>总买入</th>
                        <th>总卖出 </th>

                        <th>总利润&nbsp;USD</th>
                        {/* <th>总卖出</th> */}
                        <th>已实现利润</th>
                        <th>未实现利润</th>
                        <th>持仓时长</th>
                        <th>平均买价/平均卖价</th>
                        <th>交易数</th>
                        <th>最近活跃</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        /* addressRes.data.list.map((item: IAddress) => ( */
                        tradeAddress.map((item: IAddress) => (
                            <tr key={item.aa} className='token-trade-address' 
                            /* onClick={() => handleClick(`http://localhost:3000/sol/address/${item.aa}`)} */
                            >
                                <th>{item.aa.slice(0, 5)}…{item.aa.slice(-3)}</th>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                    <div className='flex flex-col'>
                                        <div className="trx-td-top">{item.balance}</div>
                                        <div className="trx-td-bottom">{item.createTime}</div>
                                    </div>
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                    <div className='flex flex-col'>
                                        <div className="trx-td-top">{item.sourceOfFunds.slice(0, 5)}…{item.sourceOfFunds.slice(-3)}</div>
                                        <div className="trx-td-bottom">{item.transferTime}</div>
                                    </div>
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                        <div className='flex flex-col'>
                                            <div className="trx-td-top">${item.buyAmount}</div>
                                            <div className="trx-td-bottom">{item.buyQuantity}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                        <div className='flex flex-col'>
                                            <div className="trx-td-top">${item.sellAmount}</div>
                                            <div className="trx-td-bottom">{item.sellQuantity}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                        ${item.totalProfit}
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                        ${item.alreadyProfit}
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                        ${item.waitProfit}
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                        {item.holdingTime}
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                        <div className='flex flex-col'>
                                            <div className="trx-td-top">${item.avgBuyPrice}</div>
                                            <div className="trx-td-bottom">${item.avgSellPrice}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                        <div className='flex flex-row'>
                                            <div>{item.buyTimes}</div>
                                            <span>/</span>
                                            <div>{item.sellTimes}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td>
                                    <Link href={`http://localhost:3000/sol/address/${item.aa}`}>
                                        {item.lastTrxTime}&nbsp;以前
                                    </Link>
                                </td>
                                {/* <td>13</td> */}
                            </tr>
                        ))
                    }

                    {/* <tr className='font-normal hover:bg-[rgba(255,255,255,0.05)] cursor-pointer'>
                                            <th>2</th>
                                            <td>Hart Hagerty</td>
                                            <td>Desktop Support Technician</td>
                                            <td>Zemlak, Daniel and Leannon</td>
                                            <td>United States</td>
                                            <td>12/5/2020</td>

                                            <td>07</td>
                                            <td>08</td>
                                            <td>09</td>
                                            <td>10</td>
                                            <td>11</td>
                                            <td>12</td>
                                        </tr> */}

                </tbody>

            </table>
        </>
    )
}
