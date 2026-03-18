import React, { ChangeEvent } from "react";
// import { Option } from "@/constants/filters"; // 确保已有 Option 类型定义
import {SortBy, SortBySelectorProps} from "@/interface/filters";



export const SortBySelector = ({
  sortBy,
  metrics,
  timeFrames,
  onChange,
}: SortBySelectorProps) => {
  const handleChange = (field: keyof SortBy, value: string) => {
    onChange({
      ...sortBy,
      [field]: value,
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Metric Selector */}
      <div className="flex-1 min-w-[180px]">
        <select
          className="w-full px-3 py-2 bg-dex-bg-tertiary border border-dex-border rounded text-dex-text-primary"
          value={sortBy.metric}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleChange("metric", e.target.value)
          }
        >
          {metrics.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time Frame Selector */}
      <div className="flex-1 min-w-[180px]">
        <select
          className="w-full px-3 py-2 bg-dex-bg-tertiary border border-dex-border rounded text-dex-text-primary"
          value={sortBy.timeFrame}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleChange("timeFrame", e.target.value)
          }
        >
          {timeFrames.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Type Selector */}
      <div className="flex-1 min-w-[180px]">
        <select
          className="w-full px-3 py-2 bg-dex-bg-tertiary border border-dex-border rounded text-dex-text-primary"
          value={sortBy.type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleChange("type", e.target.value as SortBy["type"])
          }
        >
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
      </div>
    </div>
  );
};
