
import { next_api_const } from '@/config/next_api_constants';
import { isAccessType } from "@/utils/normal";
// import { TABLE_NAMES } from "@/config/web3_constants";
import { TABLE_NAMES, TABLE_QUERY_FIELDS } from "@/config/web3_constants";
// const accessTypes: string[] = ["token", "kline", "trx"];
import { next_net_access } from '@/config/next_api_constants';

async function getData(printname: string, url: string, cacheOption: RequestCache) {
  try {
    const res = await fetch(url, { cache: cacheOption });

    // Recommendation: handle errors
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(printname, "--Fetch error:", error);
    return null; // 或者返回一个默认值
  }
}
//获取单个Token Mock信息
export async function getServer_Mock_Item(tableName: string, fieldName: string, queryStr: string = "", cacheflag: string = next_net_access.NOT_CACHE) {
  const cacheOption: RequestCache = cacheflag as RequestCache; // TypeScript 提供类型检查
  if (!isAccessType(TABLE_NAMES, tableName)) {
    return "";
  }

  if (!isAccessType(TABLE_QUERY_FIELDS, fieldName)) {
    return "";
  }

  if (queryStr === "") {
    // throw new Error('传入　findId　为空');
    return "";
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const apiUrl = `${next_api_const.api_path[next_api_const.use_api_index]}/sol/${tableName}/${fieldName}/${queryStr}`;

  //const fullUrl = `${baseUrl}${apiUrl}${findId}`;
  const fullUrl = `${baseUrl}${apiUrl}`;
  return getData("getServer_Mock_Item", fullUrl, cacheOption)
}
export async function getServer_Mock_ItemListUseSearch(tableName: string, queryStr: string, pagenum: number = 1, pagesize: number = 20, cacheflag: string = next_net_access.NOT_CACHE) {
  const cacheOption: RequestCache = cacheflag as RequestCache; // TypeScript 提供类型检查
  if (!isAccessType(TABLE_NAMES, tableName)) {
    return "";
  }

  if (queryStr === "") {
    // throw new Error('传入　findId　为空');
    return "";
  }
  if (pagenum < 1 || pagesize < 1) {
    return "";
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const apiUrl = `${next_api_const.api_path[next_api_const.use_api_index]}/sol/${tableName}?query=${queryStr}&pagenum=${pagenum}&pagesize=${pagesize}`;

  //const fullUrl = `${baseUrl}${apiUrl}${findId}`;
  const fullUrl = `${baseUrl}${apiUrl}`;
  return getData("getServer_Mock_ItemListUseSearch", fullUrl, cacheOption)
}
export async function getServer_Mock_ItemListNotSearch(tableName: string, pagenum: number = 1, pagesize: number = 20, cacheflag: string = next_net_access.NOT_CACHE) {
  /* if(true)
    return ""; */
  const cacheOption: RequestCache = cacheflag as RequestCache; // TypeScript 提供类型检查

  if (!isAccessType(TABLE_NAMES, tableName)) {
    return "";
  }

  if (pagenum < 1 || pagesize < 1) {
    return "";
  }
  //const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const apiUrl = `${next_api_const.api_path[next_api_const.use_api_index]}/sol/${tableName}?pagenum=${pagenum}&pagesize=${pagesize}`;

  //const fullUrl = `${baseUrl}${apiUrl}${findId}`;
  const fullUrl = `${baseUrl}${apiUrl}`;
  return getData("getServer_Mock_ItemListNotSearch", fullUrl, cacheOption)
}