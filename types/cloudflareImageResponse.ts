import { cloudflareImages } from "./cloudflareImages"

type cloudflareImageResponse = {
    imgs: cloudflareImages[],
    nextCursor: string,
    hasMore: boolean
}

export type { cloudflareImageResponse }