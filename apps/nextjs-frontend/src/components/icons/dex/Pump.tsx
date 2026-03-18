'use client';

import Image from 'next/image';
import * as React from 'react';

// 不允许外部传入 src，手动移除它
// interface PumpLogoProps extends React.ComponentProps<typeof Image> {}
// type PumpLogoProps = Omit<React.ComponentProps<typeof Image>, 'src'>;  //手动移除：src alt
type PumpLogoProps = Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>;
export const Pump = (props: PumpLogoProps) => {
  return (
    <Image
      src="/icon/pump.webp"   // 图片路径，确保在 public/images 下存在
      alt=""
      // alt="BSC Logo"
      width={64}                // 可自定义大小
      height={64}
      {...props}
    />
  );
};
