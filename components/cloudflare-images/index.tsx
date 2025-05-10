import GlobalLoading from 'components/loading'
import Image from 'next/image'
import { useCallback, useState } from 'react'

type Props = {
  imageUrl: string
  blurDataUrl?: string
  alt?: string
  width: number
  height: number
  onSelect?: (id: string) => void
  isSelected?: boolean
  id: string
}

export default function CloudflareImageCard({
  imageUrl,
  blurDataUrl,
  width,
  height,
  alt = 'Foto',
  onSelect,
  isSelected,
  id
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation()
      onSelect?.(id)
    },
    [id, onSelect]
  )

  return (
    <div className="group relative w-full overflow-hidden rounded-xl transition-shadow hover:shadow-lg">
      {isSelected && (
        <div className="absolute left-3 top-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheck}
            className="h-6 w-6 cursor-pointer rounded accent-blue-500"
          />
        </div>
      )}
      <div className="relative m-3" onClick={() => onSelect?.(id)}>
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          placeholder={blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={blurDataUrl}
          onLoadingComplete={() => setIsLoaded(true)}
          className={`rounded-lg object-cover brightness-90 transition-opacity transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <GlobalLoading />
          </div>
        )}
      </div>

      {isSelected && (
        <div
          className="absolute inset-0 bg-blue-500/30 transition-opacity"
          onClick={() => onSelect?.(id)}
        />
      )}
    </div>
  )
}
