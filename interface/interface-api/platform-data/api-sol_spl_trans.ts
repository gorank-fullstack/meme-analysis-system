// ======================================================
// 顶层响应
// ======================================================
export interface IResponseRaw {
    success: string | number;   // 源为 boolean，这里按 string|number 接
    data: IDataItemRaw[];
}

// ======================================================
// data[] 内单条记录（交易/区块明细）
// ======================================================
export interface IDataItemRaw {
    block_id: number;
    fee: number;
    reward: (string | number)[];

    sol_bal_change: ISolBalanceChangeRaw[];
    token_bal_change: ITokenBalanceChangeRaw[];

    tokens_involved: string[];
    parsed_instructions: IParsedInstructionRaw[];

    programs_involved: string[];
    signer: string[];
    list_signer: string[];

    status: number;

    account_keys: IAccountKeyRaw[];

    compute_units_consumed: number;
    confirmations: number | string | null;
    version: number;
    priority_fee: number;

    tx_hash: string;
    block_time: number;

    address_table_lookup: IAddressTableLookupRaw[];
    log_message: string[];
}

// ======================================================
// SOL 余额变更
// ======================================================
export interface ISolBalanceChangeRaw {
    address: string;
    pre_balance: string;
    post_balance: string;
    change_amount: string;
}

// ======================================================
// Token 余额变更
// ======================================================
export interface ITokenBalanceChangeRaw {
    address: string;
    change_type: string;
    decimals: number;
    change_amount: string;
    post_balance: string;
    pre_balance: number;
    token_address: string;
    owner: string;
    event_type: string;
    post_owner: string;
    pre_owner: string;
}

// ======================================================
// 解析后的指令（外层）
// ======================================================
export interface IParsedInstructionRaw {
    ins_index: number;
    parsed_type: string;
    type: string;
    program_id: string;
    program?: string;
    outer_program_id: string | number | null;
    outer_ins_index: number;

    // 字符串（如 base64/base58）或带 info/type 的对象（见下方联合）
    data_raw:
    | string
    | ISystemCreateAccountDataRaw
    | ISystemTransferDataRaw
    | ISystemAllocateDataRaw
    | ISystemAssignDataRaw
    | ITokenInitializeMint2DataRaw
    | ITokenInitializeAccount3DataRaw
    | ITokenMintToDataRaw
    | ITokenSetAuthorityDataRaw
    | ITokenGetAccountDataSizeDataRaw
    | ITokenInitializeImmutableOwnerDataRaw;

    accounts: string[];
    activities: IActivityRaw[];
    transfers: ITransferRaw[];

    program_invoke_level?: number;

    idl_data?: IIdlDataRaw;
    inner_instructions?: IInnerInstructionRaw[];
}

// ======================================================
// 内层指令（CPI）
// ======================================================
export interface IInnerInstructionRaw {
    ins_index: number;
    parsed_type: string;
    type: string;
    program_id: string;
    program?: string;
    outer_program_id?: string;
    outer_ins_index?: number;

    data_raw:
    | string
    | ISystemCreateAccountDataRaw
    | ISystemTransferDataRaw
    | ISystemAllocateDataRaw
    | ISystemAssignDataRaw
    | ITokenInitializeMint2DataRaw
    | ITokenInitializeAccount3DataRaw
    | ITokenMintToDataRaw
    | ITokenSetAuthorityDataRaw
    | ITokenGetAccountDataSizeDataRaw
    | ITokenInitializeImmutableOwnerDataRaw;

    accounts: string[];
    activities?: IActivityRaw[];
    transfers?: ITransferRaw[];
    program_invoke_level?: number;
}

// ======================================================
// 指令 data_raw：System Program 形态
// ======================================================
export interface ISystemCreateAccountDataRaw {
    type: "createAccount";
    info: {
        lamports: number;
        newAccount: string;
        owner: string;
        source: string;
        space: number;
    };
}

export interface ISystemTransferDataRaw {
    type: "transfer";
    info: {
        destination: string;
        lamports: number;
        source: string;
    };
}

export interface ISystemAllocateDataRaw {
    type: "allocate";
    info: {
        account: string;
        space: number;
    };
}

export interface ISystemAssignDataRaw {
    type: "assign";
    info: {
        account: string;
        owner: string;
    };
}

// ======================================================
// 指令 data_raw：SPL-Token 形态
// ======================================================
export interface ITokenInitializeMint2DataRaw {
    type: "initializeMint2";
    info: {
        decimals: number;
        mint: string;
        mintAuthority: string;
    };
}

export interface ITokenInitializeAccount3DataRaw {
    type: "initializeAccount3";
    info: {
        account: string;
        mint: string;
        owner: string;
    };
}

export interface ITokenMintToDataRaw {
    type: "mintTo";
    info: {
        account: string;
        amount: string;         // 样例为字符串数字
        mint: string;
        mintAuthority: string;
    };
}

export interface ITokenSetAuthorityDataRaw {
    type: "setAuthority";
    info: {
        authority: string;
        authorityType: string;  // e.g. "mintTokens"
        mint: string;
        newAuthority: null | string;
    };
}

export interface ITokenGetAccountDataSizeDataRaw {
    type: "getAccountDataSize";
    info: {
        extensionTypes: string[]; // ["immutableOwner"]
        mint: string;
    };
}

export interface ITokenInitializeImmutableOwnerDataRaw {
    type: "initializeImmutableOwner";
    info: {
        account: string;
    };
}

// ======================================================
// 指令中的“活动”语义块（按样例细化 data 联合）
// ======================================================
export interface IActivityRaw {
    name: string;
    activity_type: string;
    program_id?: string;

    data?:
    | IActivityDataComputeBudgetPrice
    | IActivityDataComputeBudgetLimit
    | IActivityDataRaydiumCreatePool
    | IActivityDataSPLInitMint
    | IActivityDataCreateAccount
    | IActivityDataInitializeAccount3
    | IActivityDataTokenSetAuthority
    | IActivityDataMintTo
    | IActivityDataRaydiumSwap
    | IActivityDataCloseAccount;

    ins_index?: number;
    outer_ins_index?: number;
    outer_program_id?: string | number | null;
    program_invoke_level?: number;
    inst_type?: string;
}

// ——各活动 data 形态
export interface IActivityDataComputeBudgetPrice {
    compute_unit_price_by_microlamport: string;
}

export interface IActivityDataComputeBudgetLimit {
    compute_unit_limit: string;
}

export interface IActivityDataRaydiumCreatePool {
    pool_id: string;
    account: string;
    token_1: string;
    token_decimal_1: number;
    pool_token_account_1: string;
    token_2: string;
    token_decimal_2: number;
    pool_token_account_2: string;
    type: string; // "amm_pool"
    extra_data: { platform: string };
}

export interface IActivityDataSPLInitMint {
    decimals: number;
    mint: string;
    mint_authority: string;
    creator: string;
}

export interface IActivityDataCreateAccount {
    new_account: string;
    source: string;
    transfer_amount: number;
    transfer_amount_str: string;
    program_owner: string;
    space: number;
    common_type: string; // "create-account"
}

export interface IActivityDataInitializeAccount3 {
    token_address: string;
    init_account: string;
    owner: string;
}

export interface IActivityDataTokenSetAuthority {
    account: string;
    old_authority: string;
    new_authority: null | string;
    authority_type: string;
    amount: null | number | string;
    token_address: null | string;
    token_decimals: null | number;
}

export interface IActivityDataMintTo {
    account: string;
    account_owner: string;
    authority: string;
    token_address: string;
    token_decimals: number;
    amount: number;
    amount_str: string;
}

export interface IActivityDataRaydiumSwap {
    amm_id: string;
    amm_authoriy: string;
    account: string;
    token_1: string;
    token_2: string;
    amount_1: number;
    amount_1_str: string;
    amount_2: number;
    amount_2_str: string;
    token_decimal_1: number;
    token_decimal_2: number;
    token_account_1_1: string;
    token_account_1_2: string;
    token_account_2_1: string;
    token_account_2_2: string;
    owner_1: string;
    owner_2: string;
    fee_account_1: null | string;
    fee_account_2: null | string;
    fee_ammount: null | number | string;
    fee_token: null | string;
    fee_token_decimal: null | number;
    side: number;
}

export interface IActivityDataCloseAccount {
    amount: number | string;
    amount_str: string;
    token_address: string;
    token_decimals: number;
    closed_account: string;
    authority: string;
    destination: string;
}

// ======================================================
// 指令中的“转账”语义块
// ======================================================
export interface ITransferRaw {
    source_owner: string | null;
    source: string | null;
    destination: string;
    destination_owner: string | null;

    transfer_type: string;
    token_address: string;
    decimals: number;

    amount_str: string;
    amount: number | string;

    program_id: string;
    outer_program_id?: string;

    ins_index: number;
    outer_ins_index: number;

    event: string;
    fee: {} | string | number | null;

    base_value?: {
        token_address: string;
        decimals: number;
        amount: number | string;
        amount_str: string;
    };
}

// ======================================================
// IDL 数据（按样例精确定义已出现字段）
// ======================================================
export interface IIdlDataRaw {
    docs?: string[];
    input_args?: {
        // ComputeBudget.SetComputeUnitPrice
        discriminator?: IIdlNumericArg;
        microLamports?: IIdlNumericArg;

        // ComputeBudget.SetComputeUnitLimit
        units?: IIdlNumericArg;

        // mpl_token_metadata.createMetadataAccountV3
        dataV2?: {
            type: string; // "u8"
            data: {
                name: string;
                symbol: string;
                uri: string;
                sellerFeeBasisPoints: number;
                creators: IIdlCreator[];
                collection: null | string | number;
                uses: null | string | number;
            };
        };
        isMutable?: { type: string; data: number | string };
        collectionDetails?: { type: string; data: null | string | number };

        // raydium_launchpad.initialize
        base_mint_param?: {
            type: { defined: { name: string } };
            data: {
                decimals: IIdlNumericArg;
                name: { type: "string"; data: string };
                symbol: { type: "string"; data: string };
                uri: { type: "string"; data: string };
            };
        };
        curve_param?: {
            type: { defined: { name: string } };
            data: {
                Constant: {
                    data: {
                        supply: string;
                        total_base_sell: string;
                        total_quote_fund_raising: string;
                        migrate_type: number;
                    };
                };
            };
        };
        vesting_param?: {
            type: { defined: { name: string } };
            data: {
                total_locked_amount: IIdlNumericArg;
                cliff_period: IIdlNumericArg;
                unlock_period: IIdlNumericArg;
            };
        };

        // raydium_launchpad.buy_exact_in
        amount_in?: IIdlNumericArg;
        minimum_amount_out?: IIdlNumericArg;
        share_fee_rate?: IIdlNumericArg;
    };
}

export interface IIdlNumericArg {
    type: string;                // "u8" | "u32" | "u64" | ...
    data: number | string;       // 样例里数值/布尔统一以 number|string 承接
}

export interface IIdlCreator {
    address: string;
    verified: string | number;   // 源为 boolean，按 string|number 承接
    share: number;
}

// ======================================================
// 账户键（Account Meta）
// ======================================================
export interface IAccountKeyRaw {
    pubkey: string;
    writable: string | number;   // 源为 boolean
    signer: string | number;     // 源为 boolean
    source: string;              // "transaction" | "lookupTable"
}

// ======================================================
// 地址表查询（ALT Lookup）
// ======================================================
export interface IAddressTableLookupRaw {
    accountKey: string;
    writableIndexes: number[];
    readonlyIndexes: number[];
}
