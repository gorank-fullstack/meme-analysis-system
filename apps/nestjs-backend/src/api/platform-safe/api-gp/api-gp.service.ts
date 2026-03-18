import { Injectable } from '@nestjs/common';
import { GoPlus, ErrorCode } from "@goplus/sdk-node";
import { AxiosClient } from '@gr/axios-client';
import { get_Gp_ChainNameToId_Map } from 'src/utils/web3';
/* import GoPlusSdk from "@goplus/sdk-node"; // 正确方式

const { GoPlus, ErrorCode } = GoPlusSdk; */
// import * as GoPlusSdk from "@goplus/sdk-node";
@Injectable()
export class ApiGpService {
  private readonly gpAxios: AxiosClient;  //调用cg平台api的axios
  constructor() {
    //gp平台api的axios的初始化
    this.gpAxios = new AxiosClient({
      // baseURL: '',    // 不加前缀，使用完整 URL
      baseURL: 'https://api.gopluslabs.io/api/v1',    // 不加前缀，使用完整 URL
      headers: {
        accept: "*/*",
        // accept: 'application/json',
        // 'x-cg-pro-api-key': API_KEY,
      },
    });
  }

  getJsonFromUrl_Gp = async (url: string, errPrint: string): Promise<any> => {
    console.log("getJsonFromUrl_Gp->Fetching from URL:", url);
    try {
      // axios 版
      return this.gpAxios.get(url);
    } catch (error) {
      // console.error(errPrint, error);
      throw error;
    }
  }
  // https://api.gopluslabs.io/api/v1

  //------------------------------- Token Security --------------------------------------------------------------
  getTokenSecurityFromCaArray_UseUrl = async (
    chainType: string,
    caArray: string,  // 注意：实测sol或evm链．caArray实际只支持单地址查询．传入多个地址，只返回第一个地址的结果

    // ): Promise<any[]> => {
  ): Promise<any> => {

    let url: string = "";
    if (chainType === "sol") {
      // Sol链api接口
      // https://docs.gopluslabs.io/reference/solanatokensecurityusingget
      url = `/solana/token_security?contract_addresses=${caArray}`;
    } else {
      const chainId = get_Gp_ChainNameToId_Map[chainType]; // 137
      // Evmp链api接口
      // https://docs.gopluslabs.io/reference/tokensecurityusingget_1
      // https://api.gopluslabs.io/api
      url = `/token_security/${chainId}?contract_addresses=${caArray}`;
    }

    return this.getJsonFromUrl_Gp(url, "Error fetching getTokenSecurityFromCaArray_UseUrl():");

  }

  getTokenSecurityFromCaArray_UseGoPlus = async (
    chainType: string,
    caArray: string,
    // ): Promise<any[]> => {
  ): Promise<any> => {


    let chainId = "1";
    // 经审达url调用和GoPlus库调用测试．实测只会返回：addresses数组里的第一个地址数据．
    let addresses = [
      // "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      // "0x9ac9468e7e3e1d194080827226b45d0b892c77fd",
      "0x962c8a85f500519266269f77dffba4cea0b46da1",
      "0xa93d86af16fe83f064e3c0e2f3d129f7b7b002b0",
      "0xae9f227a68a307afa799fa024198ba6d1d83da4b",
    ];

    // It will only return 1 result for the 1st token address if not called getAccessToken before
    // let res = await GoPlus.tokenSecurity(chainId, addresses, 30);
    // const res = await GoPlus.tokenSecurity(chainId, addresses, 30);
    const res = await (GoPlus as any).tokenSecurity(chainId, addresses, 30);
    // const res = await GoPlusSdk.GoPlus.tokenSecurity(chainId, addresses, 30);

    /* if (res.code != ErrorCode.SUCCESS) {
      console.error(res.message);
    } else {
      console.log(res.result["0x408e41876cccdc0f92210600ef50372656052a38"]);
    } */
    if (res.code !== (ErrorCode as any).SUCCESS) {
      console.error(res.message);
    }
    return res;
  }
}
