'use client'

import { Header } from 'components'
import ImageCard from 'components/ImageCard'
import WhatsappButton from 'components/WhatsappButton'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Masonry } from 'react-plock'
import { useFolderStore } from 'stores/folderStore'
import { image } from 'types'
import { formatDate } from 'utils/date'
import { calculatePrice, formatPrice } from 'utils/priceHelper'
import { useLastViewedPhoto } from 'utils/useLastViewedPhoto'

export default function CloudinaryPage({ images }: { images: image[] }) {
  const [data, setData] = useState(images)
  const [visibleImages, setVisibleImages] = useState<image[]>([])
  const [nextImages, setNextImages] = useState<image[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const lastViewedPhotoRef = useRef<HTMLDivElement | null>(null)
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()

  const initialLoadCount = 20
  const chunkSize = 20
  const { folder } = useFolderStore()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    setData(images)
  }, [images])

  useEffect(() => {
    if (isHydrated && data) {
      setVisibleImages(
        data
          .slice(0, initialLoadCount)
          .filter(dt => !dt.blurDataUrl?.endsWith('base64,'))
      )
    }
  }, [data, initialLoadCount, isHydrated])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleImages, data])

  useEffect(() => {
    setVisibleImages(prev => [
      ...prev,
      ...nextImages.filter(
        nc =>
          !visibleImages.includes(nc) && !nc.blurDataUrl?.endsWith('base64,')
      )
    ])
  }, [nextImages])

  useEffect(() => {
    if (lastViewedPhoto) {
      lastViewedPhotoRef.current?.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      })
      setLastViewedPhoto(null)
    }
  }, [lastViewedPhoto, setLastViewedPhoto])

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    const threshold = 400
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      const nextChunk = data.slice(
        visibleImages.length,
        visibleImages.length + chunkSize
      )
      setNextImages(nextChunk)
    }
  }

  const handleSelect = (public_id: string) => {
    setSelectedImages(prevSelected =>
      prevSelected.includes(public_id)
        ? prevSelected.filter(imagePublicId => imagePublicId !== public_id)
        : [...prevSelected, public_id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
      <Header showGoBack={true} />
      {folder && (
        <div className="mt-6 items-center justify-center">
          <h1 className="text-center text-3xl font-bold">{folder.name}</h1>
          <h1 className="text-center">
            {formatDate(new Date(folder.lastUpdate))}
          </h1>
        </div>
      )}

      <main className="mx-auto max-w-[1920px] px-4 pb-32 pt-8 sm:px-6 lg:px-8">
        <Masonry
          items={visibleImages}
          config={{
            columns: [2, 3, 4, 5, 6, 7, 8],
            gap: [10, 10, 10, 10, 10, 10, 10],
            media: [640, 900, 1280, 1600, 1800, 2400, 2800]
          }}
          className="masonry-grid"
          render={({ id, public_id, blurDataUrl, width, height }) => (
            <Fragment key={id}>
              <ImageCard
                id={id}
                public_id={public_id}
                blurDataUrl={blurDataUrl}
                width={width}
                height={height}
                lastViewedPhoto={lastViewedPhoto}
                lastViewedPhotoRef={lastViewedPhotoRef}
                onSelect={handleSelect}
                isSelected={selectedImages.includes(public_id)}
              />
            </Fragment>
          )}
        />

        <div className="fixed bottom-4 left-1/2 z-40 flex grid w-[92%] -translate-x-1/2 grid-cols-12 items-center justify-between rounded-lg bg-slate-200 px-4 py-2 shadow-lg dark:bg-border-dark md:w-fit">
          <div className="col-span-6 flex-nowrap overflow-hidden overflow-ellipsis whitespace-nowrap">
            <span className="whitespace-nowrap text-sm font-medium sm:text-base">
              {selectedImages.length}{' '}
              {selectedImages.length > 1
                ? 'fotos selecionadas'
                : 'foto selecionada'}
            </span>
            <p>{formatPrice(calculatePrice(selectedImages.length))}</p>
          </div>
          <div className="col-span-6 flex-nowrap overflow-hidden overflow-ellipsis whitespace-nowrap">
            <WhatsappButton selectedImages={selectedImages} isFullUrl={false} />
          </div>
        </div>
      </main>
    </div>
  )
}
