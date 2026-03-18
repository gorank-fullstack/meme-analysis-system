// tailwind-safelist.ts
// ✅ Tailwind v4 safelist 注释指令（用于保留动态类名）

/* @source inline(
  "bg-dex-bg-primary bg-dex-bg-secondary bg-dex-bg-tertiary bg-dex-bg-highlight"
) */
/* @source inline(
  "text-dex-text-primary text-dex-text-secondary text-dex-text-tertiary"
) */
/* @source inline("border-dex-border") */
/* @source inline("bg-dex-blue text-white") */
/* @source inline("text-dex-green text-dex-red") */
/* @source inline("hover:bg-dex-bg-highlight") */

// ✅ 额外：如果你后续用了 tailwind 的 text-* 或 bg-* 组合色，也可以继续加
/* @source inline("text-green-200 text-green-300 text-green-400 text-green-500 text-green-600") */
/* @source inline("text-red-200 text-red-300 text-red-400 text-red-500 text-red-600") */
/* @source inline("text-pink-200 text-pink-300 text-pink-400 text-pink-500 text-pink-600") */
/* @source inline("text-gray-200 text-gray-300 text-gray-400 text-gray-500 text-gray-600") */

/* 
📦 Tailwind 会怎么处理？
Tailwind 会扫描项目中所有包含在 tailwind.config.ts → content 字段里的文件；
它看到你这个文件里有注释 @source inline(...)；
就会 保留这些类名，不会被 purge 掉，即使你没在页面中显式使用。
 */

