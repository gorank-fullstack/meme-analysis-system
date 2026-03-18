import React, { SVGProps } from 'react'

export function StockLine(props: SVGProps<SVGSVGElement>) {
    // 来源：https://icones.js.org/collection/ri
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Remix Icon by Remix Design - https://github.com/Remix-Design/RemixIcon/blob/master/License */}<path fill="currentColor" d="M8.005 5.003h3v9h-3v3h-2v-3h-3v-9h3v-3h2zm-3 2v5h4v-5zm13 3h3v9h-3v3h-2v-3h-3v-9h3v-3h2zm-3 2v5h4v-5z" /></svg>
  )
}
