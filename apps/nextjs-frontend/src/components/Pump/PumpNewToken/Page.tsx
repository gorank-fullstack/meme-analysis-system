import Image from "next/image";

import React, { useState, useEffect } from "react";
import {
  //---- Pump New ----
  ISplPumpNewToken,
  // } from "@/interface/mo_spl";
} from "@gr/interface-api/platform-data";
import { remoteImage } from "@/utils/remote_image";
/* type NewToken = {
  logo?: string | null;
  symbol: string;
  name: string;
  priceUsd: number;
  liquidity: number;
  fullyDilutedValuation: number;
  createdAt: string | number | Date;
  isNew: boolean;
}; */

//从原有的:ISplPumpNewToken扩展出一个新的可选字段:isNew?: boolean;
export interface ExtISplPumpNewToken extends ISplPumpNewToken {
  isNew?: boolean;
}
interface IPumpNewTokenProps {
  // token: NewToken;
  // token: ISplPumpNewToken;
  token: ExtISplPumpNewToken;
  // Gpt解释:formatPrice 是一个函数，可以接受 number 或 string 类型的参数 value，并返回一个 string 类型的结果。
  formatPrice: (value: number | string) => string;
  formatNumber: (value: number | string) => string;
  formatTimeAgo: (date: string | number | Date) => string;
  onClick: () => void;
};

export const PumpNewToken = ({
  token,
  formatPrice,
  formatNumber,
  formatTimeAgo,
  onClick,
}: IPumpNewTokenProps) => {
  const [isVisible, setIsVisible] = useState(!token.isNew);

  useEffect(() => {
    if (token.isNew) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [token.isNew]);

  if (!token.logo) {
    token.logo = `https://dd.dexscreener.com/ds-data/tokens/solana/${token.tokenAddress}.png`;
  }

  return (
    <div
      className={`bg-dex-bg-secondary rounded-lg overflow-hidden border border-dex-border cursor-pointer transition-all duration-500 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        /* } hover:border-green-500 ${token.isNew ? "animate-pulse-green" : ""}`} */
      } hover:border-amber-300 ${token.isNew ? "animate-pulse-amber" : ""}`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-green-800 mr-3 flex items-center justify-center overflow-hidden">
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
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzJmNGEyNSIvPjwvc3ZnPg==";
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
            <p className="text-xs text-dex-text-secondary">{/* Created */}时间</p>
            <p className="font-medium text-white">
              {formatTimeAgo(token.createdAt)}
            </p>
          </div>
        </div>

        {/* <div className="text-xs bg-green-900/30 text-green-400 py-1 px-2 rounded-full inline-block"> */}
        <div className="text-xs bg-green-900/30 text-amber-300 py-1 px-2 rounded-full inline-block">
          {/* New Token */}
          新 币
        </div>
      </div>
    </div>
  );
}
