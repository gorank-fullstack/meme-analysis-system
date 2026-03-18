"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { motion, AnimatePresence } from "framer-motion";
// import { Filter, X } from "lucide-react";
import { TQtType,SUPPORT_QT } from "@gr/interface-base";
import {FilterLine} from "@/components/icons/operate/FilterLine";
import {CloseLine} from "@/components/icons/operate/CloseLine";
// ===============================
// Types
// ===============================
// export type TQtType = "5m" | "1h" | "4h" | "24h";

export interface INumberRange {
  min?: number | "";
  max?: number | "";
}

export interface ICustomFilter {
  qt: TQtType; // 时间段
  changePct: INumberRange; // 涨跌幅(%)
  trades: INumberRange; // 交易笔数
  uniqueTraders: INumberRange; // 独立交易地址数
  volNative: INumberRange; // 成交额(原生币)
  holders: INumberRange; // 持币地址数
  volUSD: INumberRange; // 成交额($)
  mcUSD: INumberRange; // 市值($)
  fdvUSD: INumberRange; // FDV($)
  liqUSD: INumberRange; // 流动性($)
  createdAtSec: INumberRange; // 创建时间(秒)
  hideHighRisk: boolean; // 隐藏高风险代币
  hideStealth: boolean; // 隐藏隐蔽币
}

export interface CustomFilterDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value: ICustomFilter;
  onChange: (next: ICustomFilter) => void;
  onApply?: (v: ICustomFilter) => void; // 点击“筛选”
  onResetToDefault?: () => void; // 点击“重置为默认值”
  buttonClassName?: string; // 用于覆盖触发按钮样式
}

// 默认值
export const DEFAULT_FILTER: ICustomFilter = {
  qt: "1h",
  changePct: {},
  trades: {},
  uniqueTraders: {},
  volNative: {},
  holders: {},
  volUSD: {},
  mcUSD: {},
  fdvUSD: {},
  liqUSD: {},
  createdAtSec: {},
  hideHighRisk: false,
  hideStealth: false,
};

// ===============================
// Helpers
// ===============================
function NumberRangeRow({
  label,
  value,
  onChange,
  placeholderMin = "最小",
  placeholderMax = "最大",
}: {
  label: string;
  value: INumberRange;
  onChange: (v: INumberRange) => void;
  placeholderMin?: string;
  placeholderMax?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 shrink-0 text-sm text-base-content/70">{label}</div>
      <input
        inputMode="decimal"
        className="input input-sm input-bordered w-28 rounded-xl bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
        placeholder={placeholderMin}
        value={value.min ?? ""}
        onChange={(e) => {
          const v = e.target.value.trim();
          onChange({ ...value, min: v === "" ? "" : Number(v) });
        }}
      />
      <span className="text-base-content/40 select-none">—</span>
      <input
        inputMode="decimal"
        className="input input-sm input-bordered w-28 rounded-xl bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
        placeholder={placeholderMax}
        value={value.max ?? ""}
        onChange={(e) => {
          const v = e.target.value.trim();
          onChange({ ...value, max: v === "" ? "" : Number(v) });
        }}
      />
    </div>
  );
}

function SegmentedQT({ value, onChange }: { value: TQtType; onChange: (v: TQtType) => void }) {
//   const items: TQtType[] = ["5m", "1h", "4h", "24h"];
  return (
    <div className="join rounded-xl overflow-hidden shadow-sm">
      {SUPPORT_QT.map((it) => (
        <button
          key={it}
          type="button"
          className={`join-item btn btn-sm rounded-xl ${value === it ? "btn-primary" : "btn-ghost"}`}
          onClick={() => onChange(it)}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

function SwitchRow({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (c: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-base-content/80">{label}</span>
      <Switch.Root
        className="w-12 h-6 bg-base-300/80 rounded-full relative data-[state=checked]:bg-primary focus:outline-none shadow-inner"
        checked={checked}
        onCheckedChange={onCheckedChange}
      >
        <Switch.Thumb className="block w-5 h-5 bg-base-100 rounded-full shadow-md absolute top-0.5 left-0.5 transition-transform data-[state=checked]:translate-x-6" />
      </Switch.Root>
    </div>
  );
}

// ===============================
// Main Component
// ===============================
export default function CustomFilter(props: CustomFilterDrawerProps) {
  const { value, onChange, onApply, onResetToDefault, buttonClassName } = props;
  const [open, setOpen] = React.useState<boolean>(props.open ?? false);

  React.useEffect(() => {
    if (props.open !== undefined) setOpen(props.open);
  }, [props.open]);

  const set = <K extends keyof ICustomFilter>(key: K, v: ICustomFilter[K]) =>
    onChange({ ...value, [key]: v });

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    props.onOpenChange?.(v);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {/* Trigger Button */}
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={
            buttonClassName ??
            "btn btn-sm gap-2 rounded-2xl bg-base-200 hover:bg-base-300/90 active:scale-[0.98] border border-base-300/60 shadow-md transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary/40"
          }
        >
          <FilterLine className="w-4 h-4" />
          筛选
        </button>
      </Dialog.Trigger>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/45 to-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
          </Dialog.Portal>
        )}
      </AnimatePresence>

      {/* Right Drawer */}
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Content asChild>
              <motion.aside
                className="fixed right-0 top-0 h-dvh w-[420px] md:w-[440px] max-w-[90vw] bg-base-100/98 backdrop-blur supports-[backdrop-filter]:bg-base-100/95 shadow-2xl border-l border-base-300 rounded-l-2xl flex flex-col"
                initial={{ x: 420, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 420, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 36 }}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-4 border-b border-base-300 bg-base-100/95 backdrop-blur">
                  <div className="text-base font-semibold">自定义筛选</div>
                  <Dialog.Close asChild>
                    <button className="btn btn-ghost btn-sm btn-circle" aria-label="关闭筛选">
                      <CloseLine className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-5">
                  {/* 时间段 */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-base-content/70">时间段</div>
                    <SegmentedQT value={value.qt} onChange={(v) => set("qt", v)} />
                  </div>

                  <NumberRangeRow label="涨跌幅(%)" value={value.changePct} onChange={(v) => set("changePct", v)} />
                  <NumberRangeRow label="交易笔数" value={value.trades} onChange={(v) => set("trades", v)} />
                  <NumberRangeRow label="独立交易地址数" value={value.uniqueTraders} onChange={(v) => set("uniqueTraders", v)} />
                  <NumberRangeRow label="成交额" value={value.volNative} onChange={(v) => set("volNative", v)} />
                  <NumberRangeRow label="持币地址数" value={value.holders} onChange={(v) => set("holders", v)} />
                  <NumberRangeRow label="成交额($)" value={value.volUSD} onChange={(v) => set("volUSD", v)} />
                  <NumberRangeRow label="市值($)" value={value.mcUSD} onChange={(v) => set("mcUSD", v)} />
                  <NumberRangeRow label="FDV($)" value={value.fdvUSD} onChange={(v) => set("fdvUSD", v)} />
                  <NumberRangeRow label="流动性($)" value={value.liqUSD} onChange={(v) => set("liqUSD", v)} />

                  {/* 创建时间：支持快捷选择 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-32 shrink-0 text-sm text-base-content/70">创建时间(秒)</div>
                      <input
                        inputMode="numeric"
                        className="input input-sm input-bordered w-28 rounded-xl bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="最小"
                        value={value.createdAtSec.min ?? ""}
                        onChange={(e) => {
                          const v = e.target.value.trim();
                          set("createdAtSec", { ...value.createdAtSec, min: v === "" ? "" : Number(v) });
                        }}
                      />
                      <span className="text-base-content/40 select-none">—</span>
                      <input
                        inputMode="numeric"
                        className="input input-sm input-bordered w-28 rounded-xl bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="最大"
                        value={value.createdAtSec.max ?? ""}
                        onChange={(e) => {
                          const v = e.target.value.trim();
                          set("createdAtSec", { ...value.createdAtSec, max: v === "" ? "" : Number(v) });
                        }}
                      />
                      <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-xs rounded-md">快捷</button>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                          <li>
                            <button
                              onClick={() => {
                                const now = Math.floor(Date.now() / 1000);
                                set("createdAtSec", { min: now - 86400, max: now });
                              }}
                            >最近24小时</button>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                const now = Math.floor(Date.now() / 1000);
                                set("createdAtSec", { min: now - 7 * 86400, max: now });
                              }}
                            >最近7天</button>
                          </li>
                          <li>
                            <button onClick={() => set("createdAtSec", {})}>清空</button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <SwitchRow label="隐藏高风险代币" checked={value.hideHighRisk} onCheckedChange={(c) => set("hideHighRisk", !!c)} />
                  <SwitchRow label="隐藏隐蔽币(stealth)" checked={value.hideStealth} onCheckedChange={(c) => set("hideStealth", !!c)} />
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 z-10 px-4 sm:px-5 py-3 border-t border-base-300 bg-base-100/95 backdrop-blur flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="btn btn-sm rounded-xl"
                    onClick={() => onResetToDefault?.()}
                  >
                    重置为默认值
                  </button>

                  <div className="flex items-center gap-2">
                    <Dialog.Close asChild>
                      <button type="button" className="btn btn-sm rounded-xl" onClick={() => handleOpenChange(false)}>取消</button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary rounded-xl shadow-md"
                        onClick={() => onApply?.(value)}
                      >
                        筛选
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

// ===============================
// Usage Example
// ===============================
export function FilterButtonDemo() {
  const [filter, setFilter] = React.useState<ICustomFilter>(DEFAULT_FILTER);

  return (
    <div className="p-4">
      <CustomFilter
        value={filter}
        onChange={setFilter}
        onApply={(v) => {
          // TODO: 调用你的数据请求/刷新逻辑
          console.log("apply filter:", v);
        }}
        onResetToDefault={() => setFilter(DEFAULT_FILTER)}
      />
    </div>
  );
}
