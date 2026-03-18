import { IGrTokenSortItem_Client } from "@gr/interface-api/uniform-data";

export async function load_Gp_SolSplTranx_From_Memory(
                
    grTokenSortList: IGrTokenSortItem_Client[],
    // this.redisClient,
    map_AddressWithout_SolSplTranx_To_CreateTime,
    // CACHE_KEY_HEAD.SJ_GET_API_GP,
    // CACHE_KEY_MIDDLE.TOKEN_SECURITY,
    
): Promise<string[]>{
    const addressWithoutList: string[] = [];

    for (const token of grTokenSortList) {
        const ca = token.ca;
        const timestampInSeconds = token.c_t_sec;
    }
    return addressWithoutList;
};