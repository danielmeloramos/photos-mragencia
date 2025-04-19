import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useState, useEffect, useRef } from 'react'
import { Masonry } from 'react-plock'
import cloudinary from 'utils/cloudinary'
import getBase64ImageUrl from 'utils/generateBlurPlaceholder'
import type { ImageProps } from 'utils/types'
import { useLastViewedPhoto } from 'utils/useLastViewedPhoto'
import Menu from 'components/Menu'
import Modal from 'components/Modal'
import ImageCard from 'components/ImageCard'
import WhatsappButton from 'components/WhatsappButton'
import SocialLinks from 'components/SocialLinks'

const Home: NextPage = ({
  images,
  folders,
}: {
  images: ImageProps[]
  folders: string[]
}) => {
  const [data, setData] = useState(images)
  const [selectedFolder, setSelectedFolder] = useState('All')
  const router = useRouter()
  const { photoId } = router.query
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()
  const initialLoadCount = 20
  const chunkSize = 20
  const [visibleImages, setVisibleImages] = useState<ImageProps[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const lastViewedPhotoRef = useRef<HTMLDivElement | null>(null)

  // Handle image selection
  const handleSelect = (public_id: string) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(public_id)
        ? prevSelected.filter((imagePublicId) => imagePublicId !== public_id)
        : [...prevSelected, public_id]
    )
  }

  // Calculate price
  const calculatePrice = () => {
    if (selectedImages.length === 0) return '0,00'
    const price = selectedImages.length === 1 ? 8 : 8 + (selectedImages.length - 1) * 5
    return price.toFixed(2).replace('.', ',')
  }

  // Infinite scroll handler
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    const threshold = 400
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      const nextChunk = data.slice(visibleImages.length, visibleImages.length + chunkSize)
      setVisibleImages((prev) => [...prev, ...nextChunk])
    }
  }

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleImages, data])

  // Load initial images
  useEffect(() => {
    setVisibleImages(data.slice(0, initialLoadCount))
  }, [data, initialLoadCount])

  // Filter images by selected folder
  useEffect(() => {
    setData(
      images.filter(({ folder }) => (selectedFolder === 'All' ? true : folder === selectedFolder))
    )
    setVisibleImages([]) // Reset visible images when folder changes
  }, [selectedFolder, images])

  // Scroll to last viewed photo
  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      setLastViewedPhoto(null)
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto])

  return (
    <>
      <Head>
        <title>MR - Fotografias</title>
        <meta
          property="og:image"
          content="https://og-image-service.willianjusten.com.br/Photos.png"
        />
        <meta
          name="twitter:image"
          content="https://og-image-service.willianjusten.com.br/Photos.png"
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Updated Header */}
        <header className="sticky top-0 z-50 bg-white shadow-md">
          <div className="mx-auto max-w-[1920px] px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <h1 className="text-xl font-bold text-gray-900">MRFotografias</h1>
              </div>
            </div>
            <SocialLinks className="flex gap-4" />
          </div>
        </header>

        <main className="mx-auto max-w-[1920px] px-4 py-6 pb-32 sm:px-6 lg:px-8 pt-20">
          {/* Modal for image preview */}
          {photoId && (
            <Modal
              images={images}
              onClose={() => setLastViewedPhoto(photoId)}
            />
          )}

          {/* Masonry Grid */}
          <div className="pt-4">
          <Masonry
  items={visibleImages}
  config={{
    columns: [1, 2, 3, 4], // Reduzido para 4 colunas no máximo
    gap: [4, 4, 4, 4], // Mantém o espaçamento pequeno
    media: [640, 900, 1280, 1600], // Breakpoints ajustados
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
          </div>

          {/* Menu */}
          <Menu
            folders={folders}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />

          {/* Floating Price and WhatsApp Button */}
          <div className="fixed bottom-4 left-1/2 z-40 flex w-full max-w-xs -translate-x-1/2 items-center justify-between rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg sm:max-w-sm">
            <span className="text-sm font-medium sm:text-base">
              Preço: R$ {calculatePrice()}
            </span>
            <WhatsappButton selectedImages={selectedImages} />
          </div>
        </main>
      </div>
    </>
  )
}

export default Home

// getStaticProps remains unchanged
async function getAllResults(cursor: string | null = null, allResources: any[] = []) {
  const results = await cloudinary.v2.search
    .sort_by('folder', 'desc')
    .max_results(2000)
    .next_cursor(cursor)
    .execute()

  allResources.push(...results.resources)

  if (results.next_cursor) {
    return getAllResults(results.next_cursor, allResources)
  }

  return { resources: allResources }
}

export async function getStaticProps() {
  const results = await getAllResults()

  let reducedResults: ImageProps[] = []
  let folders: string[] = []

  let i = 0
  for (let result of results?.resources) {
    reducedResults.push({
      id: i,
      folder: result.asset_folder,
      height: result.height,
      width: result.width,
      aspect_ratio: result.aspect_ratio,
      public_id: result.public_id,
      format: result.format,
    })

    if (!folders.includes(result.asset_folder)) {
      folders.push(result.asset_folder)
    }
    i++
  }

  const blurImagePromises = results?.resources?.map((image: ImageProps) =>
    getBase64ImageUrl(image)
  )
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i]
  }

  return {
    props: {
      images: reducedResults,
      folders,
    },
  }
}