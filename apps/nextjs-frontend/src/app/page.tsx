// "use client"
import React from 'react'

// import { LOWDB_TABLE_NAME } from "@/config/web3_constants";
// import {next_net_access} from "@/config/next_api_constants";

// import HomeTradeHot from '@/components/Home/TradeHot/page';
// import PrintInfo from "@/components/PrintInfo/Page";
// import { useSearchParams } from 'next/navigation';

// import { useSearchParams } from 'next/navigation';
// import { IToken } from '@/myLowdb';

// import "@/css/base.css";
// import "@/app/globals.css";
import "@/app/css/index.css";
// import "@radix-ui/themes/styles.css";
// import '@/css/tailwind-safelist.css';
// import '@/utils/styles/tailwind/safelist'; // ⬅️ 只引入一次即可
import { TrendingPage } from '@/components/Trending/TrendingPage/Page';
import { PumpFunPage } from '@/components/Pump/PumpPage/Page';
// import { TTabType_Server } from "@gr/interface-api/uniform-data";
// import { TTabType_Client } from "@/interface/path";
import { isTChainName, isTQtType, isTTabTypeClient, TChainName, TQtType, TTabType_Client } from '@gr/interface-base';

/*  export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
   // 在这里编写获取数据的逻辑
   const initData:KLineData[] = []; // 示例数据
  
   // 返回props对象，它将被传递到组件的props中
   return {
     props: {
       initData,
     },
   };
 }; */
// getServerSideProps 获取数据
// export async function getServerSideProps(): Promise<GetServerSideProps<HomePageProps>> {
/* export async function getServerSideProps(): Promise<{ props: HomePageProps }> {
  try {
    // 示例数据
    const resToken: IToken[] = await getServer_ItemListNotSearch(LOWDB_TABLE_NAME.TOKEN, 1, 50);
    //  [
    //   { time: '2025-01-22 00:00', open: 100, close: 105, high: 110, low: 95 },
    //   { time: '2025-01-22 01:00', open: 105, close: 103, high: 107, low: 101 },
    // ]; 

    // 返回 props 对象，使用 initData
    return {
      props: {
        initData:resToken, // 使用 initData 作为返回的属性名
      },
    };
  } catch (error) {
    console.error("Hone-page()-> error:", error);

    // return []; // 或者返回一个默认值
    return {
      props: {
        initData:[], // 使用 initData 作为返回的属性名
      },
    };
  }
} */


/*   async function getData() {
    // const res = await fetch('https://api.example.com/data', { cache: 'no-store' }); // 使用 no-store 禁止缓存
    // 示例数据
    // const resToken: IToken[] = await getServer_ItemListNotSearch(LOWDB_TABLE_NAME.TOKEN, 1, 50);
    const res = await getServer_ItemListNotSearch(LOWDB_TABLE_NAME.TOKEN, 1, 50);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } */
// export default function Page({ initData }: HomePageProps) {
interface IPageProps {

  searchParams: Promise<{
    chain?: string; //查询参数 chain：通过 searchParams.chain 获取（可选）
    // tab?: TTabType; //查询参数 tab：通过 searchParams.tab 获取（可选）
    tab?: string; //查询参数 tab：通过 searchParams.tab 获取（可选）
    qt?: string; //查询参数 qt：通过 searchParams.qt 获取（可选）
    // searchParams: URLSearchParams;
  }>;
}
export default async function Page({ searchParams }: IPageProps) {
  // export default async function Page() {
  // export default async function Page() {

  // const defaultChainType = "eth";
  // const defaultChainType: TChainType = "bsc";
  // const defaultChainName: TChainName = "sol";
  // const defaultChainName: TChainName = "bsc";
  const defaultChainName: TChainName = "eth";
  // const defaultTabType = "trending_pools";
  const defaultTabType_Client: TTabType_Client = "hot";
  const defaultQtType: TQtType = "5m";
  // const defaultTabType = "new_pools";
  /* const searchParams = useSearchParams();
  let tabType = searchParams.get('tab') || "";
  let chainType = searchParams.get('chain') || defaultChainType; */

  let { chain: chainName, tab: tabType_Client, qt } = await searchParams;

  if (chainName === undefined) chainName = defaultChainName;       //没有 chainName参数时。默认是: solana链
  chainName=isTChainName(chainName) ? chainName : defaultChainName;

  if (tabType_Client === undefined) tabType_Client = defaultTabType_Client;
  // tabType_Client = isTTabTypeClient(tabType_Client) ? tabType_Client : defaultTabType_Client;
  tabType_Client = isTTabTypeClient(tabType_Client) ? tabType_Client : "pump";

  if (qt === undefined) qt = defaultQtType;
  const qtType: TQtType = isTQtType(qt) ? qt : defaultQtType;

  console.log('chainName->', chainName);
  console.log('tabType_Client->', tabType_Client);
  console.log('qtType->', qtType);
  // const data = await getServer_Mock_ItemListNotSearch(LOWDB_TABLE_NAME.TOKEN, 1, 50);

  // console.log('src-app-page()-getServer_ItemListNotSearch->', data);

  return (
    <>
      {/* {process.env.NEXT_PUBLIC_PRINT_INFO && (
        <div className="print-info-nav">
          <PrintInfo />
        </div>

      )} */}


      {/* 头部 */}
      {/* <Header /> */}
      {/* 主体 */}

      <div className="list-container flex flex-row">
        {/* <div className='w-full bg-slate-500 p-2 text-white text-lg font-bold'>币种列表</div> */}

        <div className="list-main">
          {/* <HomeTradeHot initData={data.data.list} /> */}
          {tabType_Client === "pump" ?
            (<PumpFunPage />) :
            (<TrendingPage
              chainName={chainName as TChainName}
              tabType_Client={tabType_Client as TTabType_Client}
              qtType={qtType}
            />)
          }
        </div>
      </div >

    </>
  )
}

// export default Page

