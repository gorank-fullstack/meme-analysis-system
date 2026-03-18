
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

/* export const nestAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEST_API_HOST || 'http://localhost:3018',
  timeout: 10000,
}); */

/**
 * 包装 axios 实例，增加 getJson 方法
 */
function createAxiosClient(): AxiosInstance & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getJson<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
} {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NEST_API_HOST || 'http://localhost:3018',
    timeout: 10000,
  });

  // 添加 getJson 方法
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function getJson<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await instance.get<T>(url, config);
    return response.data;
  }

  return Object.assign(instance, { getJson });
}

export const nestAxios = createAxiosClient();
