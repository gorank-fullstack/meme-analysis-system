export type TThemeSeries = "dark_series" | "light_series";
export type TThemeColorScheme = "dark" | "light";
// const defaultThemeSeries: TThemeSeries = "dark_series"; //  限制类型
const defaultThemeColorScheme: TThemeColorScheme = "dark"; //  限制类型

export const theme_const = {
    theme_key: "theme_name",
    theme_slice_name: "theme",
    /* 默认主题 */
    default_theme_name: "dark",

    // 这样，能实现：限制取值范围的同时，有默认值
    default_color_scheme: defaultThemeColorScheme,

    /* 可选主题 */
    /* 注意，改变可选主题，需要同时修改：ui_const中的：
    dark_series_theme[]、light_series_theme[]
    和　globals.css　配置文件．保致可选主题一致 */
    // optional_themes: ["light", "dark", "cyberpunk", "luxury", "night", "lemonade", "coffee", "winter", "retro", "valentine"],
    /* 2025 GPT主题对比：
    synthwave vs aqua ,结果：synthwave 胜
    cyberpunk、valentine、retro ,结果：retro (推荐 1) > cyberpunk(推荐 2) > valentine(不推荐)
     */
    /* optional_themes: [
        "light", "dark", "synthwave", "retro", "cyberpunk",
        "valentine", "aqua", "cupcake", "lemonade",
        "luxury", "night", "coffee", "winter", "business",
        "halloween", "forest",
        "emerald", "black", "sunset"
    ], */
    optional_themes: [
        "light", "dark", "synthwave"
    ],

    //深色系列--文字颜色
    dark_series_font_color: "#ffffff",
    //浅色系列--文字颜色
    light_series_font_color: "#000000",

    //深色系列--主题
    // dark_series_theme: ["dark",  "luxury", "night","coffee"],
    //浅色系列--主题
    // light_series_theme: ["light","cyberpunk", "lemonade",  "winter", "retro", "valentine"],
}

export const language_const = {
    language_key: "lang",
    language_slice_name: "language",
    /* 语言--key */
    language_en_us_key: "en-US",
    language_zh_cn_key: "zh-CN",
    language_ko_key: "ko",
    language_ja_key: "ja",

    /* 语言--text */
    language_en_us_text: "English",
    language_zh_cn_text: "中文（简体）",
    language_ko_text: "한국어",
    language_ja_text: "日本語",

    /* 默认--命名空间，用于加载.json文件 */
    default_name_space: "lang",
    /* 默认--语言 */
    default_language_name: "en-US",
    /* 可选语言 */
    /* optional_languages_key:["en-US","zh-CN","ko","ja"], //注意：此列表需要和： language_**_key　的值，保持一致
    optional_languages_text:["English","中文（简体）","한국어","日本語"], //注意：此列表需要和： language_**_text　的值，保持一致 */
    optional_languages_key_text: [
        ["en-US", "English"],
        ["zh-CN", "中文（简体）"],
        ["ko", "한국어"],
        ["ja", "日本語"]], //注意：此列表需要和： language_**_key、language_**_text　的值，保持一致


    // 定义一个键为string类型，值为number类型的Map
    /* myMap : new Map([
        ["key1", "value1"],
        ["key2", "value2"]
      ]), */
    /* optional_languages_map:new Map<string,string> = new Map([
        ['one', '1'],
        ['two', '2'],
        ['three', '3']
      ]); */
    optional_languages_map: new Map<string, string>([
        ["en-US", "English"],
        ["zh-CN", "中文（简体）"],
        ["ko", "한국어"],
        ["ja", "日本語"],
    ]), //注意：此列表需要和： language_**_key、language_**_text　的值，保持一致

    /* 返似：英文匹配 */
    en_us_list: ["en"],  /* 如果匹配不到，en-US,匹配到：en，也算是en-US */
    en_us_head: "en-",   /* 如果是： “en-开头”,也算是：en-US */

    /* 返似：中文匹配 */
    zh_cn_list: ["zh"],  /* 如果匹配不到，zh-CN,zh，匹配到：zh，也算是zh-CN */
    zh_cn_head: "zh-",   /* 如果是： “zh-开头”,也算是：zh-CN */
}
