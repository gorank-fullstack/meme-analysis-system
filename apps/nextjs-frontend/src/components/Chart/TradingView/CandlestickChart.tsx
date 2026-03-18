"use client"
import React, { useEffect, useRef } from 'react';
// 2. 将 OKLCH 颜色转换为 HEX 格式
// import { oklch, formatHex } from 'culori';
// import { useTheme } from '@/components/context/ThemeContext';
// import WebSite from "@/components/Header/_icons/WebSite";
// import { createChart } from 'lightweight-charts';
import dynamic from 'next/dynamic';
// import daisyui from 'daisyui';
export interface ILineItem {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;

}
// 定义 Menu 组件的 props
export interface ILineItems {
    line: ILineItem[];
}
// 这里定义接收一个 address 类型的字符串 prop
/* interface IChartProps {
    address: string;
} */

/* LineItems 带有children才需要下面这样定义 */
/* const CandlestickChart: React.FC<LineItems> = ({ line }) => { */

/* 如果组件不需要 children，但你用 React.FC，仍会默认包含 children 类型。这可能会导致混淆。
React 团队近年来对 React.FC 的使用建议比较保守，认为它可能会带来一些不必要的复杂性。 */
/* const getDaisyUIBackgroundColor = (): string => {

    // 获取当前主题的背景颜色（例如 --b1）
    // const theme = document.documentElement.getAttribute('data-theme');
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--b1').trim();
    return backgroundColor || '#000000'; // 如果没有找到背景颜色，使用默认值


    // return '#ff0000';
}; */

// 获取当前主题的背景色 (base-100)
/* const backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--base-100')
    .trim(); // 获取 --base-100 变量的值 */


// 获取根元素
// const root = document.documentElement;
// 服务端获取数据
// export async function getServerSideProps({ address }: IChartProps) {
// 获取 CSS 变量 `--b1` 的值
// const b1Value = getComputedStyle(root).getPropertyValue("--b1").trim();    
// 获取当前主题的背景颜色
// const b1Value = getComputedStyle(root).getPropertyValue("--b1").trim();

/* function oklchToHex(l:number, c:number, h:number) {
    // 1. OKLCH to XYZ
    // 计算 RGB 空间的 X, Y, Z
    const x = c * Math.cos(h);
    const y = l;
    const z = c * Math.sin(h);
  
    // 2. XYZ to RGB
    // 使用标准的从 XYZ 到 RGB 的转换矩阵
    // 将 XYZ 转换为 RGB
    const r = x * 0.4124564 + y * 0.3575761 + z * 0.1804375;
    const g = x * 0.2126729 + y * 0.7151522 + z * 0.0721750;
    const b = x * 0.0193339 + y * 0.1191920 + z * 0.9503041;
  
    // 3. RGB 调整为 0-255 范围
    const rgb = [r, g, b].map(value => {
      value = value > 0.0031308 ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055 : 12.92 * value;
      value = Math.round(Math.min(Math.max(0, value), 1) * 255);  // 确保值在 0-255 范围内
      return value;
    });
  
    // 4. RGB 转换为 HEX 格式
    const hex = rgb.map(x => x.toString(16).padStart(2, '0')).join('');
    return `#${hex}`;
  } */
/* function oklchToHexFromCSSVariable(lchValue:string) {
    // b1Value 格式可能是类似 "0.5 0.3 180" 的字符串
    // 将其拆解为 l, c, h 的数值
    const [l, c, h] = lchValue.split(" ").map(Number);
  
      // 使用 culori 转换为 OKLCH 对象
  //const color = oklch({ l, c, h });
    // const hexColor = formatHex(color);
    // return hexColor;
    return oklchToHex(l, c, h);
  } */
const CandlestickChart = ({ line }: ILineItems) => {
    // const CandlestickChart = ({ address }: IChartProps) => {

    // const { theme, setTheme } = useTheme();
    // const [bgColor, setBgColor] = useState('');
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartInitialized = useRef(false); // 用于避免多次初始化
    // const lines: ILineItem[] = [];
    //console.log('w:h',container.clientWidth, container.clientHeight);
    useEffect(() => {


        // 每次主题变化时，更新背景色
        /* const backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--base-100')
        .trim(); // 获取 --base-100 变量的值
     */
        /* const element1 = document.getElementById('chart');
        const elementBackgroundColor = getComputedStyle(document.getElementById('chart') as Element).backgroundColor;
        // const elementBackgroundColor = getComputedStyle(element).backgroundColor;
    
        // 获取整个页面的背景颜色
        // const backgroundColor = getComputedStyle(document.body).;
      setBgColor(elementBackgroundColor);
     */
        if (chartInitialized.current) return; // 避免多次执行副作用
        chartInitialized.current = true;
        /* useEffect(() => { */

        if (!chartContainerRef.current) return;
        /* 通过 ! 非空断言操作符告诉 TypeScript：我确定 chartContainerRef.current 不为空。 */
        /* const container = chartContainerRef.current!; */

        // 定义异步函数
        // const fetchData = async () => {
        /* const fetchData = async () => {
            try {


                //   const response = await fetch("https://api.example.com/data");
                //   const result = await response.json();
                //   setData(result); // 设置请求返回的数据
            } catch (error) {
                //   setError("Failed to fetch data"); // 错误处理
            } finally {
                //   setLoading(false); // 完成请求，设置 loading 为 false
            }
        }; */


        // console.log('b1Value=', b1Value);
        // console.log('daisyui=',daisyui.config?.theme?.zIndex);

        // console.log('oklchToHexFromCSSVariable',oklchToHexFromCSSVariable(b1Value));
        // fetchData(); // 调用异步函数 

        console.log('CandlestickChart->page()->line', line);
        /* 前面已经判断过，这里不需要,再次非空断言 */
        const container = chartContainerRef.current;
        //console.log('w:h',container.clientWidth, container.clientHeight);
        // const chartRef = useRef<any>(null);
        import('lightweight-charts').then(({ createChart }) => {
            /* import('lightweight-charts').then(({ createChart }) => { */
            // const container = chartContainerRef.current!;
            //const container = chartContainerRef.current!;
            const chart = createChart(container, {

                /* backgroundColor: "var(--base-100)", // 引用 DaisyUI base-100 作为背景色 */
                width: container.clientWidth,
                height: container.clientHeight,

                // 创建图表
                /*   const chart = createChart(chartContainerRef.current, {
                      // width: 600,
                      // height: 400, 
                      width: container.clientWidth,
                      height: container.clientHeight, */
                layout: {
                    /* backgroundColor: '#ffffff', // 背景颜色 */

                    //   backgroundColor: backgroundColor, // 使用动态背景色

                    /* backgroundColor: '#ffffff', // 背景颜色 */
                    background: {
                        // type: 'solid',
                        // color: getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim(),
                        // color: getComputedStyle(document.documentElement).getPropertyValue('--b1').trim(),
                        // color:getDaisyUIBackgroundColor(),
                        // color:"var(--base-100)",
                        color: 'rgba(255, 255, 255, 0)',
                        // color: 'oklch(var(--a))',

                        // color: 'oklch(100% 0 0)',   //无效


                        // color: getComputedStyle(document.documentElement).getPropertyValue.style.setProperty("--primary-color", newPrimaryColor);
                        // color: getComputedStyle(document.documentElement).getPropertyValue('--base-100').trim(),
                        // color: bgColor,
                    },
                    // backgroundColor:getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim(),
                    textColor: '#777777',      // 文本颜色
                    // textColor: `oklch(${b1Value})`,      // 文本颜色
                    // textColor: `oklch(${b1Value})`,      // 文本颜色

                    // textShadow: '1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black',
                },
                grid: {
                    vertLines: {
                        // color: '#e1e1e1',
                        color: 'rgba(225, 225, 225, 0.1)',
                    },
                    horzLines: {
                        // color: '#e1e1e1',
                        color: 'rgba(225, 225, 225, 0.1)',
                    },
                },
                crosshair: {
                    mode: 1, // 默认为移动模式
                },
                rightPriceScale: {
                    /* borderColor: '#cccccc', */
                    borderColor: 'rgba(225, 225, 225, 0.3)',
                },
                timeScale: {
                    /* borderColor: '#cccccc', */
                    borderColor: 'rgba(225, 225, 225, 0)',

                },
            });
            // 设置图表容器的背景色
            // container.style.backgroundColor = backgroundColor;

            // 保存图表实例
            // chartRef.current = chart;
            /* 
            Area
            Bar
            Baseline
            Candlestick
            Histogram
            Line
             */
            // 添加蜡烛图数据
            const candlestickSeries = chart.addCandlestickSeries({
                upColor: 'green',         // 上涨蜡烛颜色
                downColor: 'red',         // 下跌蜡烛颜色
                borderVisible: false,     // 隐藏边框
                wickUpColor: 'green',     // 上影线颜色
                wickDownColor: 'red',     // 下影线颜色
            });

            // 设置蜡烛图数据
            /* candlestickSeries.setData([
              { time: '2022-01-01', open: 100, high: 110, low: 90, close: 105 },
              { time: '2022-01-02', open: 105, high: 115, low: 95, close: 100 },
              { time: '2022-01-03', open: 100, high: 120, low: 98, close: 115 },
              { time: '2022-01-04', open: 115, high: 125, low: 110, close: 120 },
              { time: '2022-01-05', open: 120, high: 130, low: 115, close: 125 },
              { time: '2022-01-06', open: 150, high: 160, low: 145, close: 155 },
              { time: '2022-01-07', open: 170, high: 180, low: 175, close: 185 },
              { time: '2022-01-08', open: 140, high: 150, low: 135, close: 145 },
            ]); */
            candlestickSeries.setData(line);

            // Resize listener
            const handleResize = () => {
                chart.resize(container.clientWidth, container.clientHeight);
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                chart.remove();
            };
        });
        // 清理图表实例
        // return () => chart.remove();
        /* }, []); */
    }, [line]);

    /* return <div ref={chartContainerRef} style={{ width: '600px', height: '400px' }} />; */
    return <div id="chart" ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
        {/* <p>当前背景色：{bgColor}</p>   */}
        {/* <p>当前主题：{theme}</p> */}

    </div>;
};
/* export default CandlestickChart; */
/* 注意：使用 dynamic 进行动态导入,可能会导致渲染两次。 变宽*/
// export default dynamic(() => Promise.resolve(CandlestickChart), { ssr: false });
export const CandleChart = dynamic(() => Promise.resolve(CandlestickChart), { ssr: false });

