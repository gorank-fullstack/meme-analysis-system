import {daisyui_themes_min} from "@/utils/styles/daisyui/theme_min";
export const getThemeColorScheme = (theme: string): "dark" | "light" => {
    const obj = daisyui_themes_min[theme as keyof typeof daisyui_themes_min];
    return obj?.["color-scheme"] === "dark" ? "dark" : "light";
  };