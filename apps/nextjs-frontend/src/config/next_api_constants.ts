export const next_api_const = {
    // use_api_index:0,
    use_api_index:
    (process.env.NEXT_PUBLIC_SIMULATED_DATA === "true" && process.env.NEXT_PUBLIC_USE_CACHE === "false")? 0 :
    (process.env.NEXT_PUBLIC_SIMULATED_DATA === "true" && process.env.NEXT_PUBLIC_USE_CACHE === "true")? 1 :
    (process.env.NEXT_PUBLIC_SIMULATED_DATA === "false" && process.env.NEXT_PUBLIC_USE_CACHE === "false")? 2 :3,
    /*  */
    api_path: [
        "/api0",    //SIMULATE_DATA_NO_CACHE 0
        "/api1",    //SIMULATE_DATA_USE_CACHE 1
        "/api2",    //REAL_DATA_NO_CACHE 2
        "/api3",    //REAL_DATA_USE_CACHE 3
    ],
}

export const next_net_access ={
    USE_CACHE:"force-cache",
    NOT_CACHE:"no-store",
}
/* export enum api_version {
    SIMULATE_DATA_NO_CACHE = 0,
    SIMULATE_DATA_USE_CACHE = 1,
    REAL_DATA_NO_CACHE = 2,
    REAL_DATA_USE_CACHE = 3,
} */