'use client';
import Image from "next/image";
// import { IMoEvmTokenPair } from "@/interface/mo_evm";
import { IMoEvmTokenPair } from "@gr/interface-api/platform-data";
import { useEffect, useRef, useState } from "react";
import { 
    useAppSelector, 
    // useAppDispatch ,
} from '@/store/hooks';
// import { daisyui_themes } from "@/unit/daisyui_themes_old";
import {daisyui_themes_mid} from "@/utils/styles/daisyui/theme_mid";
import { remoteImage } from "@/utils/remote_image";

// import dynamic from 'next/dynamic';
// 假设你在组件作用域中定义了这些常量
const PRICE_CHART_ID = "evm-widget-container";
const scriptId = "tv-chart-widget";
const chainNameKey = "0x1";

type ThemeLimit = "moralis" | "dark" | "light" | "lemonade";
// const themeCurrent: ThemeLimit = "dark";
// const themeCurrent: ThemeLimit = "light";
const themeCurrent: ThemeLimit = "moralis"; //选moralis，是客户定制

const TV_CHART_URL = process.env.NEXT_PUBLIC_TV_CHART_URL;
// moralis

// 支持的时间周期类型
/* type TimeFrame = "5m" | "15m" | "1h" | "4h" | "1d";
const timeframeMap: Record<TimeFrame, string> = {
    "5m": "5",
    "15m": "15",
    "1h": "60",
    "4h": "240",
    "1d": "1D",
}; */
//只能取api文档：https://docs.moralis.com/web3-data-api/solana/reference/price/get-ohlcv-by-pair-address
// 支持的时间范围．
type TimeFrame = "1m" | "5m" | "10m" | "30m" | "1h" | "4h" | "12h" | "1d" | "1w" | "1M";
const timeframeMap: Record<TimeFrame, string> = {
    "1m": "1",
    "5m": "5",
    "10m": "10",
    "30m": "30",
    "1h": "60",
    "4h": "240",
    "12h": "720",
    "1d": "1D",
    "1w": "1W",
    "1M": "1M",
};

// props 类型定义
interface IMoEvmTokenChartProps {
    //   pair: string;
    tokenPair: IMoEvmTokenPair;
    timeFrame: TimeFrame;
    // onTimeFrameChange: (timeframe: TimeFrame) => void;
}

interface Size {
    width: number;
    height: number;
}

interface IChartWidget {
    theme: string,

    backgroundColor?: string,// '#071321',
    gridColor?: string,// '#0d2035',
    textColor?: string,// '#68738D',
    candleUpColor?: string,// '#4CE666',
    candleDownColor?: string,// '#E64C4C',

    // gridColor: '#0d2035',
    tooltipBackgroundColor?: string,// "#171D2E",
    holdersChartBackgroundColor?: string,
    holdersBackgroundColor?: string,
    // toolbarBackgroundColor?: string,// "#171D2E",

}



//-------------------------------------------


// 添加到 window 的声明（避免 TypeScript 报错）
/* declare global {
    interface Window {
        createMyWidget?: (
            containerId: string,
            options: Record<string, any>
        ) => void;
    }
}

// 声明 window 上的 destroyMyWidget 方法
declare global {
    interface Window {
        destroyMyWidget?: (containerId: string) => void;
    }
} */
// 合并后的写法
declare global {
    interface Window {
        // 添加到 window 的声明（避免 TypeScript 报错）
        createMyWidget?: (
            containerId: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options: Record<string, any>
        ) => void;
        // 声明 window 上的 destroyMyWidget 方法
        destroyMyWidget?: (containerId: string) => void;
    }
}


// 组件使用箭头函数定义 + 明确 props 类型
// export const EvmTokenChart = ({ tokenPair, timeFrame }: IMoEvmTokenChartProps) => {
export const EvmTokenChart = ({ tokenPair, timeFrame }: IMoEvmTokenChartProps) => {
    // const [priceType, setPriceType] = useState<"price" | "volume">("price");
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartInitialized = useRef(false); // 用于避免多次初始化
    // const [containerRef, size] = useContainerSize();
    // const [containerRef, size] = useContainerSize<HTMLDivElement>();
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    // 先读取 rtk store 中的【主题】
    const reduxThemeName = useAppSelector((state) => state.theme.theme_name);            // 使用hook.ts写法
    const daisyui_themes_obj=daisyui_themes_mid[reduxThemeName as keyof typeof daisyui_themes_mid];

    const themeColorScheme = daisyui_themes_obj["color-scheme"];
    let themeBase100= daisyui_themes_obj["base-100"];
    
    if(reduxThemeName==='dark'){
        themeBase100="oklch(0% 0 0)";
    }
    // useAppSelector((state) => state.theme.theme_series);            // 使用hook.ts写法



    // 获取适用于图表组件的 chainId 格式
    
    /* const resizeWidget = (newWidth: number, newHeight: number) => {
        if (typeof window.destroyMyWidget === 'function') {
            window.destroyMyWidget(PRICE_CHART_ID);
        }

        if (typeof window.createMyWidget === "function") {
            window.createMyWidget(PRICE_CHART_ID, {
                width: newWidth,
                height: newHeight,
            });
        }
    }; */
    const loadWidget = (
        // pair: TokenPair,
        tokenPair: IMoEvmTokenPair,
        timeFrame: TimeFrame,
        themeName: ThemeLimit,
        width_px: string = "0px",
        height_px: string = "0px",
        // getChartChainId: () => string
    ) => {
        if (typeof window.createMyWidget === "function") {
            const myWidget: IChartWidget = {
                theme: themeName,
            }
            if (themeName === "moralis") {


                // myWidget.backgroundColor = "#071321";　//原始
                // myWidget.backgroundColor = "#0f1018";//dark
                // myWidget.backgroundColor = "#0F172A";//night
                // myWidget.backgroundColor = "oklch(98.71% 0.02 123.72)";//lemonade
                myWidget.backgroundColor = themeBase100;//lemonade
                // myWidget.backgroundColor = "rgba(255, 255, 255, 0)";//lemonade
                // myWidget.holdersChartBackgroundColor = "oklch(98.71% 0.02 123.72)";//
                // myWidget.holdersBackgroundColor = "oklch(98.71% 0.02 123.72)";//不启作用

                // myWidget.tooltipBackgroundColor = "oklch(98.71% 0.02 123.72)";//lemonade
                // myWidget.gridColor = "#0d2035";//原始
                // myWidget.gridColor = "oklch(77.75% 0.196 111.09)";//lemonade secondary
                // myWidget.gridColor = daisyui_themes[reduxTheme as keyof typeof daisyui_themes]["neutral"];//

                // 【注意：不给myWidget.gridColor赋值，系统会用线蓝色网格。想要完全去掉网格，需要设置："rgba(255, 255, 255, 0)"】
                myWidget.gridColor = "rgba(255, 255, 255, 0)";//不显示网格的做法

                // myWidget.gridColor = "oklch(30.98% 0.075 108.6)";//lemonade neutral

                // myWidget.gridColor = "rgba(0, 0, 0, 0.15)";
                // myWidget.textColor = "#68738D";//原始
                // myWidget.textColor = "#89FF06";
                // myWidget.textColor = "oklch(58.92% 0.199 134.6)";//lemonade primary
                // myWidget.textColor = "oklch(85.39% 0.201 100.73)";//lemonade accent
                // myWidget.textColor = daisyui_themes[reduxTheme as keyof typeof daisyui_themes]["primary"];
                if (themeColorScheme === "dark") {
                    // myWidget.textColor = "#68738D";
                    myWidget.textColor = "#939db5";
                } else {
                    myWidget.textColor = "#666666";
                }
                // myWidget.textColor = daisyui_themes[reduxTheme as keyof typeof daisyui_themes]["accent"];

                myWidget.candleUpColor = "#4CE666";
                myWidget.candleDownColor = "#E64C4C";
            } else if (themeName === "light") {
                // }else{
                // myWidget.backgroundColor = "#ffffff";
                myWidget.backgroundColor = "rgba(255, 255, 255, 0)";
                // myWidget.backgroundColor = "oklch(98.71% 0.02 123.72)";
                // myWidget.toolbarBackgroundColor= "oklch(98.71% 0.02 123.72)";
                // myWidget.gridColor = "#4d5359";
                myWidget.gridColor = "rgba(0, 0, 0, 0.15)";


                // myWidget.tooltipBackgroundColor = "oklch(98.71% 0.02 123.72)";
                // myWidget.gridColor = "oklch(98.71% 0.02 123.72)";
                // tooltipBackgroundColor: "#171D2E",                
            }

            // console.log('...myWidget=', myWidget);

            let use_width: string = width_px;
            let use_height: string = height_px;

            if (containerRef.current) {
                const container = containerRef.current;
                //没有指定 宽\高 时
                if (width_px === "0px" && height_px === "0px") {
                    use_width = container.clientWidth + 'px';
                    use_height = container.clientHeight + 'px';
                } else {
                    // console.log("9999999999999")
                    //窗口大小变化，也重新读取 reduxTheme 
                    //不能在这里调用hook
                    // reduxTheme = useAppSelector((state) => state.theme.theme);            // 使用hook.ts写法
                }
            }

            // let new_width: string = "100%";
            // let new_height: string = "100%";

            // const chartChainId = getChartChainId();
            /* 前面已经判断过，这里不需要,再次非空断言 */
            /* if (containerRef.current) {
                const container = containerRef.current;

                new_width = container.clientWidth + 'px';
                new_height = container.clientHeight + 'px';
                console.log('new_width=', new_width);
                console.log('new_height=', new_height);
            } */




            window.createMyWidget(PRICE_CHART_ID, {
                // autoSize: true,
                // autoSize: false,
                // chainId: chartChainId,
                width: use_width,
                height: use_height,
                chainId: chainNameKey,
                pairAddress: tokenPair.pair_address,
                defaultInterval: timeframeMap[timeFrame] || "1D",

                timeZone:
                    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Etc/UTC",

                // showHoldersChart: true,
                showHoldersChart: false,
                // theme: 'moralis',
                // theme: 'light',

                /*正确写法：...myWidget，会 “扁平”展开，合并到最外层对象中 */
                ...myWidget,
                /*错误写法：myWidget，嵌套了 myWidget。这会导致 theme, backgroundColor, gridColor 等属性变成 myWidget.theme, myWidget.backgroundColor */

                // backgroundColor: "#0f1118",
                // backgroundColor: "rgba(255, 255, 255, 0)",
                // backgroundColor: "#ffffff",

                /* gridColor: "#1D2330",
                textColor: "#7F85A1",
                candleUpColor: "#16C784",
                candleDownColor: "#EA3943",
                borderColor: "#0D111C",
                // borderColor: "#FFFFFF",
                tooltipBackgroundColor: "#171D2E",
                // tooltipBackgroundColor: "rgba(255, 255, 255, 0)",
                volumeUpColor: "rgba(22, 199, 132, 0.5)",
                volumeDownColor: "rgba(234, 57, 67, 0.5)",
                lineColor: "#3576F2", */

                /* backgroundColor: "#071321",
                gridColor: '#0d2035',
                textColor: '#68738D',
                candleUpColor: '#4CE666',
                candleDownColor: '#E64C4C', */

                locale: "en",
                hideLeftToolbar: false,
                hideTopToolbar: false,
                hideBottomToolbar: false,
            });

            console.log(
                `Chart initialized with chainId: ${chainNameKey}, pairAddress: ${tokenPair.pair_address}`
            );
        } else {
            console.error("createMyWidget function is not defined.");
        }
    };

    useEffect(() => {
        if (!tokenPair || !tokenPair.pair_address || typeof window === "undefined") return;

        if (chartInitialized.current) return; // 避免多次执行副作用
        chartInitialized.current = true;

        if (!containerRef.current) {
            return;
        }

        // const container = containerRef.current;
        // console.log("containerRef 指向的元素是：", container);
        // const chartChainId = getChartChainId();
        // console.log("Using chainId:", chartChainId);


        // console.log("00000000000000")

        // “清除旧图表 DOM 内容”
        const existingWidget = document.getElementById(PRICE_CHART_ID);
        if (existingWidget instanceof HTMLElement) {
            while (existingWidget.firstChild) {
                existingWidget.removeChild(existingWidget.firstChild);
            }
        }

        // const scriptId = "moralis-chart-widget";

        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;

            // script.src = "https://moralis.com/static/embed/chart.js"; //用户必须开vpn，才能访问到
            script.src = `${TV_CHART_URL}/tvChar_v1.min.js`;   //用户必须开vpn，才能访问到
            // script.src = `${TV_CHART_URL}/tvChart_v2.js`;   //用户必须开vpn，才能访问到

            // script.src = 'http://localhost:3000/tvChart.js';
            // script.src = 'http://localhost:3000/tvChar_v1.min.js';
            // script.src = 'http://localhost:3586/tvChar_v1.min.js';

            
            // 建议：使用公共地址或静态资源路径（如下为本地开发时使用）
            //   script.src = "/src/components/token/MoChart.js"; // 或替换为真实外链
            script.type = "text/javascript";
            script.async = true;
            // script.async = false;

            // 加载成功回调
            script.onload = (): void => {
                loadWidget(tokenPair, timeFrame, themeCurrent); // 确保 loadWidget 已声明
                // loadWidget(tokenPair, timeFrame, themeCurrent, size.width.toFixed(0) + "px", size.height.toFixed(0) + "px"); // 确保 loadWidget 已声明
            };

            // 加载失败回调
            script.onerror = (): void => {
                console.error("Failed to load the chart widget script.");

                const chartContainer = document.getElementById(PRICE_CHART_ID);
                if (chartContainer instanceof HTMLElement) {
                    chartContainer.innerHTML = `
        <div class="h-full flex items-center justify-center text-dex-text-secondary">
          Failed to load chart. Please try again later.
        </div>
      `;
                }
            };

            document.body.appendChild(script);
        } else {
            loadWidget(tokenPair, timeFrame, themeCurrent);
            // loadWidget(tokenPair, timeFrame,themeCurrent,size.width.toFixed(0)+"px",size.height.toFixed(0)+"px");
        }
        console.log("111111111111")
        // Resize listener
        // 监听 窗口尺寸 用 window.resize
        /* const handleResize = () => {
            const container = containerRef.current;
            if (container) {
                console.log('handleResize=', container.clientWidth, container.clientHeight, container.id);
                // chart.resize(container.clientWidth, container.clientHeight);
            }
            else{
                console.log("------1----1")
            }
            // console.log("2222222222222")
            // console.log('handleResize=', container.clientWidth, container.clientHeight, container.id);
            // resizeWidget(container.clientWidth, container.clientHeight);
            // chart.resize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // 初始打印一次
        handleResize(); */
        // 推荐用法--监听 组件尺寸 用 ResizeObserver
        /* const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
              const { width, height } = entry.contentRect;
              console.log('组件容器尺寸变化：', { width, height });
              const new_width:string = width + 'px';
                // new_height= container.clientHeight+'px';
                // new_width= '1000px';
                const new_height:string = height + 'px';
              loadWidget(tokenPair, timeFrame,new_width, new_height); // 确保 loadWidget 已声明
            //   resizeWidget(width, height);
            }
          });
      
          resizeObserver.observe(containerRef.current); */
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect) {
                    const new_width: string = entry.contentRect.width + 'px';
                    const new_height: string = entry.contentRect.height + 'px';
                    loadWidget(tokenPair, timeFrame, themeCurrent, new_width, new_height); // 确保 loadWidget 已声明
                    console.log('getBoundingClientRect()=', containerRef.current?.getBoundingClientRect());
                    console.log('entry.contentRect.width=', entry.contentRect.width);
                    console.log('entry.contentRect.height=', entry.contentRect.height);
                    setSize({
                        width: entry.contentRect.width,
                        height: entry.contentRect.height,
                    });
                }
            }
        });

        observer.observe(containerRef.current);

        // 初始化一次
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSize({ width, height });
        // console.log("Container size:", size.width, size.height);
        // 清理函数（通常放在 useEffect 的 return 中）
        return () => {
            // window.removeEventListener('resize', handleResize);

            if (typeof window.destroyMyWidget === "function") {
                window.destroyMyWidget(PRICE_CHART_ID);
            }
        };
    }, [tokenPair]);
    // }, [reduxTheme]);

    // }, [size]);

    if (!tokenPair) {
        return (
            <div className="h-full flex items-center justify-center text-dex-text-secondary">
                No chart data available
            </div>
        );
    }

    // 假设你在组件或函数中已定义 pair: TokenPair
    /* const baseToken = tokenPair.pair.find((t) => t.pair_token_type === "token0") ?? null;
    const quoteToken = tokenPair.pair.find((t) => t.pair_token_type === "token1") ?? null; */

    return (
        <div className="h-full flex flex-col flex-1  min-w-[300px]
        
        
        
            \=-[P OIUYTRE]]=p- o0k9iuygtfredwq    /        ">
            {/* Top bar with pair info and controls */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="flex items-center mr-4">
                        <Image
                            src={remoteImage(tokenPair.exchange_logo) || "/images/exchanges/default-exchange.svg"}
                            alt={tokenPair.exchange_name as string}
                            width={24} height={24}
                            className="w-6 h-6 mr-2 rounded-full"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                // target.onError = null;
                                target.onerror = null; // 注意：小写 onerror
                                target.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
                            }}
                        />
                        <span className="font-medium text-dex-text-primary">
                            {tokenPair.pair_label}
                        </span>
                        <span className="ml-2 text-dex-text-secondary">
                            on {tokenPair.exchange_name}
                        </span>
                    </div>

                    <div className="text-dex-text-secondary text-sm">
                        <span className="mr-2">
                            Volume: ${(tokenPair.volume_24h_usd || 0).toLocaleString()}
                        </span>
                        <span>|</span>
                        <span className="mx-2">
                            Liquidity: ${(tokenPair.liquidity_usd || 0).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="inline-flex rounded-md mr-4"></div>
                </div>
            </div>

            {/* Chart */}
            {/* <div className="flex-1 min-w-0 overflow-hidden bg-dex-bg-secondary rounded-lg"> */}
            <div className="flex-1 min-w-0 overflow-hidden rounded-sm">
                <div
                    id={PRICE_CHART_ID}
                    ref={containerRef}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <div>
                当前尺寸：{size.width.toFixed(0)} x {size.height.toFixed(0)}&nbsp;|&nbsp;reduxTheme:
                {reduxThemeName}
            </div>
        </div>
    );
};

/* export default EvmTokenChart; */
/* 注意：使用 dynamic 进行动态导入,可能会导致渲染两次。 变宽*/
// export const EvmChart = dynamic(() => Promise.resolve(EvmTokenChart), { ssr: false });
// export default TokenChart;
