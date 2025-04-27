import { CldImage } from 'next-cloudinary'
import { useCallback } from 'react'
import { image } from 'types'

type Props = image & {
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
      className="group relative w-full overflow-hidden rounded-xl transition-shadow hover:shadow-lg bg-img-background-light dark:bg-img-background-dark"
    >
      {/* Checkbox for selection */}
      {isSelected && <div className="absolute left-3 top-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheck}
          className="h-6 w-6 cursor-pointer rounded accent-blue-500"
        />
      </div>}

      {/* Image */}
      <div className="m-3" onClick={() => onSelect?.(public_id)}>
        <CldImage
          alt="Football photo"
          className="h-full w-full rounded-lg object-cover brightness-90 transition-transform duration-300 group-hover:brightness-110 group-hover:scale-110"
          placeholder="blur"
          blurDataURL={blurDataUrl}
          src={public_id}
          width={400} // Aumentado para melhor qualidade no mobile
          height={400}
          crop="limit"
          format="webp"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      </div>

      {/* Selected overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/30 transition-opacity" onClick={() => onSelect?.(public_id)} />
      )}
    </div>
  )
}