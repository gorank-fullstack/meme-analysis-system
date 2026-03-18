// import type { NextConfig } from "next";
// import type { NextConfig } from 'next/dist/server/config'; // ✅ 正确路径（但不推荐依赖内部路径）


// import { i18n } from './next-i18next.config.js';  // 导入 i18n 配置

// const nextConfig: NextConfig = {
const nextConfig = {
  experimental: {
    // 允许指定开发环境访问的 origin（如使用公网 IP、Nginx 反向代理等）
    allowedDevOrigins: ['http://54.175.45.26'], // 或你实际使用的地址
  },
  /* experimental: {
    allowedDevOrigins: ['http://54.175.45.26'],
  }, */
  /* experimental,是用来解决: 检测到从54.175.45.26到/next/*资源的跨源请求。在Next.js的未来主要版本中，您需要在Next.config中显式配置“allowedDevOrigins”以允许此操作
  原:⚠ Cross origin request detected from 54.175.45.26 to /_next/* resource. In a future major version of Next.js, you will need to explicitly configure "allowedDevOrigins" in next.config to allow this. */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  /* experimental: {
    ...(process.env.NODE_ENV === 'development'
      ? {
        // 👇 忽略类型错误
        allowedDevOrigins: ['http://54.175.45.26'],
      }
      : {}),
  } as any, // 👈 强制忽略 experimental 类型约束 */
  /* async rewrites() {
    return [
      {
        source: '/api0/:path*', // 你的客户端请求路径
        destination: 'http://localhost:3000/api0/:path*', // 外部 API 路径
      },
    ];
  }, */
  images: {
    /* 20250701添加--开始。让NextJs的<Image />组件， 并支持 SVG */
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    /* 20250701添加--结束。让NextJs的<Image />组件， 并支持 SVG */

    /* 解释：
images.domains 配置项告诉 Next.js 允许加载哪些外部图片来源。如果你想从多个外部域名加载图片，可以在 domains 数组中添加多个域名，如：
images: {
  domains: ['dd.dexscreener.com', 'example.com', 'anotherdomain.com'],
} */
    /* 
    使用这２行禁用，图片优化后．不启用．原因未知
    loader: 'imgix', // 使用外部图像加载器
    path: '', // 禁用 Next.js 图像优化 */
    /*
    domains: [
      // 'dd.dexscreener.com', 
      // 'www.163.com', 
      // 'ipfs.io',
      // 'pbs.twimg.com',
      // 'raw.githubusercontent.com',
      // 'pump.mypinata.cloud',
      // 'metadata.pumployer.fun',
      '54.175.45.26',
      // '**',// ⬅️ 允许所有外部域名（不安全）
      'localhost:3000',
      'entities-logos.s3.us-east-1.amazonaws.com',
    ],  // 允许加载来自该域名的图片
     */
    remotePatterns: [      
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4526',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3586',
        pathname: '/**',
      },
      // 项目运行在AWS等远程主机，需将以下{}块里面的代码：hostname: '154.75.45.26' 和 port: ''，改为远程主机ip、端口号
      {
        protocol: 'http',
        hostname: '154.75.45.26',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'entities-logos.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],

  },
  /* webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // 告诉 Webpack 不要解析 fs 模块
    };
    return config;
  }, */
  /* async rewrites() {
    return [
      {
        source: '/images/proxy/:slug*',
        destination: '/api/proxy-image/:slug*', // 重写到本地 API，再由 API 去 fetch 远程图片
      },
    ];
  }, */
  /* async rewrites() {
    return [
      {
        source: '/images/remote/:slug*',
        destination: '/api/remote-image?url=:slug*',
      },
    ];
  }, */
  // 注意，不要在这里加载i18n。加载i18n后，会自动跳转路由
  // i18n,  // 将 i18n 配置添加到 next.js 配置中
  // reactStrictMode: true,  // 开启 React 严格模式（根据需要）

  /* i18n,  // 添加 i18n 配置 */
  /* config options here */
  /* env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://api.example.com',
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV, // 也可以引用系统的环境变量
  }, */
};

export default nextConfig;
