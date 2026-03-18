// import React from 'react'
import { IAddress } from '@/myLowdb';
import Image from "next/image";
import Link from 'next/link';

interface IAddresses {
  tradeAddress: IAddress[];
}
export default function AddressTradeToken({ tradeAddress }: IAddresses) {
  return (
    <>
      <table className="table table-xs ">
        <thead>
          <tr>
            <th></th>
            <th>最近活跃</th>
            <th>未实现利润</th>
            <th>已实现利润</th>
            <th>总利润</th>
            <th>余额&nbsp;USD</th>
            <th>持仓</th>
            <th>持仓时长</th>
            <th>总买入/平均买入价</th>
            <th>总卖出/平均卖出价</th>
            <th>30D交易擞</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {
            /* addressRes.data.list.map((item: IAddress) => ( */
            tradeAddress.map((item: IAddress) => (
              <tr key={item.ca} className='address-trade-token'>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox h-6 w-6 " />
                  </label>
                </th>
                <td>{/* 币种 */}
                  <Link href={`http://localhost:3000/sol/token/${item.ca}`}>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-[30px] w-[30px]">
                          <Image
                            unoptimized
                            width={30} height={30}
                            /* src={item.imageUrl} */

                            src={`https://dd.dexscreener.com/ds-data/tokens/solana/${item.ca}.png`}
                            /* alt={item.name} /> */
                            alt="a_name" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold">{item.ca.slice(0, 5)}…{item.ca.slice(-3)}</div>
                        <div className="opacity-50">{item.lastTrxTime}</div>
                      </div>
                    </div>
                  </Link>

                </td>
                <td>{/* 未实现利润 */}
                  {item.waitProfit}
                </td>
                <td>{/* 已实现利润 */}
                  {item.alreadyProfit}
                </td>
                <td>{/* 总利润 */}
                  {item.totalProfit}
                </td>
                <td>{/* 余额&nbsp;USD */}
                  12/16/2020
                </td>
                <td>{/* 持仓 */}
                  Blue
                </td>
                <td>{/* 持仓时长 */}
                  12/16/2020
                </td>
                <td>{/* 总买入/平均买入价 */}
                  9
                </td>
                <td>{/* 总卖出/平均卖出价 */}
                  10
                </td>
                <td>{/* 30D交易擞 */}
                  11
                </td>
                <td>{/* 操作 */}
                  12/16/2020
                </td>
              </tr>
            ))
          }

          {/* <tr>
                                    <th>2</th>
                                    <td>Hart Hagerty</td>
                                    <td>Desktop Support Technician</td>
                                    <td>Zemlak, Daniel and Leannon</td>
                                    <td>United States</td>
                                    <td>12/5/2020</td>
                                    <td>Purple</td>
                                    <td>Blue</td>
                                    <td>12/16/2020</td>
                                    <td>10</td>
                                    <td>11</td>
                                    <td>12/16/2020</td>
                                </tr> */}


        </tbody>

      </table>
    </>
  )
}
