// components/ScreenSize.tsx
"use client"
import { useState, useEffect } from 'react';
import { next_api_const } from '@/config/next_api_constants';
// import internal from 'stream';


export default function Page() {

    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [screenHeight, setScreenHeight] = useState<number>(0);

    useEffect(() => {
        // 初始化时获取屏幕尺寸
        const updateScreenSize = () => {
            setScreenWidth(window.innerWidth);
            setScreenHeight(window.innerHeight);
        };

        // 在组件挂载时获取屏幕尺寸
        updateScreenSize();

        // 监听窗口尺寸变化
        window.addEventListener('resize', updateScreenSize);

        // 清理事件监听器
        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);

    return (
        <>
            <div role="alert" className="alert">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-info h-6 w-6 shrink-0">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div className="flex flex-col  w-full">
                    <div className='flex flex-row justify-between content-center'>
                        <div><span>当前环境：{process.env.NODE_ENV}</span></div>
                        <div><p>w: {screenWidth}&nbsp;/&nbsp;h: {screenHeight}</p></div>
                    </div>
                    <div>
                        <span>模拟数据：{process.env.NEXT_PUBLIC_SIMULATED_DATA}&nbsp;/&nbsp;缓存：{process.env.NEXT_PUBLIC_USE_CACHE}</span>

                    </div>
                    <div>
                        <span>路由--in：{next_api_const.api_path[next_api_const.use_api_index]}</span>
                    </div>
                </div>


            </div>

        </>

    )
}
