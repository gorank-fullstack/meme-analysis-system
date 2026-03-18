import { NextRequest } from 'next/server';

const ALLOWED_HOSTS_ACTIVE: boolean = false;  //默认不开启白名单检验
// 支持的白名单地址．ALLOWED_HOSTS_ACTIVE为true才检验
const ALLOWED_HOSTS = [
    'dd.dexscreener.com',
    'ipfs.io',
    'pbs.twimg.com',
    'raw.githubusercontent.com',
    'pump.mypinata.cloud',
    'metadata.pumployer.fun',
    'arweave.net',
];

function isHostAllowed(hostname: string): boolean {
    return ALLOWED_HOSTS.includes(hostname);
}

// 拒绝内网地址（如 127.0.0.1, localhost, 169.254.x.x）
function isPrivateIP(hostname: string): boolean {
    return (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('169.254.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    );
}

/* 20250701新加－－开始 */
const fallbackGateways = [
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
  ];
  
  function convertIpfsUrl(original: string): string {
    if (original.startsWith('ipfs://')) {
      return fallbackGateways[0] + original.replace('ipfs://', '');
    } else if (original.includes('cf-ipfs.com/ipfs/')) {
      const hash = original.split('/ipfs/')[1];
      return fallbackGateways[0] + hash;
    }
    return original;
  }
/* 20250701新加－－结束 */
// ✅ 根据扩展名猜测 MIME 类型（兜底方案）
function guessMimeTypeFromUrl(url: string): string {
    const ext = url.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'webp':
            return 'image/webp';
        case 'gif':
            return 'image/gif';
        case 'svg':
            return 'image/svg+xml';
        case 'ico':
            return 'image/x-icon';
        default:
            return 'application/octet-stream'; // fallback
    }
}

export async function GET(req: NextRequest) {
    // const url = req.nextUrl.searchParams.get('url');
    const rawUrl = req.nextUrl.searchParams.get('url');
    const url = convertIpfsUrl(rawUrl || '');   //20250701新加

    if (!url) {
        return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let parsedUrl: URL;

    try {
        parsedUrl = new URL(url);
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // 阻止 file:// 或非 http/https 协议
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return new Response(JSON.stringify({ error: 'Invalid protocol' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // 检查是否是私有 IP
    if (isPrivateIP(parsedUrl.hostname)) {
        return new Response(JSON.stringify({ error: 'Private IPs are not allowed' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // 白名单域名校验（可选，推荐开启）
    if (ALLOWED_HOSTS_ACTIVE===true && !isHostAllowed(parsedUrl.hostname)) {
        return new Response(JSON.stringify({ error: 'Host not allowed' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const referer = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
        console.log('referer=', referer);
        const response = await fetch(url, {
            headers: {
                // 'User-Agent'	模拟浏览器访问，防止被识别为爬虫
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                //  'Referer' 模拟图片“来自自己网站”，绕过盗链限制
                'Referer': referer,
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch image' }), {
                status: 502,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 优先使用响应头中的 content-type，否则兜底
        const contentType = response.headers.get('content-type') || guessMimeTypeFromUrl(url);
        // const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                // 浏览器会根据该头部决定是否直接使用缓存内容
                // 中间层可能缓存响应，减少服务器请求压力
                // 如果你希望 不缓存，可以设置为：'Cache-Control': 'no-store'
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (err) {
        console.error('Image proxy error:', err);
        return new Response(JSON.stringify({ error: 'Proxy failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
