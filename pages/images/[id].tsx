import GlobalLoading from 'components/loading'
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { cloudflareImage, image } from 'types'
import { findImgs } from '../api/find-images'

const CloudinaryPage = dynamic(() => import('./_cloudinary'), {
  loading: () => <GlobalLoading />,
  ssr: false
})

const CloudflarePage = dynamic(() => import('./_cloudflare'), {
  loading: () => <GlobalLoading />,
  ssr: false
})

export default function PublicFolderPage({
  images,
  isCdf,
  render,
  id,
  nextCursor
}: {
  images: image[]
  isCdf: boolean
  render: string
  id: string
  nextCursor: string
}) {
  return (
    <>
      <Head>
        <title>MR - Fotografias</title>
      </Head>
      {isCdf ? (
        <CloudflarePage
          images={images as unknown as cloudflareImage[]}
          id={id}
          render={render}
          nextCursor={nextCursor}
        />
      ) : (
        <CloudinaryPage images={images} />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.params
  const { render } = context.query

  const isCdf = 'cdf' == (render as string).toLowerCase()
  let response = await findImgs(id as string, isCdf)
  let result
  if (isCdf) result = response.data
  else result = response

  if (!result || result.length === 0) {
    return { notFound: true }
  }

  return {
    props: {
      images: result,
      isCdf: isCdf,
      render: render,
      id: id,
      nextCursor: response?.nextCursor ?? null
    }
  }
}
