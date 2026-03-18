import React, { useState } from "react";
import {
    AVAILABLE_METRICS,
    TIME_FRAMES,
    OPERATORS,
    CHAINS,
} from "@/utils/filter/filters";

// import {  Option} from "@/interface/filters";
import { FilterItem, SortBy } from "@/interface/filters";
import { FilterCondition } from "./FilterCondition/Page"; // 确保你已用 TS 重写
import { SortBySelector } from "./SortBySelector/Page";   // 确保你已用 TS 重写



/* interface FilterItem {
  id: number;
  metric: string;
  timeFrame: string;
  operator: string;
  value: string;
}

interface SortBy {
  metric: string;
  timeFrame: string;
  type: "ASC" | "DESC";
} */

interface FiltersModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onApplyFilters: (data: any[]) => void;
}

export const FiltersModal = ({ isOpen, onClose, onApplyFilters }: FiltersModalProps) => {
    const [chain, setChain] = useState<string>("0x1");
    const [filters, setFilters] = useState<FilterItem[]>([
        {
            id: 1,
            metric: "experiencedBuyers",
            timeFrame: "oneMonth",
            operator: "gt",
            value: "10",
        },
    ]);
    const [sortBy, setSortBy] = useState<SortBy>({
        metric: "experiencedBuyers",
        timeFrame: "oneMonth",
        type: "DESC",
    });
    const [limit, setLimit] = useState<number>(20);

    const addFilter = () => {
        const newId = filters.length > 0 ? Math.max(...filters.map((f) => f.id)) + 1 : 1;
        setFilters([
            ...filters,
            {
                id: newId,
                metric: "experiencedBuyers",
                timeFrame: "oneMonth",
                operator: "gt",
                value: "10",
            },
        ]);
    };

    const removeFilter = (id: number) => {
        setFilters(filters.filter((filter) => filter.id !== id));
    };

    const updateFilter = (id: number, field: keyof FilterItem, value: string) => {
        setFilters(
            filters.map((filter) =>
                filter.id === id ? { ...filter, [field]: value } : filter
            )
        );
    };

    const applyFilters = async () => {
        try {
            const formattedFilters = filters.map(
                ({ metric, timeFrame, operator, value }) => ({
                    metric,
                    timeFrame,
                    [operator]: value,
                })
            );

            const payload = {
                chain,
                filters: formattedFilters,
                sortBy,
                timeFramesToReturn: [
                    "tenMinutes",
                    "oneHour",
                    "fourHours",
                    "twelveHours",
                    "oneDay",
                    "oneWeek",
                    "oneMonth",
                ],
                metricsToReturn: [
                    "holders",
                    "buyers",
                    "sellers",
                    "netBuyers",
                    "volumeUsd",
                    "buyVolumeUsd",
                    "sellVolumeUsd",
                    "marketCap",
                    "fullyDilutedValuation",
                    "usdPricePercentChange",
                    "liquidityChangeUSD",
                ],
                limit,
            };

            const response = await fetch(
                "https://deep-index.moralis.io/api/v2.2/discovery/tokens",
                {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY as string,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const transformedData = data.map((item: any) => {
                const metrics = item.metrics || {};
                return {
                    chainId: item.metadata.chainId,
                    tokenAddress: item.metadata.tokenAddress,
                    name: item.metadata.name,
                    symbol: item.metadata.symbol,
                    decimals: item.metadata.decimals,
                    logo: item.metadata.logo,
                    usdPrice: item.metadata.usdPrice || 0,
                    createdAt: item.metadata.blockNumberMinted || Math.floor(Date.now() / 1000 - 86400),
                    marketCap: parseFloat(item.metadata.marketCap || 0),
                    liquidityUsd: parseFloat(item.metadata.fullyDilutedValue || 0) * 0.1,
                    holders: parseInt(item.metadata.totalSupply || 0),
                    pricePercentChange: {
                        "1h": metrics.usdPricePercentChange?.oneHour || 0,
                        "4h": metrics.usdPricePercentChange?.fourHours || 0,
                        "12h": metrics.usdPricePercentChange?.twelveHours || 0,
                        "24h": metrics.usdPricePercentChange?.oneDay || 0,
                    },
                    totalVolume: {
                        "1h": metrics.volumeUsd?.oneHour || 0,
                        "4h": metrics.volumeUsd?.fourHours || 0,
                        "12h": metrics.volumeUsd?.twelveHours || 0,
                        "24h": metrics.volumeUsd?.oneDay || 0,
                    },
                    transactions: {
                        "1h": (metrics.buyVolumeUsd?.oneHour || 0) + (metrics.sellVolumeUsd?.oneHour || 0),
                        "4h": (metrics.buyVolumeUsd?.fourHours || 0) + (metrics.sellVolumeUsd?.fourHours || 0),
                        "12h": (metrics.buyVolumeUsd?.twelveHours || 0) + (metrics.sellVolumeUsd?.twelveHours || 0),
                        "24h": (metrics.buyVolumeUsd?.oneDay || 0) + (metrics.sellVolumeUsd?.oneDay || 0),
                    },
                    buyers: {
                        "1h": metrics.buyers?.oneHour || 0,
                        "4h": metrics.buyers?.fourHours || 0,
                        "12h": metrics.buyers?.twelveHours || 0,
                        "24h": metrics.buyers?.oneDay || 0,
                    },
                    sellers: {
                        "1h": metrics.sellers?.oneHour || 0,
                        "4h": metrics.sellers?.fourHours || 0,
                        "12h": metrics.sellers?.twelveHours || 0,
                        "24h": metrics.sellers?.oneDay || 0,
                    },
                };
            });

            onApplyFilters(transformedData);
            onClose();
        } catch (error) {
            console.error("Error applying filters:", error);
            alert("Error applying filters. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            onClick={onClose}
        >
            <div
                className="bg-dex-bg-secondary rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-dex-border flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-dex-text-primary">
                        Advanced Filters
                    </h2>
                    <button
                        className="text-dex-text-secondary hover:text-dex-text-primary"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto p-6 max-h-[calc(90vh-70px)]">
                    {/* Chain Selection */}
                    <div className="mb-6">
                        <label className="block text-dex-text-secondary uppercase text-sm font-semibold mb-2">
                            Chain
                        </label>
                        <select
                            className="w-full px-3 py-2 bg-dex-bg-tertiary border border-dex-border rounded text-dex-text-primary"
                            value={chain}
                            onChange={(e) => setChain(e.target.value)}
                        >
                            {CHAINS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Conditions */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-dex-text-secondary uppercase text-sm font-semibold">
                                Filter Conditions
                            </label>
                            <button
                                className="px-2 py-1 bg-dex-blue text-white rounded text-sm"
                                onClick={addFilter}
                            >
                                + Add Condition
                            </button>
                        </div>
                        {filters.length === 0 ? (
                            <div className="bg-dex-bg-tertiary rounded-lg p-4 text-center text-dex-text-secondary">
                                No filter conditions. Add one to get started.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filters.map((filter) => (
                                    <FilterCondition
                                        key={filter.id}
                                        filter={filter}
                                        metrics={AVAILABLE_METRICS}
                                        timeFrames={TIME_FRAMES}
                                        operators={OPERATORS}
                                        onUpdate={(field, value) => updateFilter(filter.id, field, value)}
                                        onRemove={() => removeFilter(filter.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort By */}
                    <div className="mb-6">
                        <label className="block text-dex-text-secondary uppercase text-sm font-semibold mb-2">
                            Sort By
                        </label>
                        <SortBySelector
                            sortBy={sortBy}
                            metrics={AVAILABLE_METRICS}
                            timeFrames={TIME_FRAMES}
                            onChange={setSortBy}
                        />
                    </div>

                    {/* Limit */}
                    <div className="mb-6">
                        <label className="block text-dex-text-secondary uppercase text-sm font-semibold mb-2">
                            Number of Results
                        </label>
                        <select
                            className="w-full px-3 py-2 bg-dex-bg-tertiary border border-dex-border rounded text-dex-text-primary"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            {[10, 20, 50, 100].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-dex-border flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 bg-dex-bg-tertiary text-dex-text-primary rounded hover:bg-dex-bg-highlight"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-dex-blue text-white rounded hover:bg-blue-600"
                        onClick={applyFilters}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};
