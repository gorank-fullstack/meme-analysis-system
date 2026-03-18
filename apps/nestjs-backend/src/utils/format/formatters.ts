/**
 * Format a number with K, M, B suffixes
 * @param num - Number to format
 * @returns Formatted number
 */
export const formatNumber = (num: number): string => {
    if (!num) return "0";
  
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };
  
  /**
   * Format a unix timestamp into a human-readable age (e.g., "2h", "3d", "1mo")
   * @param timestamp - Unix timestamp in milliseconds
   * @returns Formatted age
   */
  export const formatAge = (timestamp: number): string => {
    if (!timestamp) return "N/A";
  
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffSec = diffMs / 1000;
  
    if (diffSec < 60) return Math.floor(diffSec) + "s";
    if (diffSec < 3600) return Math.floor(diffSec / 60) + "m";
    if (diffSec < 86400) return Math.floor(diffSec / 3600) + "h";
    if (diffSec < 2592000) return Math.floor(diffSec / 86400) + "d";
    if (diffSec < 31536000) return Math.floor(diffSec / 2592000) + "mo";
    return Math.floor(diffSec / 31536000) + "y";
  };
  
  /**
   * Format a price value (especially for small crypto prices)
   * @param price - Price to format
   * @returns Formatted price
   */
  export const formatPrice = (price: number): string => {
    if (!price) return "$0";
  
    if (price < 0.000001) {
      return price.toExponential(2);
    }
  
    if (price < 0.01) {
      return price.toFixed(Math.min(8, 2 + Math.abs(Math.floor(Math.log10(price)))));
    }
  
    if (price < 1000) {
      return price.toFixed(Math.max(2, 4 - Math.floor(Math.log10(price))));
    }
  
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  
  /**
   * Format percent change with optional colored HTML span
   * @param value - Percent value
   * @param withColor - Whether to include color HTML
   * @returns Formatted percent change
   */
  export const formatPercentChange = (value: number | null | undefined, withColor: boolean = false): string => {
    if (value === undefined || value === null) return "-";
  
    const formatted = `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  
    if (withColor) {
      const colorClass = value >= 0 ? "text-green-500" : "text-red-500";
      return `<span class="${colorClass}">${formatted}</span>`;
    }
  
    return formatted;
  };
  
  /**
   * Generate a chain logo path from chainId
   * @param chainId - Chain identifier
   * @returns Path to chain logo
   */
  export const getChainLogoPath = (chainId: string): string => {
    const chainMap: Record<string, string> = {
      eth: "ethereum",
      "0x1": "ethereum",
      
      sol: "solana",
      solana: "solana",

      bsc: "solana",
      binance: "binance",

      polygon: "polygon",

      arb: "arbitrum",
      arbitrum: "arbitrum",
      
      optimism: "optimism",
      base: "base",
    };
  
    const chain = chainMap[chainId] || "generic";
    return `/images/chains/${chain}.svg`;
  };
  
  /**
   * Map chainId to a URL path
   * @param chainId - Chain identifier
   * @returns URL path component
   */
  export const chainIdToPath = (chainId: string): string => {
    const chainMap: Record<string, string> = {
        eth: "ethereum",
      "0x1": "ethereum",

      sol: "solana",
      solana: "solana",

      bsc: "bsc",
      binance: "binance",

      polygon: "polygon",

      arb: "arbitrum",
      arbitrum: "arbitrum",

      optimism: "optimism",
      base: "base",
    };
  
    return chainMap[chainId] || chainId;
  };
  
  /**
   * Truncate an address/account string
   * @param address - Full address
   * @param start - Characters to show at start
   * @param end - Characters to show at end
   * @returns Truncated address
   */
  export const truncateAddress = (address: string, start: number = 6, end: number = 4): string => {
    if (!address) return "";
    if (address.length <= start + end) return address;
  
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };
  