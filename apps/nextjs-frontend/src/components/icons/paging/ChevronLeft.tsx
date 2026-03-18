import React, { SVGProps } from 'react'

//不增加扩展属性版
export function ChevronLeft(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"
            {...props}
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

//增加:size扩展属性版
interface CustomProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

export function ChevronLeft_Custom({ size = 24, ...props }: CustomProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"
            {...props}
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}
