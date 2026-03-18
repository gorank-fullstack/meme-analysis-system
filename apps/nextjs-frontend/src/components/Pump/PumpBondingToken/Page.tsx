import React from "react";
import Image from "next/image";

import {
    //---- Pump Bonding ----
    ISplPumpBondingToken,
// } from "@/interface/mo_spl";
} from "@gr/interface-api/platform-data";
import { remoteImage } from "@/utils/remote_image";
/* type BondingToken = {
    logo?: string | null;
    symbol: string;
    name: string;
    priceUsd: number;
    liquidity: number;
    fullyDilutedValuation: number;
    bondingCurveProgress?: number;
}; */

interface IPumpBondingTokenProps {
    token: ISplPumpBondingToken;
    formatPrice: (value: number | string) => string;
    formatNumber: (value: number | string) => string;
    onClick: () => void;
};

export const PumpBondingToken = ({ token, formatPrice, formatNumber, onClick }: IPumpBondingTokenProps) => {
    /* const progressBlueColor = (): string => {
        const progress = token.bondingCurveProgress ?? 0;
        if (progress < 33) return "from-blue-500 to-blue-700";
        if (progress < 66) return "from-blue-500 to-indigo-500";
        return "from-indigo-500 to-purple-600";
    }; */

    const progressAmberColor = (): string => {
        const progress = token.bondingCurveProgress ?? 0;
        /* if (progress < 33) return "from-amber-600 to-amber-800";
        if (progress < 66) return "from-amber-600 to-orange-600";
        return "from-orange-600 to-red-300"; */
        /* if (progress < 33) return "from-red-400 to-amber-600";
        if (progress < 66) return "from-red-400 to-orange-600";
        return "from-orange-600 to-yellow-600";  */
        if (progress < 33) return "from-red-400 to-amber-600";
        if (progress < 66) return "from-red-400 to-orange-600";
        return "from-yellow-600 to-orange-600";
    };

    if(!token.logo)
    {
        token.logo = `https://dd.dexscreener.com/ds-data/tokens/solana/${token.tokenAddress}.png`;
    }
    
    return (
        <div
            /* className="bg-dex-bg-secondary rounded-lg overflow-hidden border border-dex-border cursor-pointer transition-all hover:border-blue-500" */
            className="bg-dex-bg-secondary rounded-lg overflow-hidden border border-dex-border cursor-pointer transition-all hover:border-amber-600"
            
            onClick={onClick}
        >
            <div className="p-4">
                <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-800 mr-3 flex items-center justify-center overflow-hidden">
                        {/* {token.logo ? (
                            <img
                                src={token.logo}
                                alt={token.symbol}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzFjMzU2NCIvPjwvc3ZnPg==";
                                }}
                            />
                        ) : (
                            <span className="text-white font-bold">
                                {token.symbol?.charAt(0) ?? "?"}
                            </span>
                        )} */}
                        {token.logo && (
                            <Image
                                src={remoteImage(token.logo) || "/images/tokens/default-token.svg"}
                                alt={token.symbol}
                                width={40} height={40}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzFjMzU2NCIvPjwvc3ZnPg==";
                                }}
                            />)}
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
                        <p className="text-xs text-dex-text-secondary">{/* Progress */}进度</p>
                        <p className="font-medium text-white">
                            {Math.round(token.bondingCurveProgress ?? 0)}%
                        </p>
                    </div>
                </div>

                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        /* className={`h-full rounded-full bg-linear-to-r ${progressBlueColor()}`} */
                        className={`h-full rounded-full bg-linear-to-r ${progressAmberColor()}`}                        
                        style={{ width: `${token.bondingCurveProgress ?? 0}%` }}
                    ></div>
                </div>

                {/* <div className="mt-2 text-xs bg-blue-900/30 text-blue-400 py-1 px-2 rounded-full inline-block"> */}
                <div className="mt-2 text-xs bg-amber-900/30 text-amber-600 py-1 px-2 rounded-full inline-block">
                    {/* Bonding Curve:  */}
                    已打进度&nbsp;&nbsp;
                    {Math.round(token.bondingCurveProgress ?? 0)}%
                </div>
            </div>
        </div>
    );
}

