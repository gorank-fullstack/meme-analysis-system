export const API_REQUEST_PARAM_USE_INDEX={
    TOKEN_META_MULTI_SOL_SPL:false,
    TOKEN_META_MULTI_MO_EVM:true,
}
export const API_REQUEST_SEPARATOR = {
    //当：API_REQUEST_PARAM_USE_INDEX.TOKEN_META_MULTI_SOL_SPL为false时
    TOKEN_META_MULTI_SOL_SPL: "address[]=", 
    //当：API_REQUEST_PARAM_USE_INDEX.TOKEN_META_MULTI_MO_EVM为true时
    // TOKEN_META_MULTI_MO_EVM_HEAD: "addresses[", 
    TOKEN_META_MULTI_MO_EVM_HEAD: "addresses%5B",   //%5B　是"["的编码
    TOKEN_META_MULTI_MO_EVM_LAST: "%5D=",           //%5D　是"]"的编码
}

export const API_REQUEST_BATCH_SIZE = {
    TOKEN_META_MULTI_SOL_SPL: 20, 

    //Mo平台的evm，实测能支持单次查询超过100不重复地址．很可能达到200地址【单次】
    TOKEN_META_MULTI_MO_EvM: 100, 
}