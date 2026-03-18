import { TTabType_Server,TTabType_Client } from "@gr/interface-base";

// Client -> Server 映射函数
export function getClientToServerTab(tab: TTabType_Client): TTabType_Server {
    const mapping: Record<TTabType_Client, TTabType_Server> = {
        hot: 'trending_pools',
        new: 'new_pools',
    };
    return mapping[tab];
}

// Server -> Client 映射函数
export function getServerToClientTab(tab: TTabType_Server): TTabType_Client {
    const reverseMapping: Record<TTabType_Server, TTabType_Client> = {
        trending_pools: 'hot',
        new_pools: 'new',
    };
    return reverseMapping[tab];
}

/* function isTTabTypeClient(str: string): str is TTabType_Client {
    return str === 'hot' || str === 'new';
} */

/* function normalizeClientTabType(
    newStr: string,
    defaultValue: TTabType_Client
): TTabType_Client {
    return isTTabTypeClient(newStr) ? newStr : defaultValue;
} */