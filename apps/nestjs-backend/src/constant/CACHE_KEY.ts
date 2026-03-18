export const CACHE_KEY_TEMPLATE = {
    // Sol平台
    GET_SOL_SOL_TOKEN_META: "GET:/api-sol/sol/token_meta/",

    // Gp平台(停用2025.06.07)
    GET_GP_CHAINTYPE_TOKEN_SECURITY_CAARRAY_STOP: "GET:/api-:chainType/token_security/:caArray",
}

export const CACHE_KEY_HEAD = {
    // 前缀解释：S：short; L:Long; J:json; G:Gzip;
    // 组合前缀：
    // SJ_：短时间Json（一般7天内）缓存
    // LJ_：长时间Json（一般7天-60天）缓存
    // SG_：短时间Gzip（一般7天内）缓存
    // LG_：长时间Gzip（一般7天-60天）缓存
    SJ_GET_API_SOL: "SJ_GET:/api-sol",
    SJ_GET_API_GP: "SJ_GET:/api-gp",
    SJ_GET_API_MO: "SJ_GET:/api-gp",
    SJ_GET_API_CG: "SJ_GET:/api-cg",
    SJ_GET_API_GR: "SJ_GET:/api-gr",

    LG_GET_API_SOL: "LG_GET:/api-sol",

    //使用：GET和CORN前缀，区分缓存的生成方式
    //通过GET访问：task-gr，有过期时间
    SJ_GET_TASK_GR: "SJ_GET:/task-gr",
    //通过CORN访问：task-gr，无过期时间
    SJ_CORN_TASK_GR: "SJ_CORN:/task-gr",
    //通过SORT访问：task-gr，无过期时间
    SJ_SORT_TASK_GR: "SJ_CORN:/task-gr",
}
export const CACHE_KEY_MIDDLE = {
    //格式类似：CACHE_GET_HEAD.MO+"/"+chainType+"/"+CACHE_KEY_MIDDLE+"/"+caArray
    // api-sol平台
    TOKEN_META: "token_meta",
    TOKEN_META_MULTI: "token_meta_multi",

    // api-gp平台
    TOKEN_SECURITY: "token_security",

    // api-gr、task-gr平台:当次获取
    TRENDING_POOLS:"trending_pools",
    NEW_POOLS:"new_pools",

    // TRENDING_POOLS_5m:"trending_pools_5m",
    // TRENDING_POOLS_1h:"trending_pools_1h",
    TRENDING_POOLS_6h:"trending_pools_6h",
    TRENDING_POOLS_24:"trending_pools_24",

    TRENDING_POOLS_MAP: "trending_pools_map",
    NEW_POOLS_MAP: "new_pools_map",
}