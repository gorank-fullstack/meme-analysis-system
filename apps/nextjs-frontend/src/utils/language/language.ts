/* import { NextResponse, NextRequest } from "next/server"; */
import { language_const } from "@/config/theme_language_constants";


export function getLocalLangage(userLanguage: string): string {

    if (userLanguage) {
        console.log('langLine=', userLanguage);

        // let isCorrect=false;
        //返似语言，修正
        if (userLanguage.startsWith(language_const.en_us_head)) {
            return language_const.language_en_us_key;
            // isCorrect=true;
        } else if (userLanguage.startsWith(language_const.zh_cn_head)) {
            return language_const.language_zh_cn_key;
            //isCorrect=true;
        }

        if (language_const.en_us_list.includes(userLanguage)) {
            return language_const.language_en_us_key;
            // isCorrect=true;
        } else if (language_const.zh_cn_list.includes(userLanguage)) {
            return language_const.language_zh_cn_key;
            // isCorrect=true;
        }

        return userLanguage;
    } else {
        //无效语言，返回默认值
        return language_const.default_language_name;
    }
}


/* export function getLocaleLang(request: NextRequest) {
    // 获取请求头的语言偏好
    const accpetLanguage: string | null = request.headers.get('accept-language');
    if (accpetLanguage) {

        console.log('accpetLanguage=', accpetLanguage);
        const parts = accpetLanguage.split(';');
        //获取浏览器第一个语言偏好
        return parts[0].split(',')[0];
    }
    //获取不到语言偏好，返回默认语言
    return language_const.default_language;
} */