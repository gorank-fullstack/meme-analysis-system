import { AxiosRequestConfig } from 'axios';
export interface AxiosClientOptions {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
}
export declare class AxiosClient {
    private readonly instance;
    constructor(options?: AxiosClientOptions);
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
}
