
"use client"
import useSWR from "swr"// ❌ This is not available in server components
// import { unstable_serialize } from 'swr' // ✅ Available in server components
// import { unstable_serialize as infinite_unstable_serialize } from 'swr/infinite' // ✅ Available in server components
// import { useSWRConfig } from 'swr';
// import axios from "axios";

import { next_api_const } from '@/config/next_api_constants';
import { isAccessType } from "@/utils/normal";
// import { TABLE_NAMES } from "@/config/web3_constants";
import { TABLE_NAMES, TABLE_QUERY_FIELDS } from "@/config/web3_constants";
// const accessTypes: string[] = ["token", "kline", "trx"];
// const fetcher = async (url:string) => await axios.get(url).then((res) => res.data);
// const fetcher = (url: string) => fetch(url).then((res) => res.json());
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json(); // 返回解析后的 JSON 数据
};
//获取单个Token信息
export function useGetClient_Item(tableName: string, fieldName: string, queryStr: string = "", initData: string = "") {

  const isValid =
    isAccessType(TABLE_NAMES, tableName) &&
    isAccessType(TABLE_QUERY_FIELDS, fieldName) &&
    queryStr !== "";

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${next_api_const.api_path[next_api_const.use_api_index]}/sol/${tableName}/${fieldName}/${queryStr}`;
  const fullUrl = `${baseUrl}${apiUrl}`;

  const pInitData = initData || {};

  // ✅ useSWR 始终执行，但请求只有在 isValid 时才发出
  const { data, error } = useSWR(isValid ? fullUrl : null, fetcher, {
    fallbackData: pInitData,
  });

  if (!isValid) return null;

  if (error !== undefined) {
    console.error("getItem--useSWR error:", error);
    return null; // 或者返回一个默认值
  }

  return data;

}
export function useGetClient_ItemListUseSearch(tableName: string, queryStr: string, pagenum: number = 1, pagesize: number = 20, initData: string = "") {
  const isValid =
    isAccessType(TABLE_NAMES, tableName) &&
    queryStr !== "" &&
    pagenum > 0 &&
    pagesize > 0;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const apiUrl = `${next_api_const.api_path[next_api_const.use_api_index]}/sol/${tableName}?query=${queryStr}&pagenum=${pagenum}&pagesize=${pagesize}`;
  const fullUrl = `${baseUrl}${apiUrl}`;

  const pInitData = initData || {};

  // ✅ useSWR 始终执行，但请求是否发出由 isValid 控制
  const { data, error } = useSWR(isValid ? fullUrl : null, fetcher, {
    fallbackData: pInitData,
  });

  if (!isValid) return null;

  if (error !== undefined) {
    console.error("getItemListUseSearch--useSWR error:", error);
    return null; // 或者返回一个默认值
  }

  return data;

}
export function useGetClientItem_ListNotSearch(tableName: string, pagenum: number = 1, pagesize: number = 20, initData: string = "") {

  /* if (!isAccessType(TABLE_NAMES, tableName)) {
    return "";
  }

  if (pagenum < 1 || pagesize < 1) {
    return "";
  } */
  //const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';


  const apiUrl = `${next_api_const.api_path[next_api_const.use_api_index]}/sol/${tableName}?pagenum=${pagenum}&pagesize=${pagesize}`;

  const fullUrl = `${baseUrl}${apiUrl}`;


  /* 
  - **`??`**：仅在左侧操作数为 **`null`** 或 **`undefined`** 时，才返回右侧的值。
- **`||`**：在左侧操作数为任何 **假值**（`false`、`0`、`""`、`NaN`、`null`、`undefined`）时，都会返回右侧的值。
   */
  /* const pInitData = initData || {};

  const { data, error } = useSWR(fullUrl, fetcher, { fallbackData: pInitData }); */
  const shouldFetch = isAccessType(TABLE_NAMES, tableName) && pagenum > 0 && pagesize > 0;
  const { data, error } = useSWR(
    shouldFetch ? fullUrl : null,
    fetcher,
    { fallbackData: initData || {} }
  );

  if (!shouldFetch) return null;


  if (error !== undefined) {
    console.error("getItemListNotSearch--useSWR error:", error);
    console.error("apiUrl:", apiUrl);
    console.error("fullUrl:", fullUrl);
    return null; // 或者返回一个默认值
  }

  return data;

}