import { ENTITY_FILE_NAMES } from "@/config/entity_const";

export function getEntityLogoPath(
    localPrefix: string, // 默认前缀
    url: string,
    // ): string | null {
): string {
    //   if (!url) return null;
    if (!url) return "";
    try {
        const filename = url.split("/").pop() || "";
        if (ENTITY_FILE_NAMES.includes(filename)) {
            return `${localPrefix}/${filename}`;
        }
        return url;
    } catch {
        // return url ?? null;
        return url ?? "";
    }
}
