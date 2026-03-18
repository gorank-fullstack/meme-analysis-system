import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    tailwindcss(),      // ✅ 这才是真正注册 Tailwind 插件
    autoprefixer(),
  ],
};