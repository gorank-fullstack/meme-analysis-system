export const remoteImage = (url: string | undefined | null): string => {
    // let imgUrl: string = "";
    if (url) {
        // imgUrl = `/api/remote-image?url=${encodeURIComponent(token.icon)}`
        // imgUrl = `/images/remote/${encodeURIComponent(token.icon)}`
        return `${process.env.NEXT_PUBLIC_IMAGE_URL}/api/image?url=${encodeURIComponent(url)}`;
    } else {
        // return "/images/tokens/default-token.svg"
        // return noImgUrl;
    }

    return "";
}


