import React from "react";
import Image from "next/image";

import {
  //---- Pump Graduated ----
  ISplPumpGraduatedToken,
  // } from "@/interface/mo_spl";
} from "@gr/interface-api/platform-data";
import { remoteImage } from "@/utils/remote_image";
/* type GraduatedToken = {
  logo?: string | null;
  symbol: string;
  name: string;
  priceUsd: number;
  liquidity: number;
  fullyDilutedValuation: number;
  graduatedAt: string | number | Date;
}; */

interface IPumpGraduatedTokenProps {
  token: ISplPumpGraduatedToken;
  formatPrice: (value: number | string) => string;
  formatNumber: (value: number | string) => string;
  formatTimeAgo: (date: string | number | Date) => string;
  onClick: () => void;
};

export const PumpGraduatedToken = ({
  token,
  formatPrice,
  formatNumber,
  formatTimeAgo,
  onClick,
}: IPumpGraduatedTokenProps) => {

  if (!token.logo) {
    token.logo = `https://dd.dexscreener.com/ds-data/tokens/solana/${token.tokenAddress}.png`;
  }

  return (
    <div
      /* className="bg-dex-bg-secondary rounded-lg overflow-hidden border border-dex-border cursor-pointer transition-all hover:border-purple-500" */
      className="bg-dex-bg-secondary rounded-lg overflow-hidden border border-dex-border cursor-pointer transition-all hover:border-pink-500"
      
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-purple-800 mr-3 flex items-center justify-center overflow-hidden">
            {token.logo ? (
              <Image
                src={remoteImage(token.logo) || "/images/tokens/default-token.svg"}
                alt={token.symbol}
                width={40} height={40}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzQzMmE3NCIvPjwvc3ZnPg==";
                }}
              />
            ) : (
              <span className="text-white font-bold">
                {token.symbol?.charAt(0) ?? "?"}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-white">{token.symbol}</h3>
            <p className="text-sm text-dex-text-secondary truncate max-w-[200px]">
              {token.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-dex-text-secondary">{/* Price */}价格</p>
            <p className="font-medium text-white">{formatPrice(token.priceUsd)}</p>
          </div>
          <div>
            <p className="text-xs text-dex-text-secondary">{/* Liquidity */}流动性</p>
            <p className="font-medium text-white">{formatNumber(token.liquidity)}</p>
          </div>
          <div>
            <p className="text-xs text-dex-text-secondary">{/* FDV */}市值</p>
            <p className="font-medium text-white">
              {formatNumber(token.fullyDilutedValuation)}
            </p>
          </div>
          <div>
            <p className="text-xs text-dex-text-secondary">{/* Graduated */}迁移时间</p>
            <p className="font-medium text-white">
              {formatTimeAgo(token.graduatedAt)}
            </p>
          </div>
        </div>

        {/* <div className="text-xs bg-purple-900/30 text-purple-400 py-1 px-2 rounded-full inline-block"> */}
        <div className="text-xs bg-pink-900/30 text-pink-500 py-1 px-2 rounded-full inline-block">
        
          {/* Graduated Token */}
          已经迁移
        </div>
      </div>
    </div>
  );
}

