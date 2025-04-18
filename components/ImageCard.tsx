import { CldImage } from 'next-cloudinary'
import { ImageProps } from 'utils/types'
import { useCallback } from 'react'

type Props = ImageProps & {
  lastViewedPhoto: string | null
  lastViewedPhotoRef: React.MutableRefObject<HTMLDivElement | null>
  isSelected?: boolean
  onSelect?: (id: number) => void
  isSelectionMode?: boolean
}

export default function ImageCard({
  id,
  public_id,
  width,
  height,
  blurDataUrl,
  lastViewedPhoto,
  lastViewedPhotoRef,
  onSelect,
}: Props) {

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('handleCheck', e.target.checked)
      e.stopPropagation()  // impede o clique de redirecionar
      onSelect?.(id)  // chama a função para marcar ou desmarcar a foto
    },
    [id, onSelect]
  )

  return (
    <div
      key={id}
      ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
      className={`group relative block w-full transition after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight`}
    >
      {/* Checkbox de seleção */}
      <div className="absolute top-2 right-2 z-30 p-1">
        <input
          type="checkbox"
          onChange={handleCheck}
          className="h-8 w-8 cursor-pointer appearance-auto accent-blue-500" // Apenas no checkbox
        />
      </div>

      {/* Imagem */}
      <CldImage
        alt="MR photo"
        className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
        style={{ transform: 'translate3d(0, 0, 0)' }}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        src={public_id}
        width={width > height ? 1280 : 853}
        height={height > width ? 1280 : 853}
        format="webp"
        loading="lazy"
        sizes="(max-width: 648px) 100vw, 25vw"
      />
    </div>
  )
}
