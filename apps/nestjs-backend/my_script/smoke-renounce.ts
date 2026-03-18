// scripts/smoke-renounce.ts
type T3State = -1 | 0 | 1;

export const EVM_ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
export const EVM_ADDRESS_DEAD = '0x000000000000000000000000000000000000dead';

const isNullish = (v: unknown): v is null | undefined => v == null;
const toLowerTrim = (s: string) => (s ?? '').toString().trim().toLowerCase();

export function is_GpEvm_OwnershipRenounced_v2(owner_address: string | null | undefined): T3State {
  if (isNullish(owner_address)) return -1;
  const addr = toLowerTrim(owner_address);
  if (addr === '' || addr === EVM_ADDRESS_ZERO || addr === EVM_ADDRESS_DEAD) return 1;
  return 0;
}

// --- smoke ---
([
  { addr: null, expect: -1 },
  { addr: undefined, expect: -1 },
  { addr: '', expect: 1 },
  { addr: '0x0000000000000000000000000000000000000000', expect: 1 },
  { addr: '0x000000000000000000000000000000000000dEaD', expect: 1 },
  { addr: '0x4f26ffbe5f04ed43630fdc30a87638d53d0b0876', expect: 0 },
] as const).forEach(t => {
  const got = is_GpEvm_OwnershipRenounced_v2(t.addr as any);
  if (got !== t.expect) {
    console.error('renounce mismatch:', t.addr, 'got', got, 'expect', t.expect);
    process.exitCode = 1;
  }
});
console.log('✅ smoke done');
