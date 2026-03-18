import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface AxiosClientOptions {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
}

export class AxiosClient {
    private readonly instance: AxiosInstance;

    constructor(options: AxiosClientOptions = {}) {
        this.instance = axios.create({
            //   baseURL: options.baseURL || process.env.AXIOS_BASE_URL || '',
            baseURL: options.baseURL || '',
            timeout: options.timeout || 10000,
            headers: {
                // 'Content-Type': 'application/json',
                // 让用户设置的 Content-Type 优先生效（更智能）
                /* 
                如果 options.headers 中已有 Content-Type，就不会用默认值覆盖它
                 */
                // 'Content-Type': options.headers?.['Content-Type'] || 'application/json',
                ...(options.headers || {}),
            },
        });

        // 请求拦截器
        /* 
        1. 在请求发送前统一处理配置
            你可以在 config 对象里统一设置：
    
            ✅ 添加认证信息（如 Authorization 头）
            ✅ 设置通用参数（如 locale, timestamp 等）
            ✅ 修改 baseURL、headers、data 等内容
            ✅ 在 NestJS 或 Next.js 中注入动态请求上下文（如请求 ID、Token）
    
        2. 捕获配置错误
            第二个参数 (error) => Promise.reject(error) 是 拦截器错误处理函数，用于捕获请求配置过程中的异常：
            比如配置拦截器时抛出的同步错误，会被这里处理。
         */
        this.instance.interceptors.request.use(
            (config) => {
                // 可在此注入 Token 等
                /* const token = getTokenSomehow(); // 从缓存/上下文中获取 token
                if (token) {
                    config.headers = {
                        ...config.headers,
                        // 示例用途：注入 Bearer Token
                        Authorization: `Bearer ${token}`,
                    };
                } */
                return config;
            },
            (error) => Promise.reject(error),
        );

        // 响应拦截器
        /* 
        Axios 的响应拦截器（Response Interceptor），其作用是在请求完成后、真正将响应返回给调用方之前，对响应结果进行统一处理。
        相当于：
            成功响应（2xx）时，直接返回 response。
            失败响应（非 2xx，或网络异常）时，直接将 error 原样抛出。
         */
        this.instance.interceptors.response.use(
            (response) => response,
            (error) => Promise.reject(error),
        );
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance.get(url, config);
            return response.data;
        } catch (error: any) {
            if (error.code === 'ECONNABORTED') {
                console.error('AxiosClient.get-请求超时，请检查网络或接口状态');
            } else {
                console.error('AxiosClient.get-请求失败：', error.message);
            }
            return null; // 请求失败时返回 null，调用方记得处理
        }
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance.post(url, data, config);
            return response.data;
        } catch (error: any) {
            if (error.code === 'ECONNABORTED') {
                console.error('AxiosClient.post-请求超时，请检查网络或接口状态');
            } else {
                console.error('AxiosClient.post-请求失败：', error.message);
            }
            return null; // 请求失败时返回 null，调用方记得处理
        }
    }

    async request<T = any>(config: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance.request(config);
            return response.data;
        } catch (error: any) {
            if (error.code === 'ECONNABORTED') {
                console.error('AxiosClient.request-请求超时，请检查网络或接口状态');
            } else {
                console.error('AxiosClient.request-请求失败：', error.message);
            }
            return null; // 请求失败时返回 null，调用方记得处理
        }
    }
}