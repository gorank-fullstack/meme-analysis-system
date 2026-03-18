// app/token/[tokenAddress]/layout.tsx
import React from 'react';

export default function TokenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Evm/Sol Token Details</h1>
      {children}
    </div>
  );
}
