import type { Config } from "tailwindcss";
// import type { Config } from "tailwindcss/types/config";
// import { themes as daisyThemes } from "daisyui/src/theming/themes"; // ✅ v4中仍可这样导入
// import daisyThemes from "daisyui/src/theming/themes";

const config: Config = {
  // darkMode: 'class', // ⭐ 关键项，不能漏
  darkMode: 'class', // ✅ 强制按 class 控制暗色，而不是系统偏好
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/**/*.{css}",                       // ✅ 或者加全局 css 匹配
  ],
  // 注意：不再是 theme.extend，而是直接使用 extend
  theme: {
    extend: {
      colors: {
        // 将你在 globals.css 中的 CSS 变量映射为 Tailwind className
        background: "var(--background)",
        foreground: "var(--foreground)",
        "dex-bg-primary": "var(--color-bg-primary)",
        "dex-bg-secondary": "var(--color-bg-secondary)",
        "dex-bg-tertiary": "var(--color-bg-tertiary)",
        "dex-bg-highlight": "var(--color-bg-highlight)",
        "dex-text-primary": "var(--color-text-primary)",
        "dex-text-secondary": "var(--color-text-secondary)",
        "dex-text-tertiary": "var(--color-text-tertiary)",
        "dex-border": "var(--color-border)",
        "dex-green": "var(--color-green)",
        "dex-red": "var(--color-red)",
        "dex-blue": "var(--color-blue)",
      },
    },
  },
};

export default config;
