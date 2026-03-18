
import { IRawGpEvmTokenSecurityResponse, IRawGpSplTokenSecurityResponse } from '@gr/interface-api/platform-safe';
// import { isNil } from '@nestjs/common/utils/shared.utils';
import { API_GP_CODE } from 'src/status-code/API_GP_CODE';
import { isNilOrEmptyObject } from 'src/utils/format/format';
import { get_Gp_ChainNameToId_Map } from 'src/utils/web3';
import { get_MoChainName_To_MoChainId_Map } from 'src/utils/web3';

//------------【第二部分(之一): 向 GoPluse API 请求 TokenSecurity 信息，存入：Map<string, any>
//------------注意：GoPluse Api限制，每次只能请求一个token的　TokenSecurity信息。
//------------虽然参数是：addresses复数，但实际传多个地址，只返回数组中第一个地址的TokenSecurity信息------------
export async function fetch_Gp_TokenSecurity_From_Api(
    chainType: string,
    addresses: string[],
    // batchSize: number,
    getJsonFromUrl_Gp: (url: string, errorMessage: string) => Promise<any>

): Promise<Map<string, any>> {
    const tokenSecurityMap = new Map<string, any>();

    // for (let i = 0; i < addresses.length; i += batchSize) {
    for (let i = 0; i < addresses.length; i++) {
        let gp_url: string = "";
        let gp_json: any = {};
        let getDataSuccess: boolean = false;

        if (chainType === "sol") {
            try {
                // Sol链api接口
                // https://docs.gopluslabs.io/reference/solanatokensecurityusingget
                gp_url = `/solana/token_security?contract_addresses=${addresses[i]}`;
                gp_json = await getJsonFromUrl_Gp(gp_url, "Error fetching getTokenSecurityFromCaArray_UseUrl():");

                //判断数据获取，是否成功
                if (!isNilOrEmptyObject(gp_json)) {
                    // const gtSPLTokenSecurityParsed: IGpSplTokenSecurityResponse = JSON.parse(gp_json);
                    const rawGpSplTokenSecurityParsed: IRawGpSplTokenSecurityResponse = gp_json;
                    if (rawGpSplTokenSecurityParsed.code === API_GP_CODE.OK) {
                        getDataSuccess = true;
                    } else {
                        console.log("error:fetch_Gp_TokenSecurity_From_Api,gp_json=", gp_json);
                    }
                }
            } catch (error: any) {
                // Axios 超时错误通常有 code === 'ECONNABORTED'
                if (error.code === 'ECONNABORTED') {
                    console.warn(`⏱️ Timeout on i[${i}]:`, error.message);
                } else {
                    console.error(`❌ Error on i[${i}]:`, error);
                }

                // 不抛出错误，跳过此 batch
                continue;
            }

        } else {
            const chainId = get_Gp_ChainNameToId_Map[chainType]; // 137
            // Evmp链api接口
            // https://docs.gopluslabs.io/reference/tokensecurityusingget_1
            // https://api.gopluslabs.io/api
            try {
                gp_url = `/token_security/${chainId}?contract_addresses=${addresses[i]}`;
                gp_json = await getJsonFromUrl_Gp(gp_url, "Error fetching getTokenSecurityFromCaArray_UseUrl():");

                //判断数据获取，是否成功
                if (!isNilOrEmptyObject(gp_json)) {
                    // const gpEvmTokenSecurityParsed: IGpEvmTokenSecurityResponse = JSON.parse(gp_json);
                    const rawGpEvmTokenSecurityParsed: IRawGpEvmTokenSecurityResponse = gp_json;
                    if (rawGpEvmTokenSecurityParsed.code === API_GP_CODE.OK) {
                        getDataSuccess = true;
                    } else {
                        console.log("error:fetch_Gp_TokenSecurity_From_Api,gp_json=", gp_json);
                    }
                }
            } catch (error: any) {
                // Axios 超时错误通常有 code === 'ECONNABORTED'
                if (error.code === 'ECONNABORTED') {
                    console.warn(`⏱️ Timeout on i[${i}]:`, error.message);
                } else {
                    console.error(`❌ Error on i[${i}]:`, error);
                }

                // 不抛出错误，跳过此 batch
                continue;
            }

        }//End if (chainType === "sol")

        //数据获取，成功才存入Map
        if (getDataSuccess) {
            tokenSecurityMap.set(addresses[i], gp_json);
        }
    }//End for

    return tokenSecurityMap;
}


//------------【第四部分(之一): 按 BATCH_SIZE 向 Sol/Mo API 请求 TokenMeta 信息，存入：Map<string, any>
export async function fetch_SolSpl_TokenMeta_From_Api(
    // chainType: string,
    addresses: string[],
    // apiParamUseIndex_MoEvm: boolean,
    apiParamUseIndex_SolSpl: boolean,
    separatorStr_SolSpl: string,
    batchSize_SolSpl: number,
    // getJsonFromUrl_Mo: (url: string, errorMessage: string) => Promise<any>,
    getJsonFromUrl_Sol: (url: string, errorMessage: string) => Promise<any>,

): Promise<Map<string, any>> {
    const tokenMetaMap = new Map<string, any>();
    let separatorStr: string = "";

    if (apiParamUseIndex_SolSpl === false) {
        separatorStr = separatorStr_SolSpl;
    }

    for (let i = 0; i < addresses.length; i += batchSize_SolSpl) {
        const batch = addresses.slice(i, i + batchSize_SolSpl);
        let caArrayLine: string = "";

        if (apiParamUseIndex_SolSpl === false) {
            caArrayLine = batch.map(addr => `${separatorStr}${addr}`).join("&");
        }

        try {
            const url = `https://pro-api.solscan.io/v2.0/token/meta/multi?${caArrayLine}`;

            const solSpl_json = await getJsonFromUrl_Sol(url, `Error fetching batch ${i / batchSize_SolSpl + 1}`);

            //遍历返回的数组
            // for (const token of solSpl_json.data) {
            for (const token of solSpl_json) {
                // 注意：tokenMetaMap存入的是未经过封装的：Object
                tokenMetaMap.set(token.address, token);
            }
        } catch (error: any) {
            // Axios 超时错误通常有 code === 'ECONNABORTED'
            if (error.code === 'ECONNABORTED') {
                console.warn(`⏱️ Timeout on batch ${i / batchSize_SolSpl + 1}:`, error.message);
            } else {
                console.error(`❌ Error on batch ${i / batchSize_SolSpl + 1}:`, error);
            }

            // 不抛出错误，跳过此 batch
            continue;
        }

    }

    return tokenMetaMap;
}

export async function fetch_MoEvm_TokenMeta_From_Api(
    chainType: string,
    addresses: string[],
    apiParamUseIndex_MoEvm: boolean,
    // apiParamUseIndex_SolSpl: boolean,

    separatorStr_MoEvm_Head: string,
    separatorStr_MoEvm_Last: string,
    // separatorStr_SolSpl: string,

    batchSize_MoEvm: number,
    // batchSize_SolSpl: number,
    getJsonFromUrl_Mo: (url: string, errorMessage: string) => Promise<any>,
    // getJsonFromUrl_Sol: (url: string, errorMessage: string) => Promise<any>,

): Promise<Map<string, any>> {
    const tokenMetaMap = new Map<string, any>();
    // let separatorStr: string = "";
    let separatorStr_Head: string = "";
    let separatorStr_Last: string = "";

    // let batchSize: number = 1;
    if (apiParamUseIndex_MoEvm === true) {
        separatorStr_Head = separatorStr_MoEvm_Head;
        separatorStr_Last = separatorStr_MoEvm_Last;
    }
    const chainId = get_MoChainName_To_MoChainId_Map(chainType);


    for (let i = 0; i < addresses.length; i += batchSize_MoEvm) {
        const batch = addresses.slice(i, i + batchSize_MoEvm);
        let caArrayLine: string = "";

        if (apiParamUseIndex_MoEvm === true) {
            // caArrayLine = batch.map(addr => `${separatorStr}${addr}`).join("&");
            caArrayLine = batch
                // .map((addr, index) => `${separatorStr_Head}${index}${separatorStr_MoEvm_Last}${encodeURIComponent(addr)}`)
                // 下行代码，会把"="给也编码为：%3D
                // .map((addr, index) => encodeURIComponent(`${separatorStr_Head}${index}${separatorStr_MoEvm_Last}${addr}`))
                .map((addr, index) => `${separatorStr_Head}${index}${separatorStr_MoEvm_Last}${addr}`)
                .join('&');
        }

        try {
            const url = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chainId}&${caArrayLine}`;
            // const url = `https://pro-api.solscan.io/v2.0/token/meta/multi?${caArrayLine}`;
            const res = await getJsonFromUrl_Mo(url, `Error fetching batch ${i / batchSize_MoEvm + 1}`);
            // console.log('res->',res);
            //遍历返回的数组
            // for (const token of res.data) {  //solscan返回的数组，才被包含在：data对象里．
            for (const token of res) {  //mo返回的是直接数组，没被包含在：任何对象里．

                // 注意：tokenMetaMap存入的是未经过封装的：Object
                tokenMetaMap.set(token.address, token);
            }
        } catch (error: any) {
            // Axios 超时错误通常有 code === 'ECONNABORTED'
            if (error.code === 'ECONNABORTED') {
                console.warn(`⏱️ Timeout on batch ${i / batchSize_MoEvm + 1}:`, error.message);
            } else {
                console.error(`❌ Error on batch ${i / batchSize_MoEvm + 1}:`, error);
            }

            // 不抛出错误，跳过此 batch
            continue;
        }

    }

    return tokenMetaMap;
}