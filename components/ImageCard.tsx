import { CldImage } from 'next-cloudinary'
import { ImageProps } from 'utils/types'
import { useCallback } from 'react'

type Props = ImageProps & {
  lastViewedPhoto: string | null
  lastViewedPhotoRef: React.MutableRefObject<HTMLDivElement | null>
  isSelected?: boolean
  onSelect?: (id: string) => void
  isSelectionMode?: boolean
}

export default function ImageCard({
  id,
  public_id,
  blurDataUrl,
  lastViewedPhoto,
  lastViewedPhotoRef,
  onSelect,
  isSelected,
}: Props) {
  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation()
      onSelect?.(public_id)
    },
    [public_id, onSelect]
  )

  return (
    <div
      ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
      className="group relative w-full overflow-hidden rounded-xl bg-gray-100 transition-shadow hover:shadow-lg"
    >
      {/* Checkbox for selection */}
      <div className="absolute right-3 top-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheck}
          className="h-6 w-6 cursor-pointer rounded accent-blue-500"
        />
      </div>

      {/* Image */}
      <CldImage
        alt="Football photo"
        className="h-full w-full object-cover brightness-90 transition-transform duration-300 group-hover:brightness-100 group-hover:scale-105"
        placeholder="blur"
        blurDataURL={blurDataUrl}
        src={public_id}
        width={400} // Aumentado para melhor qualidade no mobile
        height={400}
        crop="fill"
        format="webp"
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />

      {/* Selected overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/30 transition-opacity" />
      )}
    </div>
  )
}