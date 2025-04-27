import cloudinaryApi from 'apis/cloudinary'
import { Header } from 'components'
import ImageCard from 'components/ImageCard'
import GlobalLoading from 'components/loading'
import WhatsappButton from 'components/WhatsappButton'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Masonry } from 'react-plock'
import { useFolderStore } from 'stores/folderStore'
import { image } from 'types'
import { formatDate } from 'utils/date'
import getBase64ImageUrl from 'utils/generateBlurPlaceholder'
import { calculatePrice, formatPrice } from 'utils/priceHelper'
import { useLastViewedPhoto } from 'utils/useLastViewedPhoto'

const Home: NextPage = ({ images }: { images: image[] }) => {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState(images)
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()
  const initialLoadCount = 20
  const chunkSize = 20
  const [visibleImages, setVisibleImages] = useState<image[]>([])
  const [nextImages, setNextImages] = useState<image[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const lastViewedPhotoRef = useRef<HTMLDivElement | null>(null)
  const [isHydrated, setIsHydrated] = useState(false);

  const { folder } = useFolderStore()

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSelect = (public_id: string) => {
    setSelectedImages(prevSelected =>
      prevSelected.includes(public_id)
        ? prevSelected.filter(imagePublicId => imagePublicId !== public_id)
        : [...prevSelected, public_id]
    )
  }

  // Infinite scroll handler
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

  useEffect(() => {
    setData(images);
  }, data)

  // Clean broken and repeat images
  useEffect(() => {
    setVisibleImages(prev => [
      ...prev,
      ...nextImages.filter(
        nc =>
          !visibleImages.includes(nc) && !nc.blurDataUrl?.endsWith('base64,')
      )
    ])
  }, [nextImages])

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleImages, data])

  // Load initial images
  useEffect(() => {
    if(isHydrated && data) {
      setVisibleImages(
        data
          .slice(0, initialLoadCount)
          .filter(dt => !dt.blurDataUrl?.endsWith('base64,'))
      )
    }
  }, [data, initialLoadCount, isHydrated])

  // Scroll to last viewed photo
  useEffect(() => {
    if (lastViewedPhoto) {
      lastViewedPhotoRef.current?.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      })
      setLastViewedPhoto(null)
    }
  }, [lastViewedPhoto, setLastViewedPhoto])

  if (router.isFallback) {
    return <GlobalLoading />
  }

  return (
    <>
      <Head>
        <title>MR - Fotografias</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
        <Header showGoBack={true} />

        {folder && 
          <div className='justify-center items-center mt-6'>
            <h1 className='text-3xl font-bold text-center'>{folder.name}</h1>
            <h1 className='text-center'>{formatDate(new Date(folder.lastUpdate))}</h1>
          </div>
        }

        <main className="mx-auto max-w-[1920px] px-4 pb-32 pt-8 sm:px-6 lg:px-8">
          <div className="pt-4">
            <Masonry
              items={visibleImages}
              config={{
                columns: [2, 3, 4, 5, 6, 7, 8], // Reduzido para 4 colunas no máximo
                gap: [10, 10, 10, 10, 10, 10, 10], // Mantém o espaçamento pequeno
                media: [640, 900, 1280, 1600, 1800, 2400, 2800] // Breakpoints ajustados
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

          <div className="fixed bottom-4 left-1/2 z-40 flex w-[92%] md:w-fit -translate-x-1/2 items-center justify-between rounded-lg bg-slate-200 dark:bg-border-dark px-4 py-2 shadow-lg grid grid-cols-12">
            <div className='col-span-6 overflow-ellipsis overflow-hidden whitespace-nowrap flex-nowrap'>
              <span className="text-sm font-medium sm:text-base whitespace-nowrap">
                {selectedImages.length} {selectedImages.length > 1 ? 'fotos selecionadas' : 'foto selecionada'}
              </span>
              <p>{formatPrice(calculatePrice(selectedImages.length))}</p>
            </div>
            <div className='col-span-6 overflow-ellipsis overflow-hidden whitespace-nowrap flex-nowrap'>
              <WhatsappButton selectedImages={selectedImages} />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Home

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const { id } = context.params!

  let results = await cloudinaryApi.getAllImagesByFolder(id as string)

  let reducedResults: image[] = []

  for (let result of results?.resources) {
    reducedResults.push({
      id: result.asset_id,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format
    })
  }

  const blurImagePromises = results?.resources?.map((image) =>
    getBase64ImageUrl(image as unknown as image)
  )
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i]
  }

  if (!reducedResults || reducedResults.length === 0) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      images: reducedResults
    },
    revalidate: 60
  }
}
