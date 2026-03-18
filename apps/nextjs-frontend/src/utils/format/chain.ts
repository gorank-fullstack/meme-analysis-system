// chainUtils.ts

// export const PATH_TO_CHAIN_ID: Record<string, string> = {
const PATH_TO_CHAIN_ID: Record<string, string> = {
  ethereum: "0x1",
  binance: "0x38",
  bsc: "0x38",
  polygon: "0x89",
  solana: "solana",
  arbitrum: "0xa4b1",
  base: "0x2105",
  avalanche: "0xa86a",
  optimism: "0xa",
  linea: "0xe708",
  fantom: "0xfa",
  pulse: "0x171",
  ronin: "0x7e4",
};

export const getApiChainId = (chainPath: string): string => {
  // return chainMap[chainPath] || chainPath;
  return PATH_TO_CHAIN_ID[chainPath] || chainPath;
};

const chainSimple_ChainPath_Map: Record<string, string> = {
  ethereum: "eth",
  binance: "bsc",
  // bsc: "0x38", // this line seems commented out intentionally
  polygon: "polygon",
  solana: "sol",
  arbitrum: "arb",
  base: "base",
  avalanche: "aval",
  optimism: "optimism",
  linea: "linea",
  fantom: "fantom",
  pulse: "pulse",
  ronin: "ronin",
};

export const getApiChainSimpleFromChainPath = (chainPath: string): string => {
  return chainSimple_ChainPath_Map[chainPath] || chainPath;
};

const chainSimple_ChainId_Map: Record<string, string> = {
  "0x1": "eth",
  ethereum: "eth",

  "0x38": "bsc",
  binance: "bsc",
  // bsc: "0x38",
  // polygon: "polygon",
  "0x89": "polygon",

  solana: "sol",
  "0xa4b1": "arb",
  arbitrum: "arb",
  "0x2105": "base",
  "0xa86a": "aval",
  "0xa": "optimism",
  "0xe708": "linea",
  "0xfa": "fantom",
  "0x171": "pulse",
  "0x7e4": "ronin",
};
export const getApiChainSimpleFromChainId = (chainId: string): string => {
  return chainSimple_ChainId_Map[chainId] || chainId;
};

// 定义区块链链 ID 到区块浏览器链接的映射关系
// 使用 TypeScript 的 Record 类型进行约束，更安全更明确
export const blockExplorers: Record<string, string> = {
  // Ethereum 主网
  "0x1": "https://etherscan.io",
  // BNB Chain
  "0x38": "https://bscscan.com",
  // Polygon 主网
  "0x89": "https://polygonscan.com",
  // Arbitrum
  "0xa4b1": "https://arbiscan.io",
  // Optimism
  "0xa": "https://optimistic.etherscan.io",
  // Base 链
  "0x2105": "https://basescan.org",
  // Avalanche 主网
  "0xa86a": "https://snowtrace.io",
  // Linea
  "0xe708": "https://lineascan.build",
  // Fantom
  "0xfa": "https://ftmscan.com",
  // PulseChain
  "0x171": "https://scan.pulsechain.com",
  // Ronin 链
  "0x7e4": "https://app.roninchain.com",
  // Solana（与 EVM 不同，但格式结构保持一致）
  solana: "https://solscan.io",
};


// 当前链 ID，假设来自上层上下文或 props
const chainId: string = "sol"; // 示例值，可替换
// const isSolana: boolean = chainId === "sol"; // 判断是否为 Solana 链

// 根据交易哈希生成区块浏览器链接
export const getExplorerUrl = (txHash: string): string => {
  // 从映射中获取当前链的区块浏览器地址
  const explorer: string = blockExplorers[chainId] || "";

  // 若未找到对应区块浏览器，返回默认链接
  if (!explorer) return "#";

  // 拼接交易详情地址（Solana 和 EVM 的 URL 结构一致）
  return `${explorer}/tx/${txHash}`;
};

// 获取钱包地址在区块浏览器中的链接地址
export const getWalletExplorerUrl = (
  walletAddress: string, // 钱包地址（字符串类型）
  chainId: string,       // 当前链 ID
  isSolana: boolean      // 是否为 Solana 链
): string => {
  // 从区块链映射中获取对应的区块浏览器 URL
  const explorer: string = blockExplorers[chainId] || "";

  // 如果未找到区块浏览器地址，则返回默认值 "#"
  if (!explorer) return "#";

  // Solana 和 EVM 链的路径格式不同，分别处理
  if (isSolana) {
    return `${explorer}/account/${walletAddress}`; // Solana 格式
  } else {
    return `${explorer}/address/${walletAddress}`; // EVM 链格式
  }
};

// 格式化钱包地址，仅保留前6位和后4位，中间用...省略
export const formatWalletAddress = (address: string | null | undefined): string => {
  if (!address) return ""; // 如果地址为空，返回空字符串

  return `${address.slice(0, 6)}...${address.slice(-4)}`; // 截断地址
};

export const shortenAddress = (address: string | undefined | null): string => {
  if (!address) return "";
  // return `${address.slice(0, 4)}...${address.slice(-4)}`;
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};