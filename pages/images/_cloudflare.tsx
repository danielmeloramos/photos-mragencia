'use client'

import axios from 'axios'
import { CloudflareImageCard, Header } from 'components'
import WhatsappButton from 'components/WhatsappButton'
import { Fragment, useEffect, useState } from 'react'
import { Masonry } from 'react-plock'
import { PuffLoader } from 'react-spinners'
import { useFolderStore } from 'stores/folderStore'
import { cloudflareImage } from 'types'
import { formatDate } from 'utils/date'
import { calculatePrice, formatPrice } from 'utils/priceHelper'

export default function CloudflarePage({
  images,
  render,
  id,
  nextCursor
}: {
  images: cloudflareImage[]
  render: string
  id: string
  nextCursor: string
}) {
  const [data, setData] = useState(images)
  const [lockApiCall, setLockApiCall] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [next, setNext] = useState(nextCursor)

  const { folder } = useFolderStore()

  useEffect(() => {
    setData(images)
  }, [images])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data])

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    const threshold = 400
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      prepareForMoreImages()
    }
  }

  useEffect(() => {
    if (lockApiCall && next != null) {
      axios
        .get(
          `${window.location.origin}/api/find-images?location=${id}&icf=true&nextCursor=${next}`
        )
        .then(res => {
          setNext(res.data.nextCursor)
          setData([...data, ...res.data.data])
        })
        .finally(() => {
          setLockApiCall(false)
        })
    }
  }, [lockApiCall])

  async function prepareForMoreImages() {
    if (!lockApiCall) {
      setLockApiCall(true)
    }
  }

  const handleSelect = (public_id: string) => {
    setSelectedImages(prevSelected =>
      prevSelected.includes(public_id)
        ? prevSelected.filter(imagePublicId => imagePublicId !== public_id)
        : [...prevSelected, public_id]
    )
  }

  function getUrls() {
    return data
      .filter(obj => selectedImages.includes(obj.id))
      .map(obj => obj.public_id)
  }

  if (!data) return <></>

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
          items={data}
          config={{
            columns: [2, 3, 4, 5, 6, 7, 8],
            gap: [10, 10, 10, 10, 10, 10, 10],
            media: [640, 900, 1280, 1600, 1800, 2400, 2800]
          }}
          className="masonry-grid"
          render={({ base64, height, width, id }) => (
            <Fragment key={id}>
              <CloudflareImageCard
                id={id}
                imageUrl={base64}
                blurDataUrl={base64}
                width={Number(width)}
                height={Number(height)}
                onSelect={handleSelect}
                isSelected={selectedImages.includes(id)}
              />
            </Fragment>
          )}
        />
        {lockApiCall && next != null && (
          <div className="mb-6 flex items-center justify-center">
            <PuffLoader color="#777" size={80} />
          </div>
        )}

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
            <WhatsappButton selectedImages={getUrls()} isFullUrl={true} />
          </div>
        </div>
      </main>
    </div>
  )
}
