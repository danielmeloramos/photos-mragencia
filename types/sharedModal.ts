import { image } from "./image"

type sharedModal = {
    index: number
    images ?: image[]
    currentPhoto ?: image
    changePhotoId: (newVal: number) => void
    closeModal: () => void
    navigation: boolean
    direction ?: number
}

export type { sharedModal }