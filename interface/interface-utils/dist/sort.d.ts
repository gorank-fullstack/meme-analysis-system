/**
* 获取嵌套对象中的值，支持 string (包括string 类型的：数值、时间) 和 number 类型
* @param obj 要读取的对象
* @param path 例如 "info.name" 或 "stats.volume"
* @param defaultValue 默认返回值，默认是空字符串
*/
export declare const getNestedValue: (obj: Record<string, any>, path: string, defaultValue?: string | number) => string | number;
export declare const getNestedValue_Old1_Del: (obj: Record<string, any>, path: string, defaultValue?: string | number) => string | number;
export declare const getNestedValue_Old2_Del: (obj: Record<string, any>, path: string, defaultValue?: string | number) => string | number;
