import React, { SVGProps } from 'react'

//不增加扩展属性版
export function ChevronRight(props: SVGProps<SVGSVGElement>) {
  // 来源：https://icones.js.org/collection/mingcute
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

//增加:size扩展属性版
interface CustomProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// export function ChevronRight(props: SVGProps<SVGSVGElement>) {
export function ChevronRight_Custom({ size = 24, ...props }: CustomProps) {
  // 来源：https://icones.js.org/collection/mingcute
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

